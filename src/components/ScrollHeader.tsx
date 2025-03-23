import { Text, View } from "react-native";

interface WeekDayProps {
  text: string;
}

const WeekDay = ({ text }: WeekDayProps) => {
  return <Text className="flex-1 text-center text-text">{text}</Text>;
};

export const DynamicHeader = () => {
  return (
    <View className="h-24 pt-6">
      <Text className="mb-3 ml-5 text-2xl font-semibold text-text">March 25</Text>
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
