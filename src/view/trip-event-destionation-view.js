import { createElement } from '../render.js';

const createTripEventDestinationsTemplate = (tripEvent) => {
  if(tripEvent.destination.description.length || tripEvent.destination.pictures.length) {
    const pictures = tripEvent.destination.pictures.map((picture) =>
      `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

    return(
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${tripEvent.destination.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${pictures}
          </div>
        </div>
      </section>`
    );
  }
  return '<section class="event__section  event__section--destination"></section>';
};

export default class TripEventDestination{
  #element;
  #tripEvent;

  constructor(tripEvent) {
    this.#element = null;
    this.#tripEvent = tripEvent;
  }

  get template(){
    return createTripEventDestinationsTemplate(this.#tripEvent);
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
