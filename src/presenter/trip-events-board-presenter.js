import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EmptyTripEventsList from '../view/empty-trip-events-list-view.js';
import TripEventPresenter from './trip-event-presenter.js';
import TripEventNewPresenter from './trip-event-new-presenter.js';
import { remove, render } from '../framework/render.js';
import { FilterTypes, filter } from '../utils/filter.js';
import { SortType, sortTripEvents } from '../utils/sort.js';
import { UserAction, UpdateType } from '../utils/common.js';

export default class TripEventsBoardPresenter {
  #tripEventsModel;
  #tripEventsComponent;
  #tripEventsList;
  #tripEventsPresenters;

  #tripEventNewPresenter;

  #offersModel;
  #destinationModel;

  #filterModel;
  #noEventsMessage = null;

  #sortComponent;
  #currentSortType;

  constructor(tripEventsComponent, tripEventsModel, offersModel, destinationModel, filterModel) {
    this.#tripEventsModel = tripEventsModel;

    this.#offersModel = offersModel;
    this.#destinationModel = destinationModel;

    this.#tripEventsComponent = tripEventsComponent;
    this.#tripEventsList = new TripEventsListView();

    this.#tripEventsPresenters = new Map();
    this.#tripEventNewPresenter = new TripEventNewPresenter(this.#tripEventsList.element, this.#offersModel.offersByType,
      this.#destinationModel.destinations, this.#handleViewAction);

    this.#filterModel = filterModel;

    this.#sortComponent = null;
    this.#currentSortType = SortType.DAY;

    this.#tripEventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard();
  }

  get tripEvents() {
    const filteredTripEvents = filter[this.#filterModel.filterType]([...this.#tripEventsModel.tripEvents]);
    return sortTripEvents[this.#currentSortType](filteredTripEvents);
  }

  createTripEvent(destroyCallback) {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilterType(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#tripEventNewPresenter.init(destroyCallback);
  }

  #renderBoard() {
    if(this.tripEvents.length === 0){
      this.#renderNoEventsMessage();
      return;
    }

    this.#renderSort();
    this.#renderTripEventsList();
  }

  #renderNoEventsMessage() {
    this.#noEventsMessage = new EmptyTripEventsList(this.#filterModel.filterType);
    render(this.#noEventsMessage, this.#tripEventsComponent);
  }

  #renderSort() {
    this.#sortComponent = new SortView(this.#currentSortType);

    this.#sortComponent.setSortTypeChangeHandler(this.#onSortTypeChange);
    render(this.#sortComponent, this.#tripEventsComponent);
  }

  #renderTripEventsList() {
    render(this.#tripEventsList, this.#tripEventsComponent);

    this.#renderTripEvents();
  }

  #renderTripEvents() {
    this.tripEvents.forEach((tripEvent) => this.#renderTripEvent(tripEvent));
  }

  #renderTripEvent(tripEvent) {
    const tripEventPresenter = new TripEventPresenter(this.#tripEventsList.element, this.#offersModel.offersByType, this.#handleViewAction, this.#onTripEventModeChange);
    tripEventPresenter.init(tripEvent);
    this.#tripEventsPresenters.set(tripEvent.id, tripEventPresenter);
  }

  #clearBoard(sortType) {
    this.#tripEventNewPresenter.destroy();

    this.#tripEventsPresenters.forEach((point) => point.destroy());
    this.#tripEventsPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noEventsMessage);

    if(this.#noEventsMessage) {
      remove(this.#noEventsMessage);
    }

    this.#currentSortType = sortType;
  }

  #handleViewAction = (userActionType, updateType, updatedItem) => {
    switch(userActionType) {
      case UserAction.ADD_TRIP_EVENT:
        this.#tripEventsModel.addTripEvent(updateType, updatedItem);
        break;
      case UserAction.UPDATE_TRIP_EVENT:
        this.#tripEventsModel.updateTripEvent(updateType, updatedItem);
        break;
      case UserAction.DELETE_TRIP_EVENT:
        this.#tripEventsModel.deleteTripEvent(updateType, updatedItem);
        break;
    }
  };

  #handleModelEvent = (updateType, updatedItem) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#tripEventsPresenters.get(updatedItem.id).init(updatedItem);
        break;
      case UpdateType.MINOR:
        this.#clearBoard(this.#currentSortType);
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard(SortType.DAY);
        this.#renderBoard();
        break;
    }
  };

  #onSortTypeChange = (sortType) => {
    if(sortType === this.#currentSortType) {
      return;
    }

    this.#clearBoard(sortType);
    this.#renderBoard();
  };

  #onTripEventModeChange = () => {
    this.#tripEventNewPresenter.destroy();

    this.#tripEventsPresenters.forEach((tripEvent) => tripEvent.resetTripEventMode());
  };
}
