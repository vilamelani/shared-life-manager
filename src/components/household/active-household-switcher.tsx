import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import type { Household } from "@/src/types/household";

type ActiveHouseholdSwitcherProps = {
  households: Household[];
  activeHouseholdId: string | null;
  onSelectHousehold: (householdId: string) => void;
};

export function ActiveHouseholdSwitcher({
  households,
  activeHouseholdId,
  onSelectHousehold,
}: ActiveHouseholdSwitcherProps) {
  if (households.length <= 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Switch household</ThemedText>
      <View style={styles.options}>
        {households.map((household) => (
          <Pressable
            key={household.id}
            accessibilityRole="button"
            testID={`household-option-${household.id}`}
            style={[
              styles.option,
              household.id === activeHouseholdId ? styles.optionActive : null,
            ]}
            onPress={() => onSelectHousehold(household.id)}
          >
            <ThemedText>{household.name}</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    gap: 8,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: "#C7C7CC",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  optionActive: {
    borderColor: "#0A84FF",
    backgroundColor: "#EAF3FF",
  },
});
