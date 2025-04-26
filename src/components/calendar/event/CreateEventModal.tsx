import FontAwesome from "@expo/vector-icons/FontAwesome";
import clsx from "clsx";
import { add, format } from "date-fns";
import { eq } from "drizzle-orm";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, TextInput, View } from "react-native";
import { db } from "../../../../app/_layout";
import { eventsTable, presetsTable } from "../../../db/schema";
import { SelectEvent, SelectPreset } from "../../../db/types";
import { useEvent } from "../../../hooks/EventContext";
import { useModal } from "../../../hooks/ModalContext";
import { P } from "../../P";

interface PresetInputProps {
  backgroundColor: string;
  id: number;
  title: string;
}

const PresetInput = ({ backgroundColor, id, title }: PresetInputProps) => {
  const { setIsCreateEventModalVisible, selectedDate } = useModal();
  const { setEvents } = useEvent();

  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(title);

  console.log(selectedDate);

  if (!selectedDate) {
    return <P>Need Start Date</P>;
  }

  const createEvent = async () => {
    if (!isEditing) {
      const utcStart = selectedDate.toISOString();
      const utcEnd = add(selectedDate, { hours: 2 }).toISOString();

      const newEvent = (await db
        .insert(eventsTable)
        .values({
          title,
          color: backgroundColor,
          start: utcStart,
          end: utcEnd,
          locked: false,
        })
        .returning()) satisfies SelectEvent[];

      setEvents(prevEvents => {
        const newEvents = new Map(prevEvents);

        const dayKey = format(newEvent[0].start, "dd-MM-yyyy");
        const existingEvents = newEvents.get(dayKey) || [];

        newEvents.set(dayKey, [...existingEvents, newEvent[0]]);

        return newEvents;
      });

      setIsCreateEventModalVisible(false);
    }
  };

  const handleEventNameInputChange = async () => {
    console.log("handleEventNameInputChange:", text, id);
    await db
      .update(presetsTable)
      .set({
        id,
        title: text,
        color: backgroundColor,
        locked: false,
      })
      .where(eq(presetsTable.id, id));
    setIsEditing(false);
  };

  return (
    <View className="border-[3px] border-white flex-row rounded-xl">
      <Pressable
        className="w-[63%] p-3"
        onLongPress={() => setIsEditing(true)}
        onPress={createEvent}
      >
        <TextInput
          className="w-[63%] text-white ml-2"
          autoCapitalize="words"
          style={{ fontFamily: "Rubik-Medium" }}
          cursorColor="#fff"
          value={text}
          onChangeText={setText}
          editable={isEditing}
          onSubmitEditing={handleEventNameInputChange}
          onBlur={handleEventNameInputChange}
        />
      </Pressable>

      <Pressable className={clsx("m-2 rounded-full size-7")} style={{ backgroundColor }} />
    </View>
  );
};

export const CreateEventModal = () => {
  const { isCreateEventModalVisible, setIsCreateEventModalVisible } = useModal();

  const [presets, setPresets] = useState<SelectPreset[]>([]);

  useEffect(() => {
    const getPresets = async () => {
      setPresets(await db.select().from(presetsTable));
    };

    getPresets();
  }, []);

  return (
    <Modal
      visible={isCreateEventModalVisible}
      onRequestClose={() => setIsCreateEventModalVisible(false)}
      transparent
      animationType="slide"
    >
      <Pressable
        onPress={() => setIsCreateEventModalVisible(false)}
        className="absolute top-0 left-0 w-full h-full bg-neutral-950 opacity-80"
      />
      <View className="p-8 mx-2 my-auto rounded-3xl bg-modal">
        <View className="flex-row">
          <View className="flex-col flex-1 gap-5 mr-5">
            {presets
              .filter(preset => preset.id <= 3)
              .map(preset => {
                return (
                  <PresetInput
                    key={preset.id}
                    backgroundColor={preset.color}
                    id={preset.id}
                    title={preset.title}
                  />
                );
              })}
          </View>

          <View className="flex-col flex-1 gap-5">
            {presets
              .filter(preset => preset.id >= 4)
              .map(preset => {
                return (
                  <PresetInput
                    key={preset.id}
                    backgroundColor={preset.color}
                    id={preset.id}
                    title={preset.title}
                  />
                );
              })}
          </View>
        </View>

        <View className="flex-row border-[3px] border-white rounded-xl mt-5">
          <TextInput
            className="w-[65%] text-white ml-2"
            placeholder="Title"
            placeholderTextColor="#9e9e9e"
            autoCapitalize="words"
            style={{ fontFamily: "Rubik-Medium" }}
            cursorColor="#fff"
          />
          <FontAwesome name="unlock-alt" size={24} color="white" className="p-2 ml-4 mr-2" />
          <Pressable className={clsx("m-2 rounded-full size-7", `bg-[#EAB308]`)} />
        </View>
      </View>
    </Modal>
  );
};
