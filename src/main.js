import HeaderPresenter from './presenter/header-prsenter.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import TripEventsModel from './model/trip-events-model.js';
import OfferByTypeModel from './model/offer-model.js';
import TripEventDestinationModel from './model/trip-event-destination-model.js';

const EVENTS_COUNT = 20;

const tripMainContainer = document.querySelector('.trip-main');
const tripEventsComponent = document.querySelector('.trip-events');

const headerPresenter = new HeaderPresenter(tripMainContainer);

const offerByTypeModel = new OfferByTypeModel();
const destinationModel = new TripEventDestinationModel(EVENTS_COUNT);
const tripEventsPresenter = new TripEventsPresenter(tripEventsComponent,
  new TripEventsModel(EVENTS_COUNT, offerByTypeModel.offers.length, destinationModel.destinations), offerByTypeModel);

headerPresenter.init();
tripEventsPresenter.init();
