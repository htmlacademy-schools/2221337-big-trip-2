import dayjs from 'dayjs';

const MAX_MINUTES_IN_HOUR = 60;
const MAX_HOURS_IN_DAY = 24;

const humanizeEventTime = (dateTime, format) => dayjs(dateTime).format(format).toUpperCase();

const transformTimeDifference = (difference) => {
  let format = 'DD[D] HH[H] mm[M]';

  if(difference < MAX_MINUTES_IN_HOUR){
    format = 'mm[M]';
  }
  else if (difference / MAX_MINUTES_IN_HOUR < MAX_HOURS_IN_DAY) {
    format = 'HH[H] mm[M]';
  }
  return humanizeEventTime(dayjs()
    .date(difference / (MAX_MINUTES_IN_HOUR * MAX_HOURS_IN_DAY))
    .hour((difference / MAX_MINUTES_IN_HOUR) % MAX_HOURS_IN_DAY)
    .minute(difference % MAX_MINUTES_IN_HOUR), format);
};

const getTimeDifference = (dateFrom, dateTo) => transformTimeDifference(dayjs(dateTo).diff(dayjs(dateFrom), 'minute'));

const isPast = (date, unit, dateFrom = dayjs()) => dayjs(dateFrom).isAfter(dayjs(date), unit);

const isFuture = (date, unit) => dayjs().isBefore(dayjs(date), unit) || dayjs().isSame(dayjs(date), unit);

const sortByDate = (currentEvent, nextEvent) => {
  const dateFromDifference = dayjs(currentEvent.dateFrom).diff(dayjs(nextEvent.dateFrom));

  return dateFromDifference === 0 ? dayjs(nextEvent.dateTo).diff(dayjs(currentEvent.dateTo)) : dateFromDifference;
};

const sortByDuration = (currentEvent, nextEvent) => dayjs(nextEvent.dateTo).diff(dayjs(nextEvent.dateFrom)) - dayjs(currentEvent.dateTo).diff(dayjs(currentEvent.dateFrom));

const areDatesSame = (oldDate, newDate) => dayjs(oldDate).isSame(dayjs(newDate));

export {humanizeEventTime, getTimeDifference, isPast, isFuture, sortByDate, sortByDuration, areDatesSame};
