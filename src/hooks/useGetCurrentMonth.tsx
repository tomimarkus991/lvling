import {
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  eachWeekOfInterval,
  EachWeekOfIntervalResult,
  format,
  add,
  sub,
} from "date-fns";
import { and, gte, lte } from "drizzle-orm";
import { useEffect } from "react";
import { db } from "../../app/_layout";
import { eventsTable } from "../db/schema";
import { SelectEvent } from "../db/types";
import { useEvent } from "./EventContext";

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
}

export const useGetCurrentMonth = ({
  currentMonth,
  setWeekStartDates,
  setCalendarMonthInfo,
  calendarMonthInfo,
}: Props) => {
  const { setEvents } = useEvent();

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

  const groupEventsByDay = (events: SelectEvent[]) => {
    const map = new Map<string, SelectEvent[]>();

    events.forEach(event => {
      const dayKey = format(event.start, "dd-MM-yyyy");
      if (!map.has(dayKey)) {
        map.set(dayKey, []);
      }
      map.get(dayKey)!.push(event);
    });

    return map;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const start = startOfWeek(startOfMonth(sub(currentMonth, { months: 1 })));
      const end = endOfWeek(endOfMonth(add(currentMonth, { months: 1 })));

      const events = await db
        .select()
        .from(eventsTable)
        .where(
          and(gte(eventsTable.start, start.toISOString()), lte(eventsTable.end, end.toISOString()))
        );

      const groupedEvents = groupEventsByDay(events);

      setEvents(groupedEvents);
    };

    fetchEvents();
  }, [calendarMonthInfo]);
};
