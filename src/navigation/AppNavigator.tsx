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
  isAuthenticated: boolean;
};

const resolveTheme = (colorScheme: ColorSchemeName): Theme => {
  return colorScheme === "dark" ? DarkTheme : DefaultTheme;
};

export function AppNavigator({ colorScheme, isAuthenticated }: AppNavigatorProps) {
  return (
    <ThemeProvider value={resolveTheme(colorScheme)}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
          redirect={!isAuthenticated}
        />
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
          redirect={isAuthenticated}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "About Shared Life Manager" }}
          redirect={!isAuthenticated}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
