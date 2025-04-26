import { add, sub } from "date-fns";
import { useEffect, useRef } from "react";
import { SwipeInfo } from "../types";
import { Animated, Easing } from "react-native";
import { ANIMATION_DURATIONS } from "../config";

interface Props {
  swipeInfo: SwipeInfo;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  translateX: Animated.Value;
}

export const useSwipeInfo = ({ setCurrentMonth, swipeInfo, translateX }: Props) => {
  const animateSwipe = (direction: "left" | "right") => {
    Animated.sequence([
      Animated.timing(translateX, {
        toValue:
          direction === "left" ? -ANIMATION_DURATIONS.monthSwipe : ANIMATION_DURATIONS.monthSwipe,
        duration: ANIMATION_DURATIONS.monthSwipe,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (swipeInfo.direction === "left" || swipeInfo.direction === "right") {
      setCurrentMonth(old =>
        swipeInfo.direction === "left" ? add(old, { months: 1 }) : sub(old, { months: 1 })
      );
      animateSwipe(swipeInfo.direction);
    }
  }, [swipeInfo]);
};
