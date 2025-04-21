import {
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  eachWeekOfInterval,
  EachWeekOfIntervalResult,
} from "date-fns";
import { and, gte, lte } from "drizzle-orm";
import { useEffect } from "react";
import { db } from "../../app/_layout";
import { eventsTable } from "../db/schema";
import { SelectEvent } from "../db/types";

interface Props {
  currentMonth: Date;
  setWeekStartDates: React.Dispatch<
    React.SetStateAction<
      EachWeekOfIntervalResult<
        {
          start: Date;
          end: Date;
        },
        undefined
      >
    >
  >;
  setCalendarMonthInfo: React.Dispatch<
    React.SetStateAction<{
      start: Date;
      end: Date;
    }>
  >;
  calendarMonthInfo: {
    start: Date;
    end: Date;
  };
  setEvents: React.Dispatch<React.SetStateAction<SelectEvent[]>>;
}

export const useGetCurrentMonth = ({
  currentMonth,
  setWeekStartDates,
  setCalendarMonthInfo,
  calendarMonthInfo,
  setEvents,
}: Props) => {
  useEffect(() => {
    const firstDayOfCalendarMonth = startOfWeek(startOfMonth(currentMonth));
    const lastDayOfCalendarMonth = endOfWeek(endOfMonth(currentMonth));

    setWeekStartDates(
      eachWeekOfInterval({
        start: firstDayOfCalendarMonth,
        end: lastDayOfCalendarMonth,
      })
    );
    setCalendarMonthInfo({
      start: firstDayOfCalendarMonth,
      end: lastDayOfCalendarMonth,
    });
  }, [currentMonth]);

  useEffect(() => {
    const fetchEventsForMonth = async () => {
      const events = await db
        .select()
        .from(eventsTable)
        .where(
          and(
            gte(eventsTable.start, calendarMonthInfo.start),
            lte(eventsTable.end, calendarMonthInfo.end)
          )
        );

      setEvents(events);
    };

    fetchEventsForMonth();
  }, [calendarMonthInfo]);
};
