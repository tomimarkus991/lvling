import React, { createContext, useContext, useState, ReactNode } from "react";
import { SelectEvent } from "../db/types";

type ContextType = {
  events: SelectEvent[];
  setEvents: React.Dispatch<React.SetStateAction<SelectEvent[]>>;
};

const Context = createContext<ContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<SelectEvent[]>([]);

  return (
    <Context.Provider
      value={{
        events,
        setEvents,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useEvent must be used within a EventProvider");
  }
  return context;
};
