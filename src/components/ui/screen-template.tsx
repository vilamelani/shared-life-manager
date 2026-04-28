import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";

type ScreenTemplateProps = {
  title: string;
  description: string;
};

export function ScreenTemplate({ title, description }: ScreenTemplateProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">{title}</ThemedText>
        <ThemedText>{description}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  header: {
    gap: 10,
  },
});
