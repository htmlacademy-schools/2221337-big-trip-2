import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventView from '../view/trip-event-view.js';
import TripEventAddView from '../view/trip-event-add-view.js';
import TripEventEditView from '../view/trip-event-edit-view.js';
import TripEventOffer from '../view/trip-event-offers-view.js';
import TripEventDestination from '../view/trip-event-destionation-view.js';
import { render } from '../render.js';
import { isEscapePushed } from '../utils.js';

const MIN_TRIP_EVENT_INDEX = 2;

export default class TripEventsPresenter{
  #tripEventsModel;
  #tripEvents;
  #offersModel;
  #offersByType;
  #tripEventsComponent;
  #tripEventsList;
  #newTripEvent;

  constructor(tripEventsComponent, tripEventsModel, offersModel){
    this.#tripEventsModel = tripEventsModel;
    this.#tripEvents = [...this.#tripEventsModel.tripEvents];

    this.#offersModel = offersModel;
    this.#offersByType = [...this.#offersModel.offersByType];

    this.#tripEventsComponent = tripEventsComponent;
    this.#tripEventsList = new TripEventsListView();

    this.#newTripEvent = new TripEventAddView(this.#tripEvents[0]);
  }

  #renderTripEventForm(editForm){
    render(editForm, this.#tripEventsList.element);
    render(new TripEventOffer(editForm.tripEvent, this.#offersByType), editForm.element.querySelector('.event__details'));
    render(new TripEventDestination(editForm.tripEvent), editForm.element.querySelector('.event__details'));
  }

  #renderTripEvent(tripEvent) {
    const newEvent = new TripEventView(tripEvent, this.#offersByType);
    const tripEventEditForm = new TripEventEditView(tripEvent);

    const eventDetailsComponent = tripEventEditForm.element.querySelector('.event__details');
    const offersComponent = new TripEventOffer(tripEventEditForm.tripEvent, this.#offersByType);
    const destination = new TripEventDestination(tripEventEditForm.tripEvent);

    eventDetailsComponent.appendChild(offersComponent.element);
    eventDetailsComponent.appendChild(destination.element);

    const replaceEventListChildren = (newChild, oldChild) => {
      this.#tripEventsList.element.replaceChild(newChild, oldChild);
    };

    const onEscapeKeyDown = (evt) => {
      if(isEscapePushed(evt)){
        evt.preventDefault();
        replaceEventListChildren(newEvent.element, tripEventEditForm.element);
        document.removeEventListener('keydown', onEscapeKeyDown);
      }
    };

    const onFormOpenButtonClick = () => {
      replaceEventListChildren(tripEventEditForm.element, newEvent.element);
      document.addEventListener('keydown', onEscapeKeyDown);
    };

    const onFormCloseButtonClick = () => {
      replaceEventListChildren(newEvent.element, tripEventEditForm.element);
      document.removeEventListener('keydown', onEscapeKeyDown);
    };

    const onEditFormSubmit = (evt) => {
      evt.preventDefault();
      onFormCloseButtonClick();
    };

    newEvent.element.querySelector('.event__rollup-btn').addEventListener('click', onFormOpenButtonClick);

    tripEventEditForm.element.addEventListener('submit', onEditFormSubmit);

    tripEventEditForm.element.querySelector('.event__rollup-btn').addEventListener('click', onFormCloseButtonClick);

    render(newEvent, this.#tripEventsList.element);
  }

  init(){
    render(new SortView(), this.#tripEventsComponent);
    render(this.#tripEventsList, this.#tripEventsComponent);

    this.#renderTripEventForm(this.#newTripEvent);

    for(let i = MIN_TRIP_EVENT_INDEX; i < this.#tripEvents.length; i++){
      this.#renderTripEvent(this.#tripEvents[i]);
    }
  }
}
