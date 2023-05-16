import Observable from '../framework/observable.js';
import { generateEventDestination } from '../mock/trip-event-destination.js';

export default class TripEventDestinationModel extends Observable {
  #destinations;

  constructor(eventsCount) {
    super();
    this.#destinations = Array.from({length: eventsCount}, () => generateEventDestination());
  }

  get destinations() {
    return this.#destinations;
  }

  setDestinations(updateType, destinations) {
    this.#destinations = destinations;
    this._notify(updateType, destinations);
  }
}
