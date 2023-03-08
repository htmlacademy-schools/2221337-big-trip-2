import dayjs from 'dayjs';
import { getRandomIntInclusively } from './utils.js';

const MAX_EVENT_TIME_GAP = 480;
const MAX_EVENT_DURATION = 48;
const MIN_EVENT_DURATION = 1;

const MAX_MINUTES_IN_HOUR = 60;
const MAX_HOURS_IN_DAY = 24;

const humanizeEventTime = (dateTime, format) => dayjs(dateTime).format(format).toUpperCase();

const transformTimeDifference = (difference) => {
  if(difference < MAX_MINUTES_IN_HOUR){
    return humanizeEventTime(dayjs().minute(difference), 'mm[M]');
  }
  else if (difference / MAX_MINUTES_IN_HOUR < MAX_HOURS_IN_DAY) {
    return humanizeEventTime(dayjs().hour(difference), 'HH[H] mm[M]');
  }
  return humanizeEventTime(dayjs().date(difference), 'DD[D] HH[H] mm[M]');
};

const getTimeDifference = (dateFrom, dateTo) => transformTimeDifference(dayjs(dateTo).diff(dayjs(dateFrom), 'minute'));

const generateDate = () => dayjs().add(getRandomIntInclusively(0, MAX_EVENT_TIME_GAP), 'hour').toString();

const generateDateTo = (dateFrom) => dayjs(dateFrom).add(getRandomIntInclusively(MIN_EVENT_DURATION, MAX_EVENT_DURATION), 'hour').toString();

export {humanizeEventTime, getTimeDifference, generateDate, generateDateTo};
