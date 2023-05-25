import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class TripEventApiService extends ApiService {
  get tripEvents() {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  get offersByType() {
    return this._load({url: 'offers'}).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  updateTripEvent = async (tripEvent) => {
    const response = await this._load({
      url: `points/${tripEvent.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(tripEvent)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponce = await ApiService.parseResponse(response);
    return parsedResponce;
  };

  #adaptToServer(tripEvent) {
    const adaptedTripEvent = {...tripEvent,
      'base_price': tripEvent.basePrice,
      'date_from': tripEvent.dateFrom,
      'date_to': tripEvent.dateTo,
      'is_favorite': tripEvent.isFavorite,
    };

    delete adaptedTripEvent.basePrice;
    delete adaptedTripEvent.dateFrom;
    delete adaptedTripEvent.dateTo;
    delete adaptedTripEvent.isFavorite;

    return adaptedTripEvent;
  }
}
