import HeaderPresenter from './presenter/header-prsenter.js';
import TripEventsPresenter from './presenter/trip-events-board-presenter.js';
import TripEventsModel from './model/trip-events-model.js';
import OfferByTypeModel from './model/offer-model.js';
import TripEventDestinationModel from './model/trip-event-destination-model.js';
import { getRandomIntInclusively } from './utils.js';

const EVENTS_COUNT = 20;

const tripMainContainer = document.querySelector('.trip-main');
const tripEventsComponent = document.querySelector('.trip-events');

const headerPresenter = new HeaderPresenter(tripMainContainer);

const offerByTypeModel = new OfferByTypeModel();
const destinationModel = new TripEventDestinationModel(EVENTS_COUNT);
const tripEventsPresenter = new TripEventsPresenter(tripEventsComponent,
  new TripEventsModel(getRandomIntInclusively(0, 1) ? 0 : EVENTS_COUNT, offerByTypeModel.offers.length, destinationModel.destinations), offerByTypeModel);

headerPresenter.init();
tripEventsPresenter.init();
