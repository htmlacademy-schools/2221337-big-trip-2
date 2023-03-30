import AbstractView from '../framework/view/abstract-view.js';
import { uppperFirstSymbol } from '../utils/common.js';

const cretaeFilterItemTemplate = (filter, isChecked) => {
  const {type, count} = filter;

  const checkedAttribute = isChecked ? 'checked' : '';
  const disabledAttribute = count === 0 ? 'disabled' : '';

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
      value="${type}" ${checkedAttribute} ${disabledAttribute}>
      <label class="trip-filters__filter-label" for="filter-${filter}">${uppperFirstSymbol(type)}</label>
    </div>`
  );
};

const createFilterTemplate = (filters) => {
  const filterItmes = filters.map((filter, i) => cretaeFilterItemTemplate(filter, i === 0)).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItmes}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FilterView extends AbstractView {
  #filters;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
