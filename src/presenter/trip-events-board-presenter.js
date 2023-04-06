import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventView from '../view/trip-event-view.js';
import TripEventEditView from '../view/trip-event-edit-view.js';
import TripEventOfferView from '../view/trip-event-offers-view.js';
import TripEventDestination from '../view/trip-event-destionation-view.js';
import EmptyTripEventsList from '../view/empty-trip-events-list-view.js';
import { render, replace } from '../framework/render.js';
import { isEscapePushed, PointMode } from '../utils/common.js';
import { FilterTypes } from '../utils/filter.js';

export default class TripEventsPresenter {
  #tripEventsModel;
  #tripEvents;
  #offersModel;
  #offersByType;
  #tripEventsComponent;
  #tripEventsList;
  #eventsForms;
  #filterType;

  constructor(tripEventsComponent, tripEventsModel, offersModel) {
    this.#tripEventsModel = tripEventsModel;
    this.#tripEvents = [...this.#tripEventsModel.tripEvents];

    this.#offersModel = offersModel;
    this.#offersByType = [...this.#offersModel.offersByType];

    this.#tripEventsComponent = tripEventsComponent;
    this.#tripEventsList = new TripEventsListView();

    this.#eventsForms = new Map();

    this.#filterType = FilterTypes.EVERYTHING;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    if(this.#tripEvents.length === 0){
      render(new EmptyTripEventsList(this.#filterType), this.#tripEventsComponent);
      return;
    }

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

    const offersComponent = new TripEventOfferView(tripEventEditForm.tripEvent, this.#offersByType);
    const destination = new TripEventDestination(tripEventEditForm.tripEvent);

    render(offersComponent, eventDetailsComponent);
    render(destination, eventDetailsComponent);

    const onEscapeKeyDown = (evt) => {
      if(isEscapePushed(evt)) {
        evt.preventDefault();

        if(newEvent.pointMode === PointMode.EDITING) {
          replace(newEvent, tripEventEditForm);
        }

        newEvent.pointMode = PointMode.DEFAULT;
        document.removeEventListener('keydown', onEscapeKeyDown);
      }
    };

    const closeAllForms = () => {
      for (const [point, eventForm] of this.#eventsForms){
        if(point.pointMode === PointMode.EDITING){
          point.pointMode = PointMode.DEFAULT;
          replace(point, eventForm);
        }
      }
    };

    const onFormOpenButtonClick = () => {
      closeAllForms();

      newEvent.pointMode = PointMode.EDITING;
      replace(tripEventEditForm, newEvent);

      document.addEventListener('keydown', onEscapeKeyDown);
    };

    const onFormCloseButtonClick = () => {
      if(newEvent.pointMode === PointMode.EDITING) {
        replace(newEvent, tripEventEditForm);
      }

      newEvent.pointMode = PointMode.DEFAULT;
      document.removeEventListener('keydown', onEscapeKeyDown);
    };

    newEvent.setFormOpenClickHandler(onFormOpenButtonClick);

    tripEventEditForm.setFormSubmitHandler(onFormCloseButtonClick);

    tripEventEditForm.setFormCloseClickHandler(onFormCloseButtonClick);

    this.#eventsForms.set(newEvent, tripEventEditForm);

    render(newEvent, this.#tripEventsList.element);
  }
}
