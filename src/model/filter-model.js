import Observable from '../framework/observable.js';
import { FilterTypes } from '../utils/filter.js';

export default class FilterModel extends Observable {
  #filterType;

  constructor() {
    super();
    this.#filterType = FilterTypes.EVERYTHING;
  }

  get filterType() {
    return this.#filterType;
  }

  setFilterType(updateType, filterType) {
    this.#filterType = filterType;
    this._notify(updateType, filterType);
  }
}
