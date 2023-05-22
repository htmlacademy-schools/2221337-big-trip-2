import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/common.js';

export default class TripEventsModel extends Observable {
  #tripEventApiService;
  #tripEvents = [];

  constructor(tripEventApiService) {
    super();
    this.#tripEventApiService = tripEventApiService;
  }

  init = async () => {
    try {
      const tripEvents = await this.#tripEventApiService.tripEvents;
      this.#tripEvents = tripEvents.map(this.#adaptToClient);
    } catch(err) {
      this.#tripEvents = [];
    }

    this._notify(UpdateType.INIT);
  };

  get tripEvents() {
    return this.#tripEvents;
  }

  addTripEvent = (updateType, updatedItem) => {
    this.#tripEvents = [updatedItem, ...this.#tripEvents];

    this._notify(updateType, updatedItem);
  };

  updateTripEvent = async (updateType, updatedItem) => {
    const updatedItemIndex = this.#tripEvents.findIndex((item) => item.id === updatedItem.id);

    if(updatedItemIndex === -1) {
      throw new Error('Can\'t update unexisting trip event');
    }

    try {
      const response = await this.#tripEventApiService.updateTripEvent(updatedItem);
      const updatedTripEvent = this.#adaptToClient(response);

      this.#tripEvents = [...this.#tripEvents.slice(0, updatedItemIndex), updatedTripEvent, ...this.#tripEvents.slice(updatedItemIndex + 1)];

      this._notify(updateType, updatedTripEvent);
    } catch(err) {
      throw new Error('Can\'t update trip event');
    }
  };

  deleteTripEvent = (updateType, updatedItem) => {
    const updatedItemIndex = this.#tripEvents.findIndex((item) => item.id === updatedItem.id);

    if(updatedItemIndex === -1) {
      throw new Error('Can\'t delete unexisting trip event');
    }

    this.#tripEvents = [...this.#tripEvents.slice(0, updatedItemIndex), ...this.#tripEvents.slice(updatedItemIndex + 1)];

    this._notify(updateType);
  };

  #adaptToClient(tripEvent) {
    const adaptedTripEvent = {...tripEvent,
      basePrice: tripEvent['base_price'],
      dateFrom: tripEvent['date_from'],
      dateTo: tripEvent['date_to'],
      isFavorite: tripEvent['is_favorite'],
    };

    delete adaptedTripEvent['base_price'];
    delete adaptedTripEvent['date_from'];
    delete adaptedTripEvent['date_to'];
    delete adaptedTripEvent['is_favorite'];

    return adaptedTripEvent;
  }
}
