import { ScrollView } from "react-native";
import { CalendarWeek } from "./CalendarWeek";
import { CreateEventModal } from "./event/CreateEventModal";
import { EditEventModal } from "./event/EditEventModal";
import React, { useState } from "react";
import { SelectEvent } from "../../db/types";
import { useEvent } from "../../hooks/EventContext";

interface Props {
  weekStartDates: Date[];
}
export const CalendarMonth = React.memo(({ weekStartDates }: Props) => {
  const [selectedEvent, setSelectedEvent] = useState<SelectEvent | null>(null);
  const { events } = useEvent();
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {weekStartDates.map(weekStartDate => {
        return (
          <CalendarWeek
            events={events}
            setSelectedEvent={setSelectedEvent}
            weekStartDate={weekStartDate}
            key={weekStartDate.toISOString()}
          />
        );
      })}
      <EditEventModal selectedEvent={selectedEvent} />
      <CreateEventModal />
    </ScrollView>
  );
});
