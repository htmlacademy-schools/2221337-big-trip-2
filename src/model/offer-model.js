import Observable from '../framework/observable.js';
import { generateOffersByType, generateOffer } from '../mock/offer.js';
import { TYPES, shuffle, getRandomIntInclusively } from '../utils/common.js';

const OFFERS_TITLES = [
  'Add luggage',
  'Switch to comfort',
  'Add meal',
  'Choose seats',
  'Travel by train',
  'Call a taxi',
  'Add drinks'
];

export default class OfferByTypeModel extends Observable {
  #offers;
  #offersByType;

  constructor(){
    super();
    this.#offers = Array.from(OFFERS_TITLES, (title, id) => generateOffer(id, title));
    this.#offersByType = Array.from(TYPES,
      (type) => generateOffersByType(type, shuffle(this.offers).slice(0, getRandomIntInclusively(1, this.offers.length))));
  }

  get offersByType() {
    return this.#offersByType;
  }

  get offers() {
    return this.#offers;
  }

  setOffersByType(updateType, offersByType) {
    this.#offersByType = offersByType;
    this._notify(updateType, offersByType);
  }

  setOffers(updateType, offers) {
    this.#offers = offers;
    this._notify(updateType, offers);
  }
}
