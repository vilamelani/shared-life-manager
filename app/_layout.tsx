import { AppNavigator } from "@/src/navigation/AppNavigator";
import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { useAuthSession } from "@/src/hooks/use-auth-session";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { StyleSheet } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { status, isAuthenticated } = useAuthSession();

  if (status === "loading") {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading session...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <AppNavigator colorScheme={colorScheme} isAuthenticated={isAuthenticated} />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
