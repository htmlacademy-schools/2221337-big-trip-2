import TripEventView from '../view/trip-event-view.js';
import TripEventEditView from '../view/trip-event-edit-view.js';
import { render, replace, remove } from '../framework/render.js';
import { isEscapePushed, PointMode, UpdateType, UserAction } from '../utils/common.js';
import { areDatesSame } from '../utils/trip-event-date.js';

export default class TripEventPresenter {
  #tripEvent;
  #pointMode;

  #tripEventsListContainer;
  #tripEventComponent;
  #editFormComponent;

  #offersByType;

  #changeData;
  #changePointMode;

  constructor(tripEventsListContainer, offersByType, changeData, changePointMode) {
    this.#tripEventsListContainer = tripEventsListContainer;

    this.#offersByType = offersByType;

    this.#changeData = changeData;
    this.#changePointMode = changePointMode;

    this.#pointMode = PointMode.DEFAULT;

    this.#tripEventComponent = null;
    this.#editFormComponent = null;
  }

  init(tripEvent) {
    this.#tripEvent = tripEvent;

    this.#renderTripEventComponent();
  }

  resetTripEventMode() {
    if(this.#pointMode === PointMode.EDITING) {
      this.#replaceFormToPoint();
    }
  }

  destroy() {
    remove(this.#tripEventComponent);
    remove(this.#editFormComponent);
  }

  #renderTripEventComponent() {
    const previousEventComponent = this.#tripEventComponent;
    const previousEditFormComponent = this.#editFormComponent;

    this.#tripEventComponent = new TripEventView(this.#tripEvent, this.#offersByType);

    this.#renderEditFormComponent();

    this.#tripEventComponent.setFormOpenClickHandler(this.#onFormOpenButtonClick);
    this.#tripEventComponent.setFavoriteButtonHandler(this.#onFavoriteChangeClick);

    if(previousEventComponent === null || previousEditFormComponent === null) {
      render(this.#tripEventComponent, this.#tripEventsListContainer);
      return;
    }

    if(this.#pointMode === PointMode.DEFAULT) {
      replace(this.#tripEventComponent, previousEventComponent);
    }

    if(this.#pointMode === PointMode.EDITING) {
      replace(this.#editFormComponent, previousEditFormComponent);
    }

    remove(previousEventComponent);
    remove(previousEditFormComponent);
  }

  #renderEditFormComponent() {
    this.#editFormComponent = new TripEventEditView(this.#offersByType, this.#tripEvent);

    this.#editFormComponent.setFormSubmitHandler(this.#onFormSubmit);
    this.#editFormComponent.setFormCloseClickHandler(this.#onFormCloseButtonClick);
    this.#editFormComponent.setFormDeleteHandler(this.#onDeleteButtonClick);
  }

  #replacePointToForm() {
    replace(this.#editFormComponent, this.#tripEventComponent);

    document.addEventListener('keydown', this.#onEscapeKeyDown);

    this.#changePointMode();
    this.#pointMode = PointMode.EDITING;
  }

  #replaceFormToPoint() {
    this.#editFormComponent.reset(this.#tripEvent);
    replace(this.#tripEventComponent, this.#editFormComponent);

    document.removeEventListener('keydown', this.#onEscapeKeyDown);

    this.#pointMode = PointMode.DEFAULT;
  }

  #onFormOpenButtonClick = () => {
    this.#replacePointToForm();
  };

  #onFormCloseButtonClick = () => {
    this.#replaceFormToPoint();
  };

  #onFormSubmit = (tripEvent) => {
    const isMinorUpdate = !areDatesSame(this.#tripEvent.dateFrom, tripEvent.dateFrom)
      || !areDatesSame(this.#tripEvent.dateTo, tripEvent.dateTo)
      || this.#tripEvent.basePrice !== tripEvent.basePrice;
    this.#changeData(UserAction.UPDATE_TRIP_EVENT, isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH, tripEvent);
    this.#replaceFormToPoint();
  };

  #onEscapeKeyDown = (evt) => {
    if(isEscapePushed(evt)) {
      evt.preventDefault();

      this.#editFormComponent.reset(this.#tripEvent);
      this.#replaceFormToPoint();
    }
  };

  #onFavoriteChangeClick = () => {
    this.#changeData(UserAction.UPDATE_TRIP_EVENT, UpdateType.PATCH, {...this.#tripEvent, isFavorite: !this.#tripEvent.isFavorite});
  };

  #onDeleteButtonClick = (tripEvent) => {
    this.#changeData(UserAction.DELETE_TRIP_EVENT, UpdateType.MINOR, tripEvent);
  };
}
