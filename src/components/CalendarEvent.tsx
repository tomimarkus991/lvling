import { View } from "react-native";
import { SelectEvent } from "../db/types";
import { clsx } from "clsx";
import { P } from "./P";

export const CalendarEvent = ({ id, color, title }: SelectEvent) => {
  return (
    <View
      key={id}
      className={clsx("px-2 rounded-md mb-1 justify-center items-center")}
      style={{ backgroundColor: color }}
    >
      <P className="mt-1 text-sm" fontFamily="Rubik-Medium" numberOfLines={1} ellipsizeMode="clip">
        {title}
      </P>
    </View>
  );
};
