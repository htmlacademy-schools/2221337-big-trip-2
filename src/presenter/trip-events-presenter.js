import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventView from '../view/trip-event-view.js';
import TripEventAddView from '../view/trip-event-add-view.js';
import TripEventEditView from '../view/trip-event-edit-view.js';
import TripEventOffer from '../view/trip-event-offers-view.js';
import TripEventDestination from '../view/trip-event-destionation-view.js';
import { render } from '../render.js';

const TRIP_EVENTS_COUNT = 3;

export default class TripEventsPresenter{
  constructor(tripEventsComponent){
    this.tripEventsComponent = tripEventsComponent;
    this.tripEventsList = new TripEventsListView();
    this.newTripEvent = new TripEventAddView();
    this.tripEventEdit = new TripEventEditView();
  }

  renderTripEventForm(editForm){
    render(editForm, this.tripEventsList.getElement());
    render(new TripEventOffer(), editForm.getElement().querySelector('.event__details'));
    render(new TripEventDestination(), editForm.getElement().querySelector('.event__details'));
  }

  init(){
    render(new SortView(), this.tripEventsComponent);
    render(this.tripEventsList, this.tripEventsComponent);

    this.renderTripEventForm(this.newTripEvent);
    this.renderTripEventForm(this.tripEventEdit);

    for(let i = 0; i < TRIP_EVENTS_COUNT; i++){
      render(new TripEventView(), this.tripEventsList.getElement());
    }
  }
}
