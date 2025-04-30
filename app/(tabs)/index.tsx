import { eachWeekOfInterval, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { useRef, useState } from "react";
import { Animated } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CalendarMonth } from "../../src/components/calendar/CalendarMonth";
import { DynamicHeader } from "../../src/components/ScrollHeader";
import { getSwipeMonthGesture } from "../../src/hooks/getSwipeMonthGesture";
import { useGetCurrentMonth } from "../../src/hooks/useGetCurrentMonth";
import { useSwipeInfo } from "../../src/hooks/useSwipeInfo";
import { SwipeInfo } from "../../src/types";
import { ColorPicker } from "../../src/components/calendar/ColorPicker";

export default function TabOneScreen() {
  const [swipeInfo, setSwipeInfo] = useState<SwipeInfo>({ direction: "none", id: 0 });
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [calendarMonthInfo, setCalendarMonthInfo] = useState({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const [weekStartDates, setWeekStartDates] = useState(
    eachWeekOfInterval({
      start: calendarMonthInfo.start,
      end: calendarMonthInfo.end,
    })
  );

  const swipeMonthGesture = getSwipeMonthGesture({ setSwipeInfo });

  useSwipeInfo({ setCurrentMonth, swipeInfo, translateX, opacity });
  useGetCurrentMonth({
    currentMonth,
    setWeekStartDates,
    setCalendarMonthInfo,
    calendarMonthInfo,
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <DynamicHeader month={currentMonth} translateX={translateX} opacity={opacity} />
        <GestureDetector gesture={swipeMonthGesture}>
          <Animated.View style={{ flex: 1, transform: [{ translateX }], opacity }}>
            <CalendarMonth weekStartDates={weekStartDates} />
          </Animated.View>
        </GestureDetector>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
