import React, { createContext, useContext, useState, ReactNode } from "react";

type ModalContextType = {
  isEditEventModalVisible: boolean;
  setIsEditEventModalVisible: (visible: boolean) => void;
  isCreateEventModalVisible: boolean;
  setIsCreateEventModalVisible: (visible: boolean) => void;
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isEditEventModalVisible, setIsEditEventModalVisible] = useState(false);
  const [isCreateEventModalVisible, setIsCreateEventModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // const [selectedDates, setSelectedDates] = useState({
  //   start: "",
  //   end:""
  // })

  return (
    <ModalContext.Provider
      value={{
        isEditEventModalVisible,
        setIsEditEventModalVisible,
        isCreateEventModalVisible,
        setIsCreateEventModalVisible,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
