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
  weekEvents: SelectEvent[];
}

export const getMaxNumberOfEventsForWeekDay = ({ daysForWeek, weekEvents }: Props) => {
  let maxNumberOfEventsForWeekDay = 0;

  daysForWeek.forEach(day => {
    const eventsForDay = weekEvents.filter(event => isSameDay(event.start, day)).length;
    maxNumberOfEventsForWeekDay = Math.max(maxNumberOfEventsForWeekDay, eventsForDay);
  });

  return maxNumberOfEventsForWeekDay;
};
