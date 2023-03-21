import { createElement } from '../render.js';

const messagesByFilterType = {
  'everything': 'Click New Event to create your first point',
  'future': 'There are no future events now',
  'past': 'There are no past events now',
};

const createEmptyListTemplate = (filterType) => `<p class="trip-events__msg">${messagesByFilterType[filterType]}</p>`;

export default class EmptyTripEventsList {
  #element;
  #filterType;

  constructor(filterType) {
    this.#element = null;
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
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
