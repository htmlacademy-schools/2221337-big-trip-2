import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/common.js';

export default class OfferByTypeModel extends Observable {
  #tripEventApiService;
  #offersByType = [];

  constructor(tripEventApiService) {
    super();
    this.#tripEventApiService = tripEventApiService;
  }

  init = async () => {
    try {
      this.#offersByType = await this.#tripEventApiService.offersByType;
    } catch(err) {
      this.#offersByType = [];
    }

    this._notify(UpdateType.INIT);
  };

  get offersByType() {
    return this.#offersByType;
  }
}
