import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventView from '../view/trip-event-view.js';
import TripEventAddView from '../view/trip-event-add-view.js';
import TripEventEditView from '../view/trip-event-edit-view.js';
import TripEventOffer from '../view/trip-event-offers-view.js';
import TripEventDestination from '../view/trip-event-destionation-view.js';
import { render } from '../render.js';

const MIN_TRIP_EVENT_INDEX = 2;

export default class TripEventsPresenter{
  constructor(tripEventsComponent, tripEventsModel, offersModel){
    this.tripEventsModel = tripEventsModel;
    this.tripEvents = [...this.tripEventsModel.getTripEvents()];

    this.offersModel = offersModel;
    this.offersByType = [...this.offersModel.getOffersByType()];

    this.tripEventsComponent = tripEventsComponent;
    this.tripEventsList = new TripEventsListView();

    this.newTripEvent = new TripEventAddView(this.tripEvents[0]);
    this.tripEventEdit = new TripEventEditView(this.tripEvents[1]);
  }

  renderTripEventForm(editForm){
    render(editForm, this.tripEventsList.getElement());
    render(new TripEventOffer(editForm.tripEvent, this.offersByType), editForm.getElement().querySelector('.event__details'));
    render(new TripEventDestination(editForm.tripEvent), editForm.getElement().querySelector('.event__details'));
  }

  init(){
    render(new SortView(), this.tripEventsComponent);
    render(this.tripEventsList, this.tripEventsComponent);

    this.renderTripEventForm(this.newTripEvent);
    this.renderTripEventForm(this.tripEventEdit);

    for(let i = MIN_TRIP_EVENT_INDEX; i < this.tripEvents.length; i++){
      render(new TripEventView(this.tripEvents[i], this.offersByType), this.tripEventsList.getElement());
    }
  }
}
