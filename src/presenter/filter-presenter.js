import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { SortType, sortTripEvents } from '../utils/sort.js';
import { UpdateType } from '../utils/common.js';

export default class FilterPresenter {
  #filterComponent = null;
  #filterContainer;

  #tripInfoComponent = null;
  #tripInfoContainer;

  #filterModel;
  #tripEventModel;

  #offersModel;
  #destinationsModel;

  constructor(filterContainer, tripInfoContainer, filterModel, tripEventModel, offersModel, destinationsModel) {
    this.#filterContainer = filterContainer;
    this.#tripInfoContainer = tripInfoContainer;

    this.#filterModel = filterModel;
    this.#tripEventModel = tripEventModel;

    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#tripEventModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return Array.from(Object.entries(filter), ([filterType, filterEvents]) => ({
      type: filterType,
      count: filterEvents(this.#tripEventModel.tripEvents).length,
    }));
  }

  get tripEvents() {
    return sortTripEvents[SortType.DAY](this.#tripEventModel.tripEvents);
  }

  init() {
    const previousFilterComponent = this.#filterComponent;
    const previousInfoComponent = this.#tripInfoComponent;

    const tripEvents = this.tripEvents;

    if(tripEvents.length && this.#offersModel.offersByType.length && this.#destinationsModel.destinations.length) {
      this.#tripInfoComponent = new TripInfoView(tripEvents, this.#getOverallTripPrice(tripEvents), this.#destinationsModel.destinations);
    }

    this.#filterComponent = new FilterView(this.filters, this.#filterModel.filterType);
    this.#filterComponent.setFilterTypeChangeHandler(this.#onFilterTypeChange);

    if(previousInfoComponent) {
      replace(this.#tripInfoComponent, previousInfoComponent);
      remove(previousInfoComponent);
    } else if (this.#tripInfoComponent) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
    }

    if(!previousFilterComponent) {
      if(!previousInfoComponent && this.#tripInfoComponent) {
        render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      }

      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, previousFilterComponent);
    remove(previousFilterComponent);
  }

  #getOverallTripPrice(tripEvents) {
    let sum = 0;

    for(const point of tripEvents) {
      sum += point.basePrice;

      const currentOffers = this.#offersModel.offersByType.find((offer) => offer.type === point.type).offers;

      point.offers.forEach((offer) => {
        sum += currentOffers.find((currentOffer) => currentOffer.id === offer).price;
      });
    }

    return sum;
  }

  #handleModelEvent = () => {
    this.init();
  };

  #onFilterTypeChange = (filterType) => {
    if(this.#filterModel.filterType === filterType) {
      return;
    }

    this.#filterModel.setFilterType(UpdateType.MAJOR, filterType);
  };
}
