import {
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  formatDate,
  getWeek,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { DynamicHeader } from "../../src/components/ScrollHeader";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { eventsTable } from "../../src/db/schema";
import { db } from "../_layout";
import { and, gte, lte } from "drizzle-orm";
import { SelectEvent } from "../../src/db/types";
import { CalendarEvent } from "../../src/components/CalendarEvent";
import { getMaxNumberOfEventsForWeekDay } from "../../src/utils/utils";
import { P } from "../../src/components/P";

export default function TabOneScreen() {
  const currentDate = new Date();

  const firstDayOfCalendarMonth = startOfWeek(startOfMonth(currentDate));
  const lastDayOfCalendarMonth = endOfWeek(endOfMonth(currentDate));

  const weeksStartDates = eachWeekOfInterval({
    start: firstDayOfCalendarMonth,
    end: lastDayOfCalendarMonth,
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

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <DynamicHeader />
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {weeksStartDates.map(weekStartDate => {
            const daysForWeek = eachDayOfInterval({
              start: startOfWeek(weekStartDate),
              end: endOfWeek(weekStartDate),
            });

            const weekEvents = events.filter(event => isSameWeek(event.start, weekStartDate));

            return (
              <View
                id="week"
                key={weekStartDate.toISOString()}
                className={clsx("flex-[7] flex-row border-b-2 border-[#222222] mb-4")}
                style={{
                  height: 48 + getMaxNumberOfEventsForWeekDay({ daysForWeek, weekEvents }) * 19,
                }}
              >
                {daysForWeek.map(day => {
                  const currentDayEvents = weekEvents.filter(event => isSameDay(event.start, day));

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
                        return <CalendarEvent key={event.id} {...event} />;
                      })}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

//   const scrollRef = useRef<ScrollView>(null);
// useEffect(() => {
//   scrollRef.current?.scrollTo({ animated: true, y: 300 });
// }, []);
