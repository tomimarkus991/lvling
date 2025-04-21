import clsx from "clsx";
import {
  add,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  formatDate,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isToday,
  startOfMonth,
  startOfWeek,
  sub,
} from "date-fns";
import { and, gte, lte } from "drizzle-orm";
import { useEffect, useState } from "react";
import { Button, Modal, Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector, ScrollView } from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CalendarEvent } from "../../src/components/CalendarEvent";
import { P } from "../../src/components/P";
import { DynamicHeader } from "../../src/components/ScrollHeader";
import { eventsTable } from "../../src/db/schema";
import { SelectEvent } from "../../src/db/types";
import { getMaxNumberOfEventsForWeekDay } from "../../src/utils/utils";
import { db } from "../_layout";

type SwipeDirection = "left" | "right" | "none";
type SwipeGesture = {
  beginX: number;
  endX: number;
  swipeDirection: SwipeDirection;
};

type SwipeInfo = {
  direction: SwipeDirection;
  id: number; // useful to detect changes even if direction is the same
};

export default function TabOneScreen() {
  const [selectedEvent, setSelectedEvent] = useState<SelectEvent | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [swipeInfo, setSwipeInfo] = useState<SwipeInfo>({ direction: "none", id: 0 });

  const currentDate = new Date();

  const [currentMonth, setCurrentMonth] = useState(currentDate);

  const [firstDayOfCalendarMonth, setFirstDayOfCalendarMonth] = useState(
    startOfWeek(startOfMonth(currentMonth))
  );
  const [lastDayOfCalendarMonth, setLastDayOfCalendarMonth] = useState(
    endOfWeek(endOfMonth(currentMonth))
  );

  const [weeksStartDates, setWeeksStartDates] = useState(
    eachWeekOfInterval({
      start: firstDayOfCalendarMonth,
      end: lastDayOfCalendarMonth,
    })
  );

  const swipeGesture = useSharedValue<SwipeGesture>({
    beginX: 0,
    endX: 0,
    swipeDirection: "none",
  });

  const updateSwipeInfo = (dir: SwipeDirection) => {
    setSwipeInfo({ direction: dir, id: Date.now() });
  };

  const panGesture = Gesture.Pan()
    .onBegin(e => {
      swipeGesture.value.beginX = e.absoluteX;
    })
    .onEnd(e => {
      swipeGesture.value.endX = e.absoluteX;

      // so user didn't actually want to scroll
      if (Math.abs(e.translationY) < 42) {
        if (swipeGesture.value.beginX > swipeGesture.value.endX) {
          swipeGesture.value.swipeDirection = "left";
        } else {
          // swipe right = go back a month
          swipeGesture.value.swipeDirection = "right";
        }
        runOnJS(updateSwipeInfo)(swipeGesture.value.swipeDirection);

        console.log(swipeGesture.value.swipeDirection);
      }
    });

  const [events, setEvents] = useState<SelectEvent[]>([]);

  useEffect(() => {
    const getEvents = async () => {
      const events = await db
        .select()
        .from(eventsTable)
        .where(
          and(
            gte(eventsTable.start, firstDayOfCalendarMonth),
            lte(eventsTable.end, lastDayOfCalendarMonth)
          )
        );

      setEvents(events);
    };
    getEvents();
  }, []);

  useEffect(() => {
    if (swipeInfo.direction === "left") {
      setCurrentMonth(oldCurrentMonth => {
        console.log(oldCurrentMonth);

        return add(oldCurrentMonth, { months: 1 });
      });
    } else if (swipeInfo.direction === "right") {
      setCurrentMonth(oldCurrentMonth => sub(oldCurrentMonth, { months: 1 }));
    }
  }, [swipeInfo]);

  useEffect(() => {
    const firstDayOfCalendarMonthVar = startOfWeek(startOfMonth(currentMonth));
    const lastDayOfCalendarMonthVar = endOfWeek(endOfMonth(currentMonth));

    setWeeksStartDates(
      eachWeekOfInterval({
        start: firstDayOfCalendarMonthVar,
        end: lastDayOfCalendarMonthVar,
      })
    );

    setFirstDayOfCalendarMonth(firstDayOfCalendarMonthVar);
    setLastDayOfCalendarMonth(lastDayOfCalendarMonthVar);
  }, [currentMonth]);

  useEffect(() => {
    const getEvents = async () => {
      const events = await db
        .select()
        .from(eventsTable)
        .where(
          and(
            gte(eventsTable.start, firstDayOfCalendarMonth),
            lte(eventsTable.end, lastDayOfCalendarMonth)
          )
        );

      setEvents(events);
    };

    getEvents();
  }, [firstDayOfCalendarMonth, lastDayOfCalendarMonth]);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <DynamicHeader month={currentMonth} />
        <GestureDetector gesture={panGesture}>
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {weeksStartDates.map(weekStartDate => {
              const daysForWeek = eachDayOfInterval({
                start: startOfWeek(weekStartDate),
                end: endOfWeek(weekStartDate),
              });

              const weekEvents = events.filter(event => isSameWeek(event.start, weekStartDate));

              let heightModifier = 48;

              const maxNumberOfEventsForWeekDay = getMaxNumberOfEventsForWeekDay({
                daysForWeek,
                weekEvents,
              });

              if (maxNumberOfEventsForWeekDay >= 7) {
                heightModifier = 72;
              } else if (maxNumberOfEventsForWeekDay === 6) {
                heightModifier = 60;
              }
              return (
                <View
                  id="week"
                  key={weekStartDate.toISOString()}
                  className={clsx("flex-[7] flex-row border-b-2 border-[#222222] mb-4")}
                  style={{
                    height: heightModifier + maxNumberOfEventsForWeekDay * 19,
                  }}
                >
                  {daysForWeek.map(day => {
                    const currentDayEvents = weekEvents.filter(event =>
                      isSameDay(event.start, day)
                    );

                    return (
                      <View key={day.toISOString()} className="flex-1 mx-1">
                        <P
                          className={clsx(
                            "text-center mb-1",
                            isToday(day)
                              ? "text-primary"
                              : `${isSameMonth(currentDate, day) ? "text-text" : "text-[#575757]"}`
                          )}
                        >
                          {formatDate(day, "dd")}
                        </P>
                        {currentDayEvents.map(event => {
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
                  })}
                </View>
              );
            })}

            <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)} transparent>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="absolute top-0 left-0 w-full h-full bg-neutral-950 opacity-80"
              />
              <View className="items-center justify-center p-5 mx-5 mt-auto mb-auto rounded-md bg-modal">
                <P>{selectedEvent?.title}</P>
                <P>{selectedEvent?.id}</P>
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </View>
            </Modal>
          </ScrollView>
        </GestureDetector>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

//   const scrollRef = useRef<ScrollView>(null);
// useEffect(() => {
//   scrollRef.current?.scrollTo({ animated: true, y: 300 });
// }, []);

const styles = StyleSheet.create({
  swipeable: {
    flex: 1,
  },
});
