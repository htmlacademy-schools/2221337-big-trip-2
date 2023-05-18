import TripEventsBoardPresenter from './presenter/trip-events-board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripEventsModel from './model/trip-events-model.js';
import OfferByTypeModel from './model/offer-model.js';
import TripEventDestinationModel from './model/trip-event-destination-model.js';
import FilterModel from './model/filter-model.js';

const EVENTS_COUNT = 20;

const tripMainContainer = document.querySelector('.trip-main');
const filterContainer = tripMainContainer.querySelector('.trip-controls__filters');
const tripEventsComponent = document.querySelector('.trip-events');

const newEventButton = tripMainContainer.querySelector('.trip-main__event-add-btn');

const offerByTypeModel = new OfferByTypeModel();
const destinationModel = new TripEventDestinationModel(EVENTS_COUNT);
const tripEventModel = new TripEventsModel(EVENTS_COUNT, offerByTypeModel.offersByType, destinationModel.destinations);

const filterModel = new FilterModel();

const tripEventsPresenter = new TripEventsBoardPresenter(tripEventsComponent, tripEventModel, offerByTypeModel, destinationModel, filterModel);
const filterPresenter = new FilterPresenter(filterContainer, tripMainContainer, filterModel, tripEventModel, offerByTypeModel);

const onAddFormClose = () => {
  newEventButton.disabled = false;
};

const onNewEventButtonClick = () => {
  tripEventsPresenter.createTripEvent(onAddFormClose);
  newEventButton.disabled = true;
};

newEventButton.addEventListener('click', onNewEventButtonClick);

filterPresenter.init();
tripEventsPresenter.init();
