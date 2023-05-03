import { sortByDate, sortByDuration } from './trip-event-date.js';

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const sortTripEvents = {
  [SortType.DAY]: (tripEvents) => tripEvents.sort(sortByDate),
  [SortType.TIME]: (tripEvents) => tripEvents.sort(sortByDuration),
  [SortType.PRICE]: (tripEvents) => tripEvents.sort((current, next) => next.basePrice - current.basePrice),
};

export {SortType, sortTripEvents};
