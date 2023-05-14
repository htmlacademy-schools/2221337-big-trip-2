import TripInfoView from './view/trip-info-view.js';
import FilterView from './view/filter-view.js';
import TripEventsBoardPresenter from './presenter/trip-events-board-presenter.js';
import TripEventsModel from './model/trip-events-model.js';
import OfferByTypeModel from './model/offer-model.js';
import TripEventDestinationModel from './model/trip-event-destination-model.js';
import { generateFilters } from './mock/filter.js';
import { render } from './framework/render.js';
import { RenderPosition } from './framework/render.js';

const EVENTS_COUNT = 20;

const tripMainContainer = document.querySelector('.trip-main');
const tripEventsComponent = document.querySelector('.trip-events');

const offerByTypeModel = new OfferByTypeModel();
const destinationModel = new TripEventDestinationModel(EVENTS_COUNT);
const tripEventModel = new TripEventsModel(EVENTS_COUNT, [...offerByTypeModel.offersByType], destinationModel.destinations);

const filters = generateFilters(tripEventModel.tripEvents);

const tripEventsPresenter = new TripEventsBoardPresenter(tripEventsComponent, tripEventModel, offerByTypeModel);

if(tripEventModel.tripEvents.length !== 0) {
  render(new TripInfoView(tripEventModel.tripEvents), tripMainContainer, RenderPosition.AFTERBEGIN);
}
render(new FilterView(filters), tripMainContainer.querySelector('.trip-controls__filters'));

tripEventsPresenter.init();
