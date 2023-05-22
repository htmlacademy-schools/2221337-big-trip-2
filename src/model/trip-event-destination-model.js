import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/common.js';

export default class TripEventDestinationModel extends Observable {
  #tripEventApiService;
  #destinations = [];

  constructor(tripEventApiService) {
    super();
    this.#tripEventApiService = tripEventApiService;
  }

  init = async () => {
    try {
      this.#destinations = await this.#tripEventApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  };

  get destinations() {
    return this.#destinations;
  }
}
