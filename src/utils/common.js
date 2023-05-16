const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const PLACES_NAMES = ['Los Angeles', 'Toronto', 'Tokyo', 'Oakland', 'Sydney',
  'Zurich', 'Stockholm', 'Paris', 'London', 'Rome', 'Berlin', 'Copenhagen'];

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
};

const getRandomIntInclusively = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  if(min < 0 || max < 0){
    return -1;
  }
  if(min > max){
    [min, max] = [max, min];
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const uppperFirstSymbol = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const shuffle = (array) => {
  for(let firstIndex = array.length - 1; firstIndex > 0; firstIndex--) {
    const randomIndex = Math.floor(Math.random() * (firstIndex + 1));
    [array[firstIndex], array[randomIndex]] = [array[randomIndex], array[firstIndex]];
  }

  return array;
};

const isEscapePushed = (evt) => evt.key === 'Escape';

export {getRandomIntInclusively, uppperFirstSymbol, TYPES, shuffle, isEscapePushed, PointMode,
  DESCRIPTIONS, PLACES_NAMES, UserAction, UpdateType};
