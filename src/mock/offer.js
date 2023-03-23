import { getRandomIntInclusively } from '../utils/common.js';

const MIN_OFFER_PRICE = 25;
const MAX_OFFER_PRICE = 200;

const generateOffer = (id, title) => (
  {
    id,
    title: title,
    price: getRandomIntInclusively(MIN_OFFER_PRICE, MAX_OFFER_PRICE),
  }
);

const generateOffersByType = (type, offers) => (
  {
    type,
    offers,
  }
);

export {generateOffersByType, generateOffer};
