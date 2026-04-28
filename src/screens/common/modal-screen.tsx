import { Link } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";

export function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Shared Life Manager</ThemedText>
      <ThemedText>
        This space will host global actions and contextual information as the app
        grows.
      </ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Back to home</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 12,
  },
  link: {
    marginTop: 10,
    paddingVertical: 8,
  },
});
