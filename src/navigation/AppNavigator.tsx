import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  type Theme,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { ColorSchemeName } from "react-native";

type AppNavigatorProps = {
  colorScheme: ColorSchemeName;
};

const resolveTheme = (colorScheme: ColorSchemeName): Theme => {
  return colorScheme === "dark" ? DarkTheme : DefaultTheme;
};

export function AppNavigator({ colorScheme }: AppNavigatorProps) {
  return (
    <ThemeProvider value={resolveTheme(colorScheme)}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "About Shared Life Manager" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
