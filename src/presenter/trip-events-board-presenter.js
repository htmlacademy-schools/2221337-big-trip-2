import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EmptyTripEventsList from '../view/empty-trip-events-list-view.js';
import TripEventPresenter from './trip-event-presenter.js';
import { render } from '../framework/render.js';
import { FilterTypes } from '../utils/filter.js';
import { updateItem } from '../utils/common.js';
import { SortType, sortTripEvents } from '../utils/sort.js';

export default class TripEventsBoardPresenter {
  #tripEventsModel;
  #tripEvents;
  #tripEventsComponent;
  #tripEventsList;
  #tripEventsPresenters;

  #offersModel;
  #offersByType;

  #filterType;

  #sortComponent;
  #currentSortType;
  #sourcedTripEvents;

  constructor(tripEventsComponent, tripEventsModel, offersModel) {
    this.#tripEventsModel = tripEventsModel;
    this.#tripEvents = [...this.#tripEventsModel.tripEvents];

    this.#offersModel = offersModel;
    this.#offersByType = [...this.#offersModel.offersByType];

    this.#tripEventsComponent = tripEventsComponent;
    this.#tripEventsList = new TripEventsListView();

    this.#tripEventsPresenters = new Map();

    this.#filterType = FilterTypes.EVERYTHING;

    this.#sortComponent = new SortView();
    this.#currentSortType = SortType.DAY;
    this.#sourcedTripEvents = [...this.#tripEventsModel.tripEvents];
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
    render(this.#sortComponent, this.#tripEventsComponent);

    this.#sortComponent.setSortTypeChangeHandler(this.#onSortTypeChange);
  }

  #renderTripEventsList() {
    render(this.#tripEventsList, this.#tripEventsComponent);

    sortTripEvents[this.#currentSortType](this.#tripEvents);
    this.#renderTripEvents();
  }

  #renderTripEvents() {
    for(let i = 0; i < this.#tripEvents.length; i++) {
      this.#renderTripEvent(this.#tripEvents[i]);
    }
  }

  #renderTripEvent(tripEvent) {
    const tripEventPresenter = new TripEventPresenter(this.#tripEventsList.element, this.#offersByType, this.#onTripEventChange, this.#onTripEventModeChange);
    tripEventPresenter.init(tripEvent);
    this.#tripEventsPresenters.set(tripEvent.id, tripEventPresenter);
  }

  #clearTripEventsList() {
    this.#tripEventsPresenters.forEach((point) => point.destroy());
    this.#tripEventsPresenters.clear();
  }

  #sortTripEvents = (sortType) => {
    sortTripEvents[sortType](this.#tripEvents);

    this.#clearTripEventsList();
    this.#renderTripEvents();
  };

  #onSortTypeChange = (sortType) => {
    if(sortType === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#sortTripEvents(sortType);
  };

  #onTripEventChange = (updatedItem) => {
    this.#tripEvents = updateItem(this.#tripEvents, updatedItem);
    this.#sourcedTripEvents = updateItem(this.#sourcedTripEvents, updatedItem);

    this.#tripEventsPresenters.get(updatedItem.id).init(updatedItem);

    this.#sortTripEvents(this.#currentSortType);
  };

  #onTripEventModeChange = () => {
    this.#tripEventsPresenters.forEach((tripEvent) => tripEvent.resetTripEventMode());
  };
}
