import { generateEventDestination } from '../mock/trip-event-destination.js';

export default class TripEventDestinationModel{
  constructor(eventsCount) {
    this.destinations = Array.from({length: eventsCount}, (destination, id) => generateEventDestination(id));
  }

  getDestinations(){
    return this.destinations;
  }
}
