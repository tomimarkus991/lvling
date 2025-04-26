import clsx from "clsx";
import { formatDate, isSameMonth, isToday } from "date-fns";
import React from "react";
import { Pressable } from "react-native";
import { SelectEvent } from "../../db/types";
import { useModal } from "../../hooks/ModalContext";
import { P } from "../P";
import { CalendarEvent } from "./CalendarEvent";

interface Props {
  eventsForDay: SelectEvent[];
  day: Date;
  setSelectedEvent: (event: SelectEvent) => void;
}

export const CalendarDay = React.memo(({ day, eventsForDay, setSelectedEvent }: Props) => {
  const { setIsEditEventModalVisible, setIsCreateEventModalVisible, setSelectedDate } = useModal();

  return (
    <Pressable
      className="flex-1 pt-4 mx-1"
      onPress={() => {
        setSelectedDate(day);
        setIsCreateEventModalVisible(true);
      }}
    >
      <P
        className={clsx(
          "text-center mb-1",
          isToday(day)
            ? "text-primary"
            : `${isSameMonth(new Date(), day) ? "text-text" : "text-[#575757]"}`
        )}
      >
        {formatDate(day, "dd")}
      </P>
      {eventsForDay.map(event => {
        return (
          <CalendarEvent
            key={event.id}
            onPress={() => {
              setSelectedEvent(event);
              setIsEditEventModalVisible(true);
            }}
            {...event}
          />
        );
      })}
    </Pressable>
  );
});
