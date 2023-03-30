import { generateOffersByType, generateOffer } from '../mock/offer.js';
import { TYPES, shuffle, getRandomIntInclusively } from '../utils/common.js';

const MAX_EMPTINESS_VARIETY = 5;

const OFFERS_TITLES = [
  'Add luggage',
  'Switch to comfort',
  'Add meal',
  'Choose seats',
  'Travel by train',
  'Call a taxi',
  'Add drinks'
];

export default class OfferByTypeModel {
  #offers;
  #offersByType;

  constructor(){
    this.#offers = Array.from(OFFERS_TITLES, (title, id) => generateOffer(id, title));
    this.#offersByType = getRandomIntInclusively(0, MAX_EMPTINESS_VARIETY) ? Array.from(TYPES,
      (type) => generateOffersByType(type, shuffle(this.offers).slice(0, getRandomIntInclusively(1, this.offers.length)))) : [];
  }

  get offersByType() {
    return this.#offersByType;
  }

  get offers() {
    return this.#offers;
  }
}
