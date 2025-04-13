import { GestureResponderEvent, Pressable } from "react-native";
import { SelectEvent } from "../db/types";
import { clsx } from "clsx";
import { P } from "./P";

interface Props extends SelectEvent {
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}

export const CalendarEvent = ({ id, color, title, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      key={id}
      className={clsx("px-[0.3rem] rounded-md mb-1 justify-center items-center")}
      style={{ backgroundColor: color }}
      android_ripple={{ color: "transparent" }}
    >
      <P className="mt-1 text-sm" fontFamily="Rubik-Medium" numberOfLines={1} ellipsizeMode="clip">
        {title}
      </P>
    </Pressable>
  );
};
