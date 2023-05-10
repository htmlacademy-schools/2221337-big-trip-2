import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { uppperFirstSymbol, shuffle, getRandomIntInclusively, DESCRIPTIONS, PLACES_NAMES, TYPES } from '../utils/common.js';
import { humanizeEventTime, isPast } from '../utils/trip-event-date.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const MAX_SENTENCES = 5;

const MAX_PHOTO_INDEX = 100;
const MAX_PHOTO_COUNT = 5;

const createTripEventOffersTemplate = (tripEvent, offersByType) => {
  const {offers} = tripEvent;

  if(offersByType.length) {
    const eventOffersByType = offersByType.map((offer) => {
      const checked = offers.includes(offer.id) ? 'checked' : '';

      const titleClass = offer.title.toLowerCase().replace(' ', '-');

      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${titleClass}-1" data-offer-title="${offer.title}" type="checkbox" name="event-offer-${titleClass}" ${checked}>
          <label class="event__offer-label" for="event-offer-${titleClass}-1">
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

const createEventTypeFields = (currentType) => (
  Array.from(TYPES, (eventType) => {
    const isChecked = eventType === currentType ? 'checked' : '';
    return (`<div class="event__type-item">
                  <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${isChecked}>
                  <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${uppperFirstSymbol(eventType)}</label>
                </div>`);
  }).join('')
);

const createTripEventEditTemplate = (tripEvent, offersByType) => {
  const {basePrice, dateFrom, dateTo, destination, type} = tripEvent;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventTypeFields(type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${uppperFirstSymbol(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${Array.from(PLACES_NAMES, (place) => `<option value="${place}"></option>`).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeEventTime(dateFrom, 'DD/MM/YY HH:mm')}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeEventTime(dateTo, 'DD/MM/YY HH:mm')}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createTripEventOffersTemplate(tripEvent, offersByType)}
          ${createTripEventDestinationsTemplate(tripEvent)}
        </section>
      </form>
    </li>`
  );
};

export default class TripEventEditView extends AbstractStatefulView {
  #offersByType;
  #offersByCurrentType;

  #dateFromPicker;
  #dateToPicker;

  constructor(tripEvent, offersByType) {
    super();
    this._state = TripEventEditView.parseTripEventToState(tripEvent);

    this.#offersByType = offersByType;
    this.#offersByCurrentType = this.#offersByType.length ? this.#offersByType.find((offer) => offer.type === tripEvent.type).offers : [];

    this.#dateFromPicker = null;
    this.#dateToPicker = null;

    this.#setInnerHandlers();

    this.#setDateFromPicker();
    this.#setDateToPicker();
  }

  get template() {
    return createTripEventEditTemplate(this._state, this.#offersByCurrentType);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();

    this.#setDateFromPicker();
    this.#setDateToPicker();

    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormCloseClickHandler(this._callback.formCloseClick);
  };

  removeElement = () => {
    super.removeElement();

    if(this.#dateFromPicker && this.#dateToPicker) {
      this.#dateFromPicker.destroy();
      this.#dateToPicker.destroy();

      this.#dateFromPicker = null;
      this.#dateToPicker = null;
    }
  };

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;

    this.element.querySelector('form').addEventListener('submit', this.#onFormSubmit);
  }

  setFormCloseClickHandler(callback) {
    this._callback.formCloseClick = callback;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onFormCloseClick);
  }

  reset(tripEvent) {
    this.#updateOffersByCurrentType(tripEvent.type);

    this.updateElement({
      offers: tripEvent.offers,
    });

    this.updateElement(TripEventEditView.parseTripEventToState(tripEvent));
  }

  #updateOffersByCurrentType(newType) {
    this.#offersByCurrentType = this.#offersByType.length ? this.#offersByType.find((offer) => offer.type === newType).offers : [];
  }

  #onFormSubmit = (evt) => {
    evt.preventDefault();

    this._callback.formSubmit(TripEventEditView.parseStateToTripEvent(this._state));
  };

  #onFormCloseClick = (evt) => {
    evt.preventDefault();

    this._callback.formCloseClick();
  };

  #onEventTypeClick = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();

    this.#updateOffersByCurrentType(evt.target.value);

    this.updateElement({
      type: evt.target.value,
      offers: this.#offersByCurrentType.length ? shuffle(Array.from(this.#offersByCurrentType, (offer) => offer.id)).slice(0, getRandomIntInclusively(1, this.#offersByCurrentType.length)) : [],
    });
  };

  #onEventPlaceChange = (evt) => {
    evt.preventDefault();

    this.updateElement({
      destination: {...this._state.destination,
        description: shuffle(DESCRIPTIONS).slice(0, getRandomIntInclusively(0, MAX_SENTENCES)).join(' '),
        name: evt.target.value,
        pictures: Array.from({length: getRandomIntInclusively(0, MAX_PHOTO_COUNT)}, () => (
          {
            src: `http://picsum.photos/248/152?r=${getRandomIntInclusively(1, MAX_PHOTO_INDEX)}`,
            description: DESCRIPTIONS[getRandomIntInclusively(0, DESCRIPTIONS.length - 1)],
          }
        )),
      }
    });
  };

  #onOfferClick = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();

    const newOffer = this.#offersByCurrentType.find((offer) => offer.title === evt.target.dataset.offerTitle).id;

    if(this._state.offers.includes(newOffer)) {
      this._state.offers.splice(this._state.offers.indexOf(newOffer), 1);
    } else {
      this._state.offers.push(newOffer);
    }

    this.updateElement({
      offers: this._state.offers,
    });
  };

  #onPriceInput = (evt) => {
    evt.preventDefault();

    this._setState({
      basePrice: evt.target.value,
    });
  };

  #onDateFromChange = ([newDate]) => {
    this.updateElement({
      dateFrom: newDate,
      dateTo: isPast(this._state.dateTo, '', newDate) ? newDate : this._state.dateTo,
    });
  };

  #onDateToChange = ([newDate]) => {
    this.updateElement({
      dateTo: newDate,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('click', this.#onEventTypeClick);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#onEventPlaceChange);

    if(this.#offersByType.length && this.#offersByCurrentType.length) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#onOfferClick);
    }

    this.element.querySelector('#event-price-1').addEventListener('input', this.#onPriceInput);
  };

  #setDateFromPicker = () => {
    this.#dateFromPicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        minuteIncrement: 1,
        onChange: this.#onDateFromChange,
      });
  };

  #setDateToPicker = () => {
    this.#dateToPicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        minuteIncrement: 1,
        onChange: this.#onDateToChange,
      }
    );
  };

  static parseTripEventToState = (tripEvent) => ({...tripEvent});

  static parseStateToTripEvent = (state) => ({...state});
}
