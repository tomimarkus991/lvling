import { Pressable, Text, View } from "react-native";
import { P } from "./P";

import AntDesign from "@expo/vector-icons/AntDesign";
import { format } from "date-fns";
import { db } from "../../app/_layout";
import { eventsTable } from "../db/schema";
import { generateData } from "../db/generateData";

interface WeekDayProps {
  text: string;
}

const WeekDay = ({ text }: WeekDayProps) => {
  return <P className="flex-1 text-center">{text}</P>;
};

interface Props {
  month: Date;
}

export const DynamicHeader = ({ month }: Props) => {
  return (
    <View className="h-28 pt-7">
      <View className="flex-row justify-between mx-5 mb-3">
        <P className="text-2xl font-semibold">{format(month, "MMMM yy")}</P>
        <Pressable
          onPress={async () => {
            console.log("Generating data");

            // await db.delete(eventsTable).all();
            await generateData(4, 2025);
          }}
        >
          <AntDesign name="questioncircleo" size={24} color="white" />
        </Pressable>
      </View>
      <View className="flex-[7] flex-row mt-2">
        <WeekDay text="Mon" />
        <WeekDay text="Tue" />
        <WeekDay text="Wed" />
        <WeekDay text="Thu" />
        <WeekDay text="Fri" />
        <WeekDay text="Sat" />
        <WeekDay text="Sun" />
      </View>
    </View>
  );
};
