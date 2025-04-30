import { add, sub } from "date-fns";
import { useEffect } from "react";
import { SwipeInfo } from "../types";
import { Animated, Easing } from "react-native";
import { ANIMATION_DURATIONS } from "../config";

interface Props {
  swipeInfo: SwipeInfo;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  translateX: Animated.Value;
  opacity: Animated.Value;
}

export const useSwipeInfo = ({ setCurrentMonth, swipeInfo, translateX, opacity }: Props) => {
  const animateSwipe = (direction: "left" | "right") => {
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: direction === "left" ? -50 : 50,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 10,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
    ]).start();
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATION_DURATIONS.monthSwipe,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
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
