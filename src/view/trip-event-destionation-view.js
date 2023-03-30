import AbstractView from '../framework/view/abstract-view.js';

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

export default class TripEventDestination extends AbstractView {
  #tripEvent;

  constructor(tripEvent) {
    super();
    this.#tripEvent = tripEvent;
  }

  get template(){
    return createTripEventDestinationsTemplate(this.#tripEvent);
  }
}
