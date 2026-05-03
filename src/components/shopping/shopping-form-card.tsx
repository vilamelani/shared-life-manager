import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/src/components/themed-text";

type ShoppingFormCardProps = {
  name: string;
  quantityInput: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  onNameChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onSubmit: () => Promise<void>;
};

export function ShoppingFormCard({
  name,
  quantityInput,
  isSubmitting,
  errorMessage,
  onNameChange,
  onQuantityChange,
  onSubmit,
}: ShoppingFormCardProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Add shopping item</ThemedText>
      <TextInput
        placeholder="Item name"
        testID="shopping-name-input"
        value={name}
        onChangeText={onNameChange}
        style={styles.input}
      />
      <TextInput
        keyboardType="number-pad"
        placeholder="Quantity"
        testID="shopping-quantity-input"
        value={quantityInput}
        onChangeText={onQuantityChange}
        style={styles.input}
      />
      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
      <Pressable
        accessibilityRole="button"
        testID="shopping-submit-button"
        onPress={onSubmit}
        disabled={isSubmitting}
        style={[styles.submitButton, isSubmitting ? styles.submitButtonDisabled : null]}
      >
        <ThemedText style={styles.submitLabel}>
          {isSubmitting ? "Saving..." : "Add item"}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#C7C7CC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  submitButton: {
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#0A84FF",
    paddingVertical: 12,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  error: {
    color: "#D70015",
  },
});
