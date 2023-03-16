import { generateEventDestination } from '../mock/trip-event-destination.js';

export default class TripEventDestinationModel {
  #destinations;

  constructor(eventsCount) {
    this.#destinations = Array.from({length: eventsCount}, (destination, id) => generateEventDestination(id));
  }

  get destinations() {
    return this.#destinations;
  }
}
