import { Modal, Pressable, View, Button } from "react-native";
import { P } from "../../P";
import { useModal } from "../../../hooks/ModalContext";
import { SelectEvent } from "../../../db/types";

interface Props {
  selectedEvent: SelectEvent | null;
}

export const EditEventModal = ({ selectedEvent }: Props) => {
  const { isEditEventModalVisible, setIsEditEventModalVisible } = useModal();

  return (
    <Modal
      visible={isEditEventModalVisible}
      onRequestClose={() => setIsEditEventModalVisible(false)}
      transparent
    >
      <Pressable
        onPress={() => setIsEditEventModalVisible(false)}
        className="absolute top-0 left-0 w-full h-full bg-neutral-950 opacity-80"
      />
      <View className="items-center justify-center p-5 mx-2 mt-auto mb-auto rounded-md bg-modal">
        <P>{selectedEvent?.title}</P>
        <P>{selectedEvent?.id}</P>
        <Button title="Close" onPress={() => setIsEditEventModalVisible(false)} />
      </View>
    </Modal>
  );
};
