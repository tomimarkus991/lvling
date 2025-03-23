import { Text, View } from "react-native";
import { P } from "./P";

interface WeekDayProps {
  text: string;
}

const WeekDay = ({ text }: WeekDayProps) => {
  return <P className="flex-1 text-center">{text}</P>;
};

export const DynamicHeader = () => {
  return (
    <View className="h-24 pt-6">
      <P className="mb-3 ml-5 text-2xl font-semibold">March 25</P>
      <View className="flex-[7] flex-row">
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
