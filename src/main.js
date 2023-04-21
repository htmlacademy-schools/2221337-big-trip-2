import HeaderPresenter from './presenter/header-prsenter.js';
import TripEventsBoardPresenter from './presenter/trip-events-board-presenter.js';
import TripEventsModel from './model/trip-events-model.js';
import OfferByTypeModel from './model/offer-model.js';
import TripEventDestinationModel from './model/trip-event-destination-model.js';
import { getRandomIntInclusively } from './utils/common.js';
import { generateFilters } from './mock/filter.js';

const EVENTS_COUNT = 20;

const tripMainContainer = document.querySelector('.trip-main');
const tripEventsComponent = document.querySelector('.trip-events');

const offerByTypeModel = new OfferByTypeModel();
const destinationModel = new TripEventDestinationModel(EVENTS_COUNT);
const tripEventModel = new TripEventsModel(getRandomIntInclusively(0, 1) ? 0 : EVENTS_COUNT, offerByTypeModel.offers.length, destinationModel.destinations);

const filters = generateFilters(tripEventModel.tripEvents);

const headerPresenter = new HeaderPresenter(tripMainContainer, filters, tripEventModel.tripEvents);
const tripEventsPresenter = new TripEventsBoardPresenter(tripEventsComponent, tripEventModel, offerByTypeModel);

headerPresenter.init();
tripEventsPresenter.init();
