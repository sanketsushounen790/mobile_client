import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

import { ReaderProvider } from "@epubjs-react-native/core";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ReaderProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="book/[id]"
            options={{
              headerShown: false,
              headerTitle: "Book Reader",
            }}
          />
          <Stack.Screen
            name="book-detail/[id]"
            options={{
              headerShown: true,
              headerTitle: "Book Detail",
            }}
          />
          <Stack.Screen
            name="search/index"
            options={{
              headerShown: true,
              headerTitle: "Camera Search",
            }}
          />
          <Stack.Screen
            name="explore/index"
            options={{
              headerShown: true,
              headerTitle: "Explore",
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </ReaderProvider>
  );
}
