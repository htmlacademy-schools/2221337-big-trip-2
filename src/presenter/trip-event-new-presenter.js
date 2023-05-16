import TripEventEditView from '../view/trip-event-edit-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { isEscapePushed, UpdateType, UserAction, TYPES } from '../utils/common.js';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

export default class TripEventNewPresenter {
  #tripEventsListContainer;
  #addFormComponent = null;

  #offersByType;
  #destinations;

  #changeData;
  #destroyCallback = null;

  constructor(tripEventsListContainer, offersByType, destinations, changeData) {
    this.#tripEventsListContainer = tripEventsListContainer;

    this.#offersByType = offersByType;
    this.#destinations = destinations;

    this.#changeData = changeData;
  }

  init(destroyCallback) {
    this.#destroyCallback = destroyCallback;

    this.#renderAddFormComponent();
  }

  destroy() {
    if(this.#addFormComponent === null) {
      remove(this.#addFormComponent);
    }

    this.#destroyCallback?.();

    remove(this.#addFormComponent);
    this.#addFormComponent = null;

    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  }

  #getDefaultTripEvent() {
    return {
      id: 0,
      basePrice: 0,
      dateFrom: dayjs().toString(),
      dateTo: dayjs().toString(),
      destination: this.#destinations[0],
      isFavorite: false,
      offers: [],
      type: TYPES[0],
    };
  }

  #renderAddFormComponent() {
    if(this.#addFormComponent !== null) {
      return;
    }

    this.#addFormComponent = new TripEventEditView(this.#offersByType, this.#getDefaultTripEvent(), true);

    this.#addFormComponent.setFormSubmitHandler(this.#onFormSubmit);
    this.#addFormComponent.setFormDeleteHandler(this.#onCancelButtonClick);

    render(this.#addFormComponent, this.#tripEventsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscapeKeyDown);
  }

  #onFormSubmit = (tripEvent) => {
    this.#changeData(UserAction.ADD_TRIP_EVENT, UpdateType.MINOR, {id: nanoid(), ...tripEvent});
    this.destroy();
  };

  #onEscapeKeyDown = (evt) => {
    if(isEscapePushed(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #onCancelButtonClick = () => {
    this.destroy();
  };
}
