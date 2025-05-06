import { Gesture, GestureType } from "react-native-gesture-handler";
import { useSharedValue, runOnJS } from "react-native-reanimated";
import { SwipeDirection, SwipeInfo } from "../types";

interface Props {
  setSwipeInfo: React.Dispatch<React.SetStateAction<SwipeInfo>>;
  panGestureRef: React.MutableRefObject<GestureType>;
}

type SwipeGesture = {
  beginX: number;
  x: number;
  y: number;
  endX: number;
  swipeDirection: SwipeDirection;
};

export const getSwipeMonthGesture = ({ setSwipeInfo, panGestureRef }: Props) => {
  const swipeGesture = useSharedValue<SwipeGesture>({
    beginX: 0,
    x: 0,
    y: 0,
    endX: 0,
    swipeDirection: "none",
  });

  const updateSwipeInfo = (dir: SwipeDirection) => {
    setSwipeInfo({ direction: dir, id: Date.now() });
  };

  return (
    Gesture.Pan()
      .manualActivation(true)
      .onBegin(e => {
        swipeGesture.value.beginX = e.absoluteX;
        swipeGesture.value.x = e.x;
        swipeGesture.value.y = e.y;
      })
      // https://github.com/software-mansion/react-native-gesture-handler/issues/1933#issuecomment-1591250162
      .onTouchesMove((evt, state) => {
        if (!swipeGesture.value.x || !evt.changedTouches.length) {
          state.fail();
          return;
        }

        const xDiff = Math.abs(evt.changedTouches[0].x - swipeGesture.value.x);
        const yDiff = Math.abs(evt.changedTouches[0].y - swipeGesture.value.y);
        const isHorizontalPanning = xDiff > yDiff;

        if (isHorizontalPanning) {
          state.activate();
        } else {
          state.fail();
        }
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
      })
      .withRef(panGestureRef)
  );
};
