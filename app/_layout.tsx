import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { add, setDefaultOptions, sub } from "date-fns";
import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../src/drizzle/migrations";
import { eventsTable } from "../src/db/schema";

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
      await db.delete(eventsTable);
      await db.insert(eventsTable).values([
        {
          color: "#1e3a8a",
          locked: false,
          title: "Push",
          start: new Date(),
          end: add(new Date(), { hours: 2 }),
        },
        {
          color: "#14532d",
          locked: false,
          title: "Rest",
          start: add(new Date(), { hours: 1 }),
          end: add(new Date(), { hours: 3 }),
        },
        {
          color: "#d6470e",
          locked: false,
          title: "Pull",
          start: add(new Date(), { days: 1 }),
          end: add(new Date(), { days: 1, hours: 2 }),
        },
        {
          color: "#1e3a8a",
          locked: false,
          title: "Push2",
          start: sub(new Date(), { months: 2 }),
          end: add(sub(new Date(), { months: 2 }), { hours: 2 }),
        },
      ]);
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
      <Stack>
        <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
