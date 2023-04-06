import dayjs from 'dayjs';
import { getRandomIntInclusively } from './common.js';

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

const getTimeDifference = (dateFrom, dateTo, unit) => transformTimeDifference(dayjs(dateTo).diff(dayjs(dateFrom), unit));

const generateDate = () => getRandomIntInclusively(0, 1)
  ? dayjs().add(getRandomIntInclusively(0, MAX_EVENT_TIME_GAP), 'hour').toString()
  : dayjs().subtract(getRandomIntInclusively(0, MAX_EVENT_TIME_GAP), 'hour').toString();

const generateDateTo = (dateFrom) => dayjs(dateFrom).add(getRandomIntInclusively(MIN_EVENT_DURATION, MAX_EVENT_DURATION), 'hour').toString();

const isPast = (date, unit) => dayjs().isAfter(dayjs(date), unit);

const isFuture = (date, unit) => dayjs().isBefore(dayjs(date), unit) || dayjs().isSame(dayjs(date), unit);

const getEarliestEvent = (tripEvents) => {
  let earliestEvent = tripEvents[0];
  for(let i = 1; i < tripEvents.length; i++) {
    if(dayjs(tripEvents[i].dateFrom).diff(dayjs(earliestEvent.dateFrom), 'M') < 0
      || dayjs(tripEvents[i].dateFrom).diff(dayjs(earliestEvent.dateFrom), 'M') === 0
      && dayjs(tripEvents[i].dateFrom).diff(dayjs(earliestEvent.dateFrom), 'D') < 0) {
      earliestEvent = tripEvents[i];
    }
  }
  return earliestEvent;
};

const getLatestEvent = (tripEvents) => {
  let latestEvent = tripEvents[0];
  for(let i = 1; i < tripEvents.length; i++) {
    if(dayjs(tripEvents[i].dateTo).diff(dayjs(latestEvent.dateTo), 'M') > 0
      || dayjs(tripEvents[i].dateTo).diff(dayjs(latestEvent.dateTo), 'M') === 0
      && dayjs(tripEvents[i].dateTo).diff(dayjs(latestEvent.dateTo), 'D') > 0) {
      latestEvent = tripEvents[i];
    }
  }
  return latestEvent;
};

export {humanizeEventTime, getTimeDifference, generateDate, generateDateTo, isPast, isFuture, getEarliestEvent, getLatestEvent};
