import clsx from "clsx";
import { isToday, isSameMonth, formatDate } from "date-fns";
import { View } from "react-native";
import { P } from "../P";
import { CalendarEvent } from "./CalendarEvent";
import { SelectEvent } from "../../db/types";

interface Props {
  eventsForDay: SelectEvent[];
  day: Date;
  setSelectedEvent: (event: SelectEvent) => void;
  setModalVisible: (value: boolean) => void;
}

export const CalendarDay = ({ day, eventsForDay, setModalVisible, setSelectedEvent }: Props) => {
  return (
    <View className="flex-1 mx-1">
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
              setModalVisible(true);
            }}
            {...event}
          />
        );
      })}
    </View>
  );
};
