import { Text, View } from "react-native";
import { P } from "./P";

import AntDesign from '@expo/vector-icons/AntDesign';

interface WeekDayProps {
  text: string;
}

const WeekDay = ({ text }: WeekDayProps) => {
  return <P className="flex-1 text-center">{text}</P>;
};

export const DynamicHeader = () => {
  return (
    <View className="mb-4 h-28 pt-7">
      <View className="flex-row justify-between mx-5 mb-3">

      <P className="text-2xl font-semibold">March 25</P>
      <AntDesign name="questioncircleo" size={24} color="white" />
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
