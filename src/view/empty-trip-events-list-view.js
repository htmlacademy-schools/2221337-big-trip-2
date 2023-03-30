import AbstractView from '../framework/view/abstract-view.js';

const messagesByFilterType = {
  'everything': 'Click New Event to create your first point',
  'future': 'There are no future events now',
  'past': 'There are no past events now',
};

const createEmptyListTemplate = (filterType) => `<p class="trip-events__msg">${messagesByFilterType[filterType]}</p>`;

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
