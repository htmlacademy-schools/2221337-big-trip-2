import TripInfoView from '../view/trip-info-view.js';
import MenuNavgationView from '../view/menu-navigation-view.js';
import FilterView from '../view/filter-view.js';
import { render, RenderPosition } from '../render.js';

export default class HeaderPresenter {
  #tripMainContainer;
  #tripInfo;
  #menuNavigation;
  #filtersMenu;

  constructor(tripMainContainer) {
    this.#tripMainContainer = tripMainContainer;
    this.#tripInfo = new TripInfoView();
    this.#menuNavigation = new MenuNavgationView();
    this.#filtersMenu = new FilterView();
  }

  init() {
    render(this.#tripInfo, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
    render(this.#menuNavigation, this.#tripMainContainer.querySelector('.trip-controls__navigation'));
    render(this.#filtersMenu, this.#tripMainContainer.querySelector('.trip-controls__filters'));
  }
}
