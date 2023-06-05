import TripEventsBoardPresenter from './presenter/trip-events-board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripEventsModel from './model/trip-events-model.js';
import OfferByTypeModel from './model/offer-model.js';
import TripEventDestinationModel from './model/trip-event-destination-model.js';
import FilterModel from './model/filter-model.js';
import TripEventApiService from './trip-event-api-service.js';

const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';
const AUTHORIZTION_TOKEN = 'Basic lef2yu342sf839hd3';

const tripMainContainer = document.querySelector('.trip-main');
const filterContainer = tripMainContainer.querySelector('.trip-controls__filters');
const tripEventsComponent = document.querySelector('.trip-events');

const newEventButton = tripMainContainer.querySelector('.trip-main__event-add-btn');

const tripEventApiService = new TripEventApiService(END_POINT, AUTHORIZTION_TOKEN);

const offerByTypeModel = new OfferByTypeModel(tripEventApiService);
const destinationModel = new TripEventDestinationModel(tripEventApiService);
const tripEventModel = new TripEventsModel(tripEventApiService);
const filterModel = new FilterModel();

const tripEventsPresenter = new TripEventsBoardPresenter(tripEventsComponent, tripEventModel,
  offerByTypeModel, destinationModel, filterModel);
const filterPresenter = new FilterPresenter(filterContainer, tripMainContainer, filterModel,
  tripEventModel, offerByTypeModel, destinationModel);

const onAddFormClose = () => {
  newEventButton.disabled = false;
};

const onNewEventButtonClick = () => {
  tripEventsPresenter.createTripEvent(onAddFormClose);
  newEventButton.disabled = true;
};

filterPresenter.init();
tripEventsPresenter.init();

offerByTypeModel.init().finally(() => {
  destinationModel.init().finally(() => {
    tripEventModel.init().finally(() => {
      if(offerByTypeModel.offersByType.length && destinationModel.destinations.length) {
        newEventButton.addEventListener('click', onNewEventButtonClick);
      }
    });
  });
});
