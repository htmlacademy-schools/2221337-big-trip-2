import { generateTripEvent } from '../mock/trip-event.js';
import { generateDate } from '../trip-event-date.js';
import { getRandomIntInclusively, TYPES } from '../utils.js';

export default class TripEventsModel {
  #tripEvents;

  constructor(eventsCount, offersCount, destinations) {
    this.#tripEvents = Array.from({length: eventsCount},
      (tripEvent, id) =>
        generateTripEvent(id, TYPES[getRandomIntInclusively(0, TYPES.length - 1)], offersCount, destinations[id], generateDate()));
  }

  get tripEvents() {
    return this.#tripEvents;
  }
}
