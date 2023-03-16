import { createElement } from '../render.js';

const createTripEventsListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class TripEventsListView {
  #element;

  constructor() {
    this.#element = null;
  }

  get template() {
    return createTripEventsListTemplate();
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
