import clsx from "clsx";
import { formatDate, isSameMonth, isToday } from "date-fns";
import React from "react";
import { Pressable, View } from "react-native";
import { SelectEvent } from "../../db/types";
import { useModal } from "../../hooks/ModalContext";
import { P } from "../P";
import { CalendarEvent } from "./CalendarEvent";
import { useSelect } from "../../hooks/SelectContext";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

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

  return (
    <GestureDetector gesture={Gesture.Exclusive(doubleTap, singleTap)}>
      <View className="flex-1 pt-4 mx-1">
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
      </View>
    </GestureDetector>
  );
});
