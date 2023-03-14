import { createElement } from '../render.js';

const offerIndexes = new Set();

const createTripEventOffersTemplate = (tripEvent, offersByType) => {
  const {offers, type} = tripEvent;

  if(offersByType.length && offers.length) {
    const eventOffersByType = offersByType
      .find((offer) => offer.type === type)
      .offers.map((offer) => {
        const checked = offers.includes(offer.id) ? 'checked' : '';

        const titleClass = offer.title.toLowerCase().replace(' ', '-');
        const offerIdClass = offerIndexes.has(offer.id) ? offerIndexes[offerIndexes.size - 1] + 1 : offer.id;
        offerIndexes.add(offerIdClass);

        return (
          `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${titleClass}-${offerIdClass}" type="checkbox" name="event-offer-${titleClass}" ${checked}>
            <label class="event__offer-label" for="event-offer-${titleClass}-${offerIdClass}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`
        );
      }).join('');

    return(
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${eventOffersByType}
        </div>
      </section>`
    );
  }
  return '<section class="event__section  event__section--offers"></section>';
};

export default class TripEventOffer {
  #element;
  #tripEvent;
  #offersByType;

  constructor(tripEvent, offersByType) {
    this.#element = null;
    this.#tripEvent = tripEvent;
    this.#offersByType = offersByType;
  }

  get template(){
    return createTripEventOffersTemplate(this.#tripEvent, this.#offersByType);
  }

  get element() {
    if(!this.#element){
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
