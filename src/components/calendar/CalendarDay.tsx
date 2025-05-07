import { formatDate, isSameMonth, isToday } from "date-fns";
import React from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { SelectEvent } from "../../db/types";
import { useModal } from "../../hooks/ModalContext";
import { useSelect } from "../../hooks/SelectContext";
import { P } from "../P";
import { CalendarEvent } from "./CalendarEvent";

interface Props {
  eventsForDay: SelectEvent[];
  day: Date;
  setSelectedEvent: (event: SelectEvent) => void;
}

export const CalendarDay = React.memo(({ day, eventsForDay, setSelectedEvent }: Props) => {
  const { setIsEditEventModalVisible, setIsCreateEventModalVisible, setIsRestModalVisible } =
    useModal();
  const { setSelectedDate } = useSelect();

  const singleTapAction = () => {
    setSelectedDate(day);
    setIsCreateEventModalVisible(true);
  };

  const doubleTapAction = () => {
    setSelectedDate(day);
    setIsRestModalVisible(true);
  };

  const singleTap = Gesture.Tap().onStart(() => {
    runOnJS(singleTapAction)();
  });
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      runOnJS(doubleTapAction)();
    });

  console.log(isToday(day));

  return (
    <GestureDetector gesture={Gesture.Exclusive(doubleTap, singleTap)}>
      <View className="flex-1 pt-4 mx-1">
        <P
          className={"text-center mb-1"}
          style={{
            color: isToday(day)
              ? "#0A84FF"
              : `${isSameMonth(new Date(), day) ? "#E5E5E7" : "#575757"}`,
          }}
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
      </View>
    </GestureDetector>
  );
});
