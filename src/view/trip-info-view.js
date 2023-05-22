import AbstractView from '../framework/view/abstract-view.js';
import {humanizeEventTime } from '../utils/trip-event-date.js';

const MIDDLE_SHORT_EVENTS_COUNT = 2;
const MAX_SHORT_EVENTS_COUNT = 3;

const getTripTitle = (tripEvents, destinations) => {
  const firstDestinationName = destinations.find((place) => place.id === tripEvents[0].destination).name;
  const lastDestinationName = destinations.find((place) => place.id === tripEvents[tripEvents.length - 1].destination).name;
  switch(tripEvents.length) {
    case 1:
      return firstDestinationName;

    case MIDDLE_SHORT_EVENTS_COUNT:
      return `${firstDestinationName} &mdash; ${lastDestinationName}`;

    case MAX_SHORT_EVENTS_COUNT:
      return `${firstDestinationName} &mdash; ${destinations.find((place) => place.id === tripEvents[1].destination).name} &mdash; ${lastDestinationName}`;

    default:
      return `${firstDestinationName} &mdash; . . . &mdash; ${lastDestinationName}`;
  }
};

const createTripInfoTemplate = (tripEvents, tripPrice, destinations) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTripTitle(tripEvents, destinations)}</h1>
      <p class="trip-info__dates">${humanizeEventTime(tripEvents[0].dateFrom, 'MMM D')}&nbsp;&mdash;&nbsp;${humanizeEventTime(tripEvents[tripEvents.length - 1].dateTo, 'MMM D')}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripPrice}</span>
    </p>
  </section>`
);

export default class TripInfoView extends AbstractView {
  #tripEvents;
  #tripPrice;
  #destinations;

  constructor(tripEvents, tripPrice, destinations) {
    super();
    this.#tripEvents = tripEvents;
    this.#tripPrice = tripPrice;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#tripEvents, this.#tripPrice, this.#destinations);
  }
}
