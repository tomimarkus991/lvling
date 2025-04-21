import { add, sub } from "date-fns";
import { useEffect } from "react";
import { SwipeInfo } from "../types";

interface Props {
  swipeInfo: SwipeInfo;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

export const useSwipeInfo = ({ setCurrentMonth, swipeInfo }: Props) => {
  useEffect(() => {
    if (swipeInfo.direction === "left") {
      setCurrentMonth(oldCurrentMonth => {
        console.log(oldCurrentMonth);

        return add(oldCurrentMonth, { months: 1 });
      });
    } else if (swipeInfo.direction === "right") {
      setCurrentMonth(oldCurrentMonth => sub(oldCurrentMonth, { months: 1 }));
    }
  }, [swipeInfo]);
};
