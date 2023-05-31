import TripEventEditView from '../view/trip-event-edit-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { isEscapePushed, UpdateType, UserAction, TYPES } from '../utils/common.js';
import dayjs from 'dayjs';

export default class TripEventNewPresenter {
  #tripEventsListContainer;
  #addFormComponent = null;

  #offersByType;
  #destinations;
  #destinationNames;

  #changeData;
  #destroyCallback = null;

  constructor(tripEventsListContainer, offersByType, destinations, destinationNames, changeData) {
    this.#tripEventsListContainer = tripEventsListContainer;

    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#destinationNames = destinationNames;

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

  setSaving() {
    this.#addFormComponent.updateElement({
      isSaving: true,
      isDisabled: true,
    });
  }

  setAborting() {
    const resetAddFormState = () => {
      this.#addFormComponent.updateElement({
        isSaving: false,
        isDeleting: false,
        isDisabled: false,
      });
    };

    this.#addFormComponent.shake(resetAddFormState);
  }

  #renderAddFormComponent() {
    if(this.#addFormComponent !== null) {
      return;
    }

    this.#addFormComponent = new TripEventEditView(this.#offersByType, this.#destinations,
      this.#destinationNames, this.#generateDefaultTripEvent(), true);

    this.#addFormComponent.setFormSubmitHandler(this.#onFormSubmit);
    this.#addFormComponent.setFormDeleteHandler(this.#onCancelButtonClick);

    render(this.#addFormComponent, this.#tripEventsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscapeKeyDown);
  }

  #generateDefaultTripEvent() {
    return {
      basePrice: 0,
      dateFrom: dayjs().toString(),
      dateTo: dayjs().toString(),
      destination: this.#destinations[0].id,
      isFavorite: false,
      offers: [],
      type: TYPES[0],
    };
  }

  #onFormSubmit = (tripEvent) => {
    this.#changeData(UserAction.ADD_TRIP_EVENT, UpdateType.MINOR, tripEvent);
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
