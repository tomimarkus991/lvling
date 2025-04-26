import React, { createContext, useContext, useState, ReactNode } from "react";
import { SelectEvent } from "../db/types";

type ContextType = {
  events: Map<string, SelectEvent[]>;
  setEvents: React.Dispatch<React.SetStateAction<Map<string, SelectEvent[]>>>;
};

const Context = createContext<ContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Map<string, SelectEvent[]>>(new Map());

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
