import { GestureResponderEvent, Pressable } from "react-native";
import { SelectEvent } from "../../db/types";
import { clsx } from "clsx";
import { P } from "../P";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface Props extends SelectEvent {
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}

export const CalendarEvent = ({ id, color, title, onPress }: Props) => {
  const blockGesture = Gesture.Tap().onStart(() => {});

  return (
    <GestureDetector gesture={blockGesture}>
      <Pressable
        onPress={onPress}
        key={id}
        className={clsx("px-[0.3rem] rounded-md mb-1 justify-center items-center")}
        style={{ backgroundColor: color }}
        android_ripple={{ color: "transparent" }}
      >
        <P
          className="text-sm"
          fontFamily="Rubik-Medium"
          style={{
            color: color === "#eab308" ? "#121212" : "#FFFFFF",
          }}
        >
          {title}
        </P>
      </Pressable>
    </GestureDetector>
  );
};
