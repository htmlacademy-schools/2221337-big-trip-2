import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventView from '../view/trip-event-view.js';
import TripEventEditView from '../view/trip-event-edit-view.js';
import TripEventOffer from '../view/trip-event-offers-view.js';
import TripEventDestination from '../view/trip-event-destionation-view.js';
import { render } from '../render.js';
import { isEscapePushed, PointMode } from '../utils.js';

export default class TripEventsPresenter {
  #tripEventsModel;
  #tripEvents;
  #offersModel;
  #offersByType;
  #tripEventsComponent;
  #tripEventsList;
  #eventsForms;

  constructor(tripEventsComponent, tripEventsModel, offersModel) {
    this.#tripEventsModel = tripEventsModel;
    this.#tripEvents = [...this.#tripEventsModel.tripEvents];

    this.#offersModel = offersModel;
    this.#offersByType = [...this.#offersModel.offersByType];

    this.#tripEventsComponent = tripEventsComponent;
    this.#tripEventsList = new TripEventsListView();

    this.#eventsForms = new Map();
  }

  init() {
    render(new SortView(), this.#tripEventsComponent);
    render(this.#tripEventsList, this.#tripEventsComponent);

    for(let i = 0; i < this.#tripEvents.length; i++) {
      this.#renderTripEvent(this.#tripEvents[i]);
    }
  }

  #renderTripEvent(tripEvent) {
    const newEvent = new TripEventView(tripEvent, this.#offersByType);
    const tripEventEditForm = new TripEventEditView(tripEvent);

    const eventDetailsComponent = tripEventEditForm.element.querySelector('.event__details');
    const offersComponent = new TripEventOffer(tripEventEditForm.tripEvent, this.#offersByType);
    const destination = new TripEventDestination(tripEventEditForm.tripEvent);

    render(offersComponent, eventDetailsComponent);
    render(destination, eventDetailsComponent);

    const replaceEventListChildren = (newChild, oldChild) => {
      this.#tripEventsList.element.replaceChild(newChild, oldChild);
    };

    const onEscapeKeyDown = (evt) => {
      if(isEscapePushed(evt)) {
        evt.preventDefault();
        if(newEvent.pointMode === PointMode.EDITING) {
          replaceEventListChildren(newEvent.element, tripEventEditForm.element);
        }
        newEvent.pointMode = PointMode.DEFAULT;
        document.removeEventListener('keydown', onEscapeKeyDown);
      }
    };

    const closeAllForms = () => {
      for (const [point, eventForm] of this.#eventsForms){
        if(point.pointMode === PointMode.EDITING){
          point.pointMode = PointMode.DEFAULT;
          replaceEventListChildren(point.element, eventForm.element);
        }
      }
    };

    const onFormOpenButtonClick = () => {
      closeAllForms();
      newEvent.pointMode = PointMode.EDITING;
      replaceEventListChildren(tripEventEditForm.element, newEvent.element);
      document.addEventListener('keydown', onEscapeKeyDown);
    };

    const onFormCloseButtonClick = () => {
      if(newEvent.pointMode === PointMode.EDITING) {
        replaceEventListChildren(newEvent.element, tripEventEditForm.element);
      }
      newEvent.pointMode = PointMode.DEFAULT;
      document.removeEventListener('keydown', onEscapeKeyDown);
    };

    const onEditFormSubmit = (evt) => {
      evt.preventDefault();
      onFormCloseButtonClick();
    };

    newEvent.element.querySelector('.event__rollup-btn').addEventListener('click', onFormOpenButtonClick);

    tripEventEditForm.element.querySelector('form').addEventListener('submit', onEditFormSubmit);

    tripEventEditForm.element.querySelector('.event__rollup-btn').addEventListener('click', onFormCloseButtonClick);

    this.#eventsForms.set(newEvent, tripEventEditForm);

    render(newEvent, this.#tripEventsList.element);
  }
}
