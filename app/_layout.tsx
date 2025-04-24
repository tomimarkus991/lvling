import { setDefaultOptions } from "date-fns";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SQLite from "expo-sqlite";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";
import migrations from "../src/drizzle/migrations";
import { ModalProvider } from "../src/hooks/ModalContext";
import { presetsTable } from "../src/db/schema";
import { EventProvider } from "../src/hooks/EventContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const expo = SQLite.openDatabaseSync("../src/db/db.db");

export const db = drizzle(expo);

export default function RootLayout() {
  const { success } = useMigrations(db, migrations);

  useEffect(() => {
    if (!success) return;
    (async () => {
      const existing = await db.select().from(presetsTable).limit(1);

      if (!existing) {
        await db.insert(presetsTable).values([
          { id: 1, title: "Push", color: "#312E81", locked: false },
          { id: 2, title: "Pull", color: "#BE6404", locked: false },
          { id: 3, title: "Legs", color: "#1e3a8a", locked: false },
          { id: 4, title: "Rest", color: "#14532D", locked: false },
          { id: 5, title: "", color: "#EAB308", locked: false },
          { id: 6, title: "", color: "#9A0F0F", locked: false },
        ]);
      }
    })();
  }, [success]);

  const [loaded, error] = useFonts({
    "Rubik-Black": require("../assets/fonts/Rubik-Black.ttf"),
    "Rubik-BlackItalic": require("../assets/fonts/Rubik-BlackItalic.ttf"),
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-BoldItalic": require("../assets/fonts/Rubik-BoldItalic.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-ExtraBoldItalic": require("../assets/fonts/Rubik-ExtraBoldItalic.ttf"),
    "Rubik-Italic": require("../assets/fonts/Rubik-Italic.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-LightItalic": require("../assets/fonts/Rubik-LightItalic.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-MediumItalic": require("../assets/fonts/Rubik-MediumItalic.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
    "Rubik-SemiBoldItalic": require("../assets/fonts/Rubik-SemiBoldItalic.ttf"),
  });

  setDefaultOptions({
    weekStartsOn: 1,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <GestureHandlerRootView>
        <EventProvider>
          <ModalProvider>
            <Stack>
              <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
            </Stack>
          </ModalProvider>
        </EventProvider>
      </GestureHandlerRootView>
    </>
  );
}
