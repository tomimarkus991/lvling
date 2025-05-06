import { Modal, Pressable, View } from "react-native";
import { colors } from "../../config";
import { useModal } from "../../hooks/ModalContext";
import { useSelect } from "../../hooks/SelectContext";
import { eq } from "drizzle-orm";
import { db } from "../../../app/_layout";
import { eventsTable } from "../../db/schema";

interface Props {
  id?: number;
}

export const ColorPicker = ({ id }: Props) => {
  const { isColorPickerModalVisible, setIsColorPickerModalVisible } = useModal();
  const {
    setSelectedColor,
    setSelectedPreset,
    selectedPreset,
    setCustomEventSelectedColor,
    setEditModalSelectedColor,
  } = useSelect();

  const closeModal = () => {
    setSelectedPreset(null);
    setIsColorPickerModalVisible(false);
    setEditModalSelectedColor(null);
  };
  return (
    <Modal
      visible={isColorPickerModalVisible}
      onRequestClose={closeModal}
      transparent
      animationType="slide"
    >
      <Pressable
        onPress={closeModal}
        className="absolute top-0 left-0 w-full h-full bg-neutral-950 opacity-30"
      />
      <View className="p-4 mx-auto my-auto rounded-3xl bg-modal max-w-32">
        <View className="flex-row flex-wrap gap-2 max-w-32">
          {Object.values(colors.events).map(color => {
            return (
              <Pressable
                key={color}
                className="mx-auto rounded-full size-10"
                style={{ backgroundColor: color }}
                onPress={async () => {
                  if (id) {
                    setEditModalSelectedColor(color);

                    await db
                      .update(eventsTable)
                      .set({
                        color,
                      })
                      .where(eq(eventsTable.id, id));
                  } else {
                    if (selectedPreset) {
                      setSelectedColor(color);
                    } else {
                      setCustomEventSelectedColor(color);
                    }
                  }

                  setIsColorPickerModalVisible(false);
                }}
              />
            );
          })}
        </View>
      </View>
    </Modal>
  );
};
