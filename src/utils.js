const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const PointMode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
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

export {getRandomIntInclusively, uppperFirstSymbol, TYPES, shuffle, isEscapePushed, PointMode};
