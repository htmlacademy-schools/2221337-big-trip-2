import { getRandomIntInclusively, shuffle, DESCRIPTIONS, PLACES_NAMES } from '../utils/common.js';

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
