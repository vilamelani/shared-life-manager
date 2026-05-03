import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import type { ShoppingItem } from "@/src/types/shopping";

type ShoppingItemsListProps = {
  items: ShoppingItem[];
  isLoading: boolean;
  onToggleItem: (itemId: string, nextValue: boolean) => Promise<void>;
  onRemoveItem: (itemId: string) => Promise<void>;
};

export function ShoppingItemsList({
  items,
  isLoading,
  onToggleItem,
  onRemoveItem,
}: ShoppingItemsListProps) {
  if (isLoading) {
    return <ThemedText>Loading shopping items...</ThemedText>;
  }

  if (!items.length) {
    return <ThemedText>No shopping items yet for this household.</ThemedText>;
  }

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Shared shopping list</ThemedText>
      {items.map((item) => (
        <View key={item.id} style={styles.item}>
          <ThemedText testID={`shopping-item-${item.id}`}>
            {item.name} x{item.quantity}
          </ThemedText>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              testID={`shopping-toggle-${item.id}`}
              style={[styles.actionButton, item.isCompleted ? styles.completedButton : null]}
              onPress={() => onToggleItem(item.id, !item.isCompleted)}
            >
              <ThemedText>
                {item.isCompleted ? "Mark pending" : "Mark completed"}
              </ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              testID={`shopping-delete-${item.id}`}
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onRemoveItem(item.id)}
            >
              <ThemedText>Delete</ThemedText>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 10,
  },
  item: {
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: "#C7C7CC",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  completedButton: {
    borderColor: "#248A3D",
    backgroundColor: "#E9F7EC",
  },
  deleteButton: {
    borderColor: "#D70015",
    backgroundColor: "#FEECEC",
  },
});
