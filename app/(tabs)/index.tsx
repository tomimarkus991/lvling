import clsx from "clsx";
import {
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useRef, useState } from "react";
import { Animated, Button, Modal, Pressable, View } from "react-native";
import { GestureDetector, ScrollView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CalendarDay } from "../../src/components/calendar/CalendarDay";
import { P } from "../../src/components/P";
import { DynamicHeader } from "../../src/components/ScrollHeader";
import { SelectEvent } from "../../src/db/types";
import { getSwipeMonthGesture } from "../../src/hooks/getSwipeMonthGesture";
import { useGetCurrentMonth } from "../../src/hooks/useGetCurrentMonth";
import { useSwipeInfo } from "../../src/hooks/useSwipeInfo";
import { SwipeInfo } from "../../src/types";
import { getMaxNumberOfEventsForWeekDay } from "../../src/utils/utils";
import { EditEventModal } from "../../src/components/calendar/event/EditEventModal";
import { CreateEventModal } from "../../src/components/calendar/event/CreateEventModal";
import { useEvent } from "../../src/hooks/EventContext";
import { MotiScrollView, MotiView } from "moti";
import { ANIMATION_DURATIONS } from "../../src/config";

export default function TabOneScreen() {
  const [selectedEvent, setSelectedEvent] = useState<SelectEvent | null>(null);
  const [swipeInfo, setSwipeInfo] = useState<SwipeInfo>({ direction: "none", id: 0 });
  const { events } = useEvent();
  const translateX = useRef(new Animated.Value(0)).current;

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

  useSwipeInfo({ setCurrentMonth, swipeInfo, translateX });
  useGetCurrentMonth({
    currentMonth,
    setWeekStartDates,
    setCalendarMonthInfo,
    calendarMonthInfo,
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <DynamicHeader month={currentMonth} translateX={translateX} />
        <GestureDetector gesture={swipeMonthGesture}>
          <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {weekStartDates.map(weekStartDate => {
                const daysForWeek = eachDayOfInterval({
                  start: startOfWeek(weekStartDate),
                  end: endOfWeek(weekStartDate),
                });

                const eventsThisWeek = daysForWeek.flatMap(day => {
                  const dayKey = format(day, "dd-MM-yyyy");
                  return events.get(dayKey) || [];
                });

                const maxEventsPerDay = getMaxNumberOfEventsForWeekDay({
                  daysForWeek,
                  eventsThisWeek,
                });

                return (
                  <View
                    id="week"
                    key={weekStartDate.toISOString()}
                    className={clsx("flex-[7] flex-row border-b-2 border-[#222222]")}
                    style={{
                      height: 48 + maxEventsPerDay * 24.5,
                    }}
                  >
                    {daysForWeek.map(day => {
                      const eventsForDay = events.get(format(day, "dd-MM-yyyy")) || [];

                      return (
                        <CalendarDay
                          key={day.toISOString()}
                          day={day}
                          eventsForDay={eventsForDay}
                          setSelectedEvent={setSelectedEvent}
                        />
                      );
                    })}
                  </View>
                );
              })}
              <EditEventModal selectedEvent={selectedEvent} />
              <CreateEventModal />
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
