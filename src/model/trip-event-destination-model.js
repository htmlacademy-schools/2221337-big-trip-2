import Observable from '../framework/observable.js';

export default class TripEventDestinationModel extends Observable {
  #tripEventApiService;
  #destinations = [];
  #destinationNames;

  constructor(tripEventApiService) {
    super();
    this.#tripEventApiService = tripEventApiService;
  }

  async init() {
    try {
      this.#destinations = await this.#tripEventApiService.destinations;
      this.#destinationNames = Array.from(this.#destinations, (destination) => destination.name);
    } catch(err) {
      this.#destinations = [];
    }
  }

  get destinations() {
    return this.#destinations;
  }

  get destinationNames() {
    return this.#destinationNames;
  }
}
