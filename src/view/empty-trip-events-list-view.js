import AbstractView from '../framework/view/abstract-view.js';
import { FilterTypes } from '../utils/filter.js';

const MessagesByFilterType = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.FUTURE]: 'There are no future events now',
  [FilterTypes.PAST]: 'There are no past events now',
};

const createEmptyListTemplate = (filterType) => `<p class="trip-events__msg">${MessagesByFilterType[filterType]}</p>`;

export default class EmptyTripEventsList extends AbstractView {
  #filterType;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}
