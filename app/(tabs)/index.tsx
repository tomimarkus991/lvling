import {
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  formatDate,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { DynamicHeader } from "../../components/ScrollHeader";
import clsx from "clsx";

// https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
export default function TabOneScreen() {
  const currentDate = new Date();

  const firstDayOfCalendarMonth = startOfWeek(startOfMonth(currentDate));
  const lastDayOfCalendarMonth = endOfWeek(endOfMonth(currentDate));

  // const twoWeeksBeforeCurrentWeek = {
  //   startDate: startOfWeek(subWeeks(currentDate, 2)),
  //   endDate: endOfWeek(subWeeks(currentDate, 1)),
  // };
  // const currentWeek = {
  //   startDate: startOfWeek(currentDate),
  //   endDate: endOfWeek(currentDate),
  // };
  // const oneWeekAfterCurrentWeek = {
  //   startDate: startOfWeek(addWeeks(currentDate, 1)),
  //   endDate: endOfWeek(addWeeks(currentDate, 1)),
  // };

  const weeksStartDates = eachWeekOfInterval({
    start: firstDayOfCalendarMonth,
    end: lastDayOfCalendarMonth,
  });

  console.log(firstDayOfCalendarMonth, lastDayOfCalendarMonth, weeksStartDates);

  // get current day, then render that week and two weeks before that and one week after that so total of 4 weeks are on the screen at all times
  // when user scrolls items are rendered dynamically and months change according to how many same month stuff is on screen

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <DynamicHeader />
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {weeksStartDates.map(weekStartDate => {
            console.log(weekStartDate);

            const daysForWeek = eachDayOfInterval({
              start: startOfWeek(weekStartDate),
              end: endOfWeek(weekStartDate),
            });
            console.log(daysForWeek);

            return (
              <View
                id="week"
                key={weekStartDate.toISOString()}
                className="flex-[7] h-32 flex-row border-b-2 border-[#222222] mb-4"
              >
                {daysForWeek.map(day => {
                  console.log(day, isSameMonth(currentDate, day));

                  return (
                    <View key={day.toISOString()} className="flex-1">
                      <Text
                        className={clsx(
                          "text-center",
                          isToday(day)
                            ? "text-primary"
                            : `${isSameMonth(currentDate, day) ? "text-text" : "text-[#575757]"}`
                        )}
                      >
                        {formatDate(day, "dd")}
                      </Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
    // <View className="items-center justify-center flex-1 bg-background">
    //   <View className="grid grid-rows-5">
    //     {weeks.map(week => {
    //       const daysForWeek = eachDayOfInterval({
    //         start: startOfWeek(week),
    //         end: endOfWeek(week),
    //       });
    //       return (
    //         <View
    //           id="week"
    //           key={week.toISOString()}
    //           className="grid grid-cols-7 border-t first:border-t-0 last:border-b-0 border-stone-100 h-28"
    //         >
    //           {daysForWeek.map(day => (
    //             <Text key={day.toISOString()} className="text-text">
    //               {day.getDate()}
    //             </Text>
    //           ))}
    //         </View>
    //       );
    //     })}
    //   </View>
    // </View>
  );
}
// <SectionList
//   sections={DATA}
//   extraData={DATA}
//   keyExtractor={(item, index) => item + index}
//   renderItem={({ item }) => (
//     <View className="p-5 my-4 bg-blue-800">
//       <Text className="text-lg text-white">{item}</Text>
//     </View>
//   )}
//   renderSectionHeader={({ section: { title } }) => (
//     <Text className="text-3xl text-white">{title}</Text>
//   )}
// />;
//   const scrollRef = useRef<ScrollView>(null);
// useEffect(() => {
//   scrollRef.current?.scrollTo({ animated: true, y: 300 });
// }, []);
