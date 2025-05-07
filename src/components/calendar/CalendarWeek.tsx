import clsx from "clsx";
import { eachDayOfInterval, endOfWeek, format, startOfWeek } from "date-fns";
import { View } from "react-native";
import { CalendarDay } from "./CalendarDay";
import React from "react";
import { SelectEvent } from "../../db/types";

interface Props {
  events: Map<string, SelectEvent[]>;
  weekStartDate: Date;
  setSelectedEvent: (event: SelectEvent) => void;
  currentMonth: Date;
}

export const CalendarWeek = React.memo(
  ({ events, weekStartDate, setSelectedEvent, currentMonth }: Props) => {
    const daysForWeek = eachDayOfInterval({
      start: startOfWeek(weekStartDate),
      end: endOfWeek(weekStartDate),
    });

    return (
      <View
        id="week"
        key={weekStartDate.toISOString()}
        className={clsx("flex-[7] flex-row border-b-2 border-[#222222]")}
      >
        {daysForWeek.map(day => {
          const eventsForDay = events.get(format(day, "dd-MM-yyyy")) || [];

          return (
            <CalendarDay
              key={day.toISOString()}
              day={day}
              eventsForDay={eventsForDay}
              setSelectedEvent={setSelectedEvent}
              currentMonth={currentMonth}
            />
          );
        })}
      </View>
    );
  }
);
