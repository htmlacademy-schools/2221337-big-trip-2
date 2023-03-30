import TripInfoView from '../view/trip-info-view.js';
import MenuNavgationView from '../view/menu-navigation-view.js';
import FilterView from '../view/filter-view.js';
import { render, RenderPosition } from '../framework/render.js';

export default class HeaderPresenter {
  #tripMainContainer;
  #menuNavigation;
  #filtersMenu;
  #tripEvents;

  constructor(tripMainContainer, filters, tripEvents) {
    this.#tripMainContainer = tripMainContainer;
    this.#tripEvents = tripEvents;
    this.#menuNavigation = new MenuNavgationView();
    this.#filtersMenu = new FilterView(filters);
  }

  init() {
    if(this.#tripEvents.length !== 0) {
      render(new TripInfoView(this.#tripEvents), this.#tripMainContainer, RenderPosition.AFTERBEGIN);
    }
    render(this.#menuNavigation, this.#tripMainContainer.querySelector('.trip-controls__navigation'));
    render(this.#filtersMenu, this.#tripMainContainer.querySelector('.trip-controls__filters'));
  }
}
