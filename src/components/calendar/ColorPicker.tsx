import { Modal, Pressable, View } from "react-native";
import { colors } from "../../config";
import { useModal } from "../../hooks/ModalContext";
import { useSelect } from "../../hooks/SelectContext";

interface Props {}
export const ColorPicker = ({}: Props) => {
  const { isColorPickerModalVisible, setIsColorPickerModalVisible } = useModal();
  const { setSelectedColor, setSelectedPreset, selectedPreset, setCustomEventSelectedColor } =
    useSelect();

  const closeModal = () => {
    setSelectedPreset(null);
    setIsColorPickerModalVisible(false);
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
                className="mx-auto bg-red-500 rounded-full size-10"
                style={{ backgroundColor: color }}
                onPress={() => {
                  console.log(selectedPreset);

                  if (selectedPreset) {
                    setSelectedColor(color);
                  } else {
                    setCustomEventSelectedColor(color);
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
