import { EachDayOfIntervalResult, isSameDay } from "date-fns";
import { SelectEvent } from "../db/types";

interface Props {
  daysForWeek: EachDayOfIntervalResult<
    {
      start: Date;
      end: Date;
    },
    undefined
  >;
  eventsThisWeek: SelectEvent[];
}

export const getMaxNumberOfEventsForWeekDay = ({ daysForWeek, eventsThisWeek }: Props) => {
  let maxNumberOfEventsForWeekDay = 0;

  daysForWeek.forEach(day => {
    const eventsForDay = eventsThisWeek.filter(event => isSameDay(event.start, day)).length;
    maxNumberOfEventsForWeekDay = Math.max(maxNumberOfEventsForWeekDay, eventsForDay);
  });

  return maxNumberOfEventsForWeekDay;
};

export const getHeightModifier = (count: number) => {
  if (count >= 7) return 72;
  if (count === 6) return 60;
  return 48;
};
