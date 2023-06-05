import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import LoadingView from '../view/loading-view.js';
import ErrorMessageView from '../view/error-meassage-view.js';
import EmptyTripEventsList from '../view/empty-trip-events-list-view.js';
import TripEventPresenter from './trip-event-presenter.js';
import TripEventNewPresenter from './trip-event-new-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { remove, render } from '../framework/render.js';
import { FilterTypes, filter } from '../utils/filter.js';
import { SortType, sortTripEvents } from '../utils/sort.js';
import { UserAction, UpdateType } from '../utils/common.js';

const TimeLimit = {
  MIN_LIMIT: 350,
  MAX_LIMIT: 1000,
};

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

  #loadingComponent;
  #isLoading;

  #errorMessageComponent;
  #uiBlocker;

  constructor(tripEventsComponent, tripEventsModel, offersModel, destinationModel, filterModel) {
    this.#tripEventsModel = tripEventsModel;

    this.#offersModel = offersModel;
    this.#destinationModel = destinationModel;

    this.#tripEventsComponent = tripEventsComponent;
    this.#tripEventsList = new TripEventsListView();

    this.#tripEventsPresenters = new Map();

    this.#filterModel = filterModel;

    this.#sortComponent = null;
    this.#currentSortType = SortType.DAY;

    this.#loadingComponent = new LoadingView();
    this.#isLoading = true;

    this.#errorMessageComponent = new ErrorMessageView();
    this.#uiBlocker = new UiBlocker(TimeLimit.MIN_LIMIT, TimeLimit.MAX_LIMIT);

    this.#tripEventsModel.addObserver(this.#onModelDataChange);
    this.#filterModel.addObserver(this.#onModelDataChange);

    this.#offersModel.addObserver(this.#onModelDataChange);
    this.#destinationModel.addObserver(this.#onModelDataChange);
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
    if(this.#isLoading) {
      this.#renderLoadingMessage();
      return;
    }

    if(!this.tripEvents.length) {
      this.#renderNoEventsMessage();
      return;
    }

    this.#renderSort();
    this.#renderTripEventsList();
  }

  #renderLoadingMessage() {
    render(this.#loadingComponent, this.#tripEventsComponent);
  }

  #renderNoEventsMessage() {
    this.#noEventsMessage = new EmptyTripEventsList(this.#filterModel.filterType);
    render(this.#noEventsMessage, this.#tripEventsComponent);
  }

  #renderErrorMessage() {
    render(this.#errorMessageComponent, this.#tripEventsComponent);
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
    const tripEventPresenter = new TripEventPresenter(this.#tripEventsList.element, this.#offersModel.offersByType,
      this.#destinationModel.destinations, this.#destinationModel.destinationNames, this.#handleViewAction, this.#onTripEventModeChange);
    tripEventPresenter.init(tripEvent);
    this.#tripEventsPresenters.set(tripEvent.id, tripEventPresenter);
  }

  #clearBoard(sortType) {
    this.#tripEventNewPresenter.destroy();

    this.#tripEventsPresenters.forEach((point) => point.destroy());
    this.#tripEventsPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#noEventsMessage);

    if(this.#noEventsMessage) {
      remove(this.#noEventsMessage);
    }

    this.#currentSortType = sortType;
  }

  #handleViewAction = async (userActionType, updateType, updatedItem) => {
    this.#uiBlocker.block();

    switch(userActionType) {
      case UserAction.ADD_TRIP_EVENT:
        this.#tripEventNewPresenter.setSaving();

        try {
          await this.#tripEventsModel.addTripEvent(updateType, updatedItem);
        } catch(err) {
          this.#tripEventNewPresenter.setAborting();
        }
        break;
      case UserAction.UPDATE_TRIP_EVENT:
        this.#tripEventsPresenters.get(updatedItem.id).setSaving();

        try {
          await this.#tripEventsModel.updateTripEvent(updateType, updatedItem);
        } catch(err) {
          this.#tripEventsPresenters.get(updatedItem.id).setAborting();
        }
        break;
      case UserAction.DELETE_TRIP_EVENT:
        this.#tripEventsPresenters.get(updatedItem.id).setDeleting();

        try {
          await this.#tripEventsModel.deleteTripEvent(updateType, updatedItem);
        } catch(err) {
          this.#tripEventsPresenters.get(updatedItem.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #onModelDataChange = (updateType, updatedItem) => {
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);

        if(!this.#offersModel.offersByType.length || !this.#destinationModel.destinations.length) {
          this.#renderErrorMessage();
          break;
        }

        this.#tripEventNewPresenter = new TripEventNewPresenter(this.#tripEventsList.element, this.#offersModel.offersByType,
          this.#destinationModel.destinations, this.#destinationModel.destinationNames, this.#handleViewAction);

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
