import { Gesture } from "react-native-gesture-handler";
import { useSharedValue, runOnJS } from "react-native-reanimated";
import { SwipeDirection, SwipeInfo } from "../types";

interface Props {
  setSwipeInfo: React.Dispatch<React.SetStateAction<SwipeInfo>>;
}

type SwipeGesture = {
  beginX: number;
  endX: number;
  swipeDirection: SwipeDirection;
};

export const getSwipeMonthGesture = ({ setSwipeInfo }: Props) => {
  const swipeGesture = useSharedValue<SwipeGesture>({
    beginX: 0,
    endX: 0,
    swipeDirection: "none",
  });

  const updateSwipeInfo = (dir: SwipeDirection) => {
    setSwipeInfo({ direction: dir, id: Date.now() });
  };

  return Gesture.Pan()
    .onBegin(e => {
      swipeGesture.value.beginX = e.absoluteX;
    })
    .onEnd(e => {
      swipeGesture.value.endX = e.absoluteX;

      // so user didn't actually want to scroll
      if (Math.abs(e.translationY) < 42) {
        if (swipeGesture.value.beginX > swipeGesture.value.endX) {
          swipeGesture.value.swipeDirection = "left";
        } else {
          // swipe right = go back a month
          swipeGesture.value.swipeDirection = "right";
        }
        runOnJS(updateSwipeInfo)(swipeGesture.value.swipeDirection);
      }
    });
};
