import { Modal, Pressable, View, Button } from "react-native";
import { P } from "../../P";
import { useModal } from "../../../hooks/ModalContext";
import { SelectEvent } from "../../../db/types";
import { format } from "date-fns";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import clsx from "clsx";

interface Props {
  selectedEvent: SelectEvent | null;
}

export const EditEventModal = ({ selectedEvent }: Props) => {
  const { isEditEventModalVisible, setIsEditEventModalVisible } = useModal();

  if (!selectedEvent) {
    return <></>;
  }

  const { start, title, color, locked } = selectedEvent;

  return (
    <Modal
      visible={isEditEventModalVisible}
      onRequestClose={() => setIsEditEventModalVisible(false)}
      transparent
      animationType="slide"
    >
      <Pressable
        onPress={() => setIsEditEventModalVisible(false)}
        className="absolute top-0 left-0 w-full h-full bg-neutral-950 opacity-80"
      />
      {/* <View className="items-center justify-center p-5 mx-2 mt-auto mb-auto rounded-md bg-modal">
        <P>{selectedEvent?.title}</P>
        <P>{selectedEvent?.id}</P>
        <Button title="Close" onPress={() => setIsEditEventModalVisible(false)} />
      </View> */}
      <View className="p-8 mx-2 my-auto rounded-3xl bg-modal">
        <View className="mb-8">
          <P className="text-lg" fontFamily="Rubik-Medium">
            {format(start, "dd-MM-yyyy")}
          </P>
        </View>
        <View className="flex items-center">
          <P className="text-3xl" fontFamily="Rubik-Medium">
            {title}
          </P>
        </View>
        <View className="flex-row justify-around mt-16">
          <FontAwesome name="trash" size={24} color="red" className="" />
          <FontAwesome name="unlock-alt" size={24} color="white" className="" />
          <Pressable className={clsx("rounded-full size-7")} style={{ backgroundColor: color }} />
        </View>
      </View>
    </Modal>
  );
};
