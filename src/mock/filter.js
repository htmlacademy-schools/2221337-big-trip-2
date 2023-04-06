import { filter } from '../utils/filter.js';

const generateFilters = (tripEvents) => Object.entries(filter).map(
  ([filterType, filterEvents]) => ({
    type: filterType,
    count: filterEvents(tripEvents).length,
  }));

export {generateFilters};
