import HeaderPresenter from './presenter/header-prsenter.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';

const tripMainContainer = document.querySelector('.trip-main');
const tripEventsComponent = document.querySelector('.trip-events');

const headerPresenter = new HeaderPresenter(tripMainContainer);
const tripEventsPresenter = new TripEventsPresenter(tripEventsComponent);

headerPresenter.init();
tripEventsPresenter.init();
