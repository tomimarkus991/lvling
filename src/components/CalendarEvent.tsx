import { Text, View } from "react-native";
import { SelectEvent } from "../db/types";
import { clsx } from "clsx";

export const CalendarEvent = ({ id, color, title }: SelectEvent) => {
  return (
    <View key={id} className={clsx("px-2 rounded-md mb-1")} style={{ backgroundColor: color }}>
      <Text className="text-sm text-center text-text" numberOfLines={1} ellipsizeMode="clip">
        {title}
      </Text>
    </View>
  );
};
