import { getRandomIntInclusively, shuffle } from '../utils/common.js';

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

const MAX_SENTENCES = 5;

const MAX_PHOTO_INDEX = 100;
const MAX_PHOTO_COUNT = 5;

const generateEventDestination = (id) => (
  {
    id,
    description: shuffle(DESCRIPTIONS).slice(0, getRandomIntInclusively(0, MAX_SENTENCES)).join(' '),
    name: PLACES_NAMES[getRandomIntInclusively(1, PLACES_NAMES.length - 1)],
    pictures: Array.from({length: getRandomIntInclusively(0, MAX_PHOTO_COUNT)}, () => (
      {
        src: `http://picsum.photos/248/152?r=${getRandomIntInclusively(1, MAX_PHOTO_INDEX)}`,
        description: DESCRIPTIONS[getRandomIntInclusively(0, DESCRIPTIONS.length - 1)],
      }
    )),
  }
);

export {generateEventDestination};
