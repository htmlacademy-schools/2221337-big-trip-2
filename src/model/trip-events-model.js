import { generateTripEvent } from '../mock/trip-event.js';
import { generateDate } from '../utils/trip-event-date.js';
import { getRandomIntInclusively, TYPES } from '../utils/common.js';

export default class TripEventsModel {
  #tripEvents;

  constructor(eventsCount, offersByType, destinations) {
    this.#tripEvents = Array.from({length: eventsCount},
      (tripEvent, id) => {
        const type = TYPES[getRandomIntInclusively(0, TYPES.length - 1)];
        return generateTripEvent(id, type, offersByType.length ? offersByType.find((offer) => offer.type === type).offers : [], destinations[id], generateDate());
      });
  }

  get tripEvents() {
    return this.#tripEvents;
  }
}
