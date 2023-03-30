import { isPast, isFuture } from './trip-event-date.js';

const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};


const filter = {
  [FilterTypes.EVERYTHING]: (tripEvents) => tripEvents,
  [FilterTypes.FUTURE]: (tripEvents) => tripEvents.filter((point) => isFuture(point.dateFrom, 'D') || isFuture(point.dateTo, 'D')),
  [FilterTypes.PAST]: (tripEvents) => tripEvents.filter((point) => isPast(point.dateTo, 'D') || isPast(point.dateFrom, 'D')),
};

export {filter, FilterTypes};
