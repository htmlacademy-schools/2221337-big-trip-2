import Observable from '../framework/observable.js';

export default class OfferByTypeModel extends Observable {
  #tripEventApiService;
  #offersByType = [];

  constructor(tripEventApiService) {
    super();
    this.#tripEventApiService = tripEventApiService;
  }

  async init() {
    try {
      this.#offersByType = await this.#tripEventApiService.offersByType;
    } catch(err) {
      this.#offersByType = [];
    }
  }

  get offersByType() {
    return this.#offersByType;
  }
}
