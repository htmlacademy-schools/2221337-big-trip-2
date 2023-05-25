const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const PointMode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

const UserAction = {
  ADD_TRIP_EVENT: 'ADD_TRIP_EVENT',
  UPDATE_TRIP_EVENT: 'UPDATE_TRIP_EVENT',
  DELETE_TRIP_EVENT: 'DELETE_TRIP_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const isEscapePushed = (evt) => evt.key === 'Escape';

export {TYPES, isEscapePushed, PointMode, UserAction, UpdateType};
