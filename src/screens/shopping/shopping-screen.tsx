import { ShoppingFormCard } from "@/src/components/shopping/shopping-form-card";
import { ShoppingItemsList } from "@/src/components/shopping/shopping-items-list";
import { ScreenTemplate } from "@/src/components/ui/screen-template";
import { ThemedText } from "@/src/components/themed-text";
import { useShoppingList } from "@/src/hooks/use-shopping-list";
import { useAuthStore } from "@/src/store/auth-store";

export function ShoppingScreen() {
  const activeHouseholdId = useAuthStore((state) => state.activeHouseholdId);
  const households = useAuthStore((state) => state.households);
  const {
    items,
    name,
    quantityInput,
    isLoading,
    isSubmitting,
    errorMessage,
    setName,
    setQuantityInput,
    submitItem,
    toggleItem,
    removeItem,
  } = useShoppingList();

  const activeHousehold = households.find(
    (household) => household.id === activeHouseholdId,
  );

  return (
    <ScreenTemplate
      title="Shopping List"
      description="Keep your shared shopping list synced in real time."
    >
      {!activeHousehold ? (
        <ThemedText>Create or select a household in Home before adding items.</ThemedText>
      ) : (
        <ThemedText testID="shopping-active-household">
          Household: {activeHousehold.name}
        </ThemedText>
      )}
      <ShoppingFormCard
        name={name}
        quantityInput={quantityInput}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onNameChange={setName}
        onQuantityChange={setQuantityInput}
        onSubmit={submitItem}
      />
      <ShoppingItemsList
        items={items}
        isLoading={isLoading}
        onToggleItem={toggleItem}
        onRemoveItem={removeItem}
      />
    </ScreenTemplate>
  );
}
