import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EmptyTripEventsList from '../view/empty-trip-events-list-view.js';
import TripEventPresenter from './trip-event-presenter.js';
import { render } from '../framework/render.js';
import { FilterTypes } from '../utils/filter.js';
import { updateItem } from '../utils/common.js';

export default class TripEventsBoardPresenter {
  #tripEventsModel;
  #tripEvents;
  #offersModel;
  #offersByType;
  #tripEventsComponent;
  #tripEventsList;
  #filterType;
  #tripEventsPresenters;

  constructor(tripEventsComponent, tripEventsModel, offersModel) {
    this.#tripEventsModel = tripEventsModel;
    this.#tripEvents = [...this.#tripEventsModel.tripEvents];

    this.#offersModel = offersModel;
    this.#offersByType = [...this.#offersModel.offersByType];

    this.#tripEventsComponent = tripEventsComponent;
    this.#tripEventsList = new TripEventsListView();

    this.#tripEventsPresenters = new Map();

    this.#filterType = FilterTypes.EVERYTHING;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    if(this.#tripEvents.length === 0){
      this.#renderNoEventsMessage();
      return;
    }

    this.#renderSort();
    this.#renderTripEventsList();
  }

  #renderNoEventsMessage() {
    render(new EmptyTripEventsList(this.#filterType), this.#tripEventsComponent);
  }

  #renderSort() {
    render(new SortView(), this.#tripEventsComponent);
  }

  #renderTripEventsList() {
    render(this.#tripEventsList, this.#tripEventsComponent);

    this.#renderTripEvents();
  }

  #renderTripEvents() {
    for(let i = 0; i < this.#tripEvents.length; i++) {
      this.#renderTripEvent(this.#tripEvents[i]);
    }
  }

  #onTripEventChange = (updatedItem) => {
    this.#tripEvents = updateItem(this.#tripEvents, updatedItem);
    this.#tripEventsPresenters.get(updatedItem.id).init(updatedItem);
  };

  #onTripEventModeChange = () => {
    this.#tripEventsPresenters.forEach((tripEvent) => tripEvent.resetTripEventMode());
  };

  #renderTripEvent(tripEvent) {
    const tripEventPresenter = new TripEventPresenter(this.#tripEventsList.element, this.#offersByType, this.#onTripEventChange, this.#onTripEventModeChange);
    tripEventPresenter.init(tripEvent);
    this.#tripEventsPresenters.set(tripEvent.id, tripEventPresenter);
  }
}
