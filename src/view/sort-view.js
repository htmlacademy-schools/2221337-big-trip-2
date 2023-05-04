import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../utils/sort.js';
import { uppperFirstSymbol } from '../utils/common.js';

const createSortTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${Object.values(SortType).map((sortType) => {
    const isDisabled = sortType === SortType.EVENT || sortType === SortType.OFFER ? 'disabled' : '';
    const isChecked = sortType === SortType.DAY ? 'checked' : '';

    return (
      `<div class="trip-sort__item  trip-sort__item--${sortType}">
        <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" data-sort-type="${sortType}" type="radio" name="trip-sort" value="sort-${sortType}" ${isDisabled} ${isChecked}>
        <label class="trip-sort__btn" for="sort-${sortType}">${uppperFirstSymbol(sortType)}</label>
      </div>`);}).join('')}
  </form>`
);

export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;

    this.element.addEventListener('click', this.#onSortTypeChange);
  }

  #onSortTypeChange = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
