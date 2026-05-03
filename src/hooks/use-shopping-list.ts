import { useCallback, useEffect, useState } from "react";

import { shoppingService } from "@/src/services/shopping/shopping-service";
import { useAuthStore } from "@/src/store/auth-store";
import type { ShoppingItem } from "@/src/types/shopping";

type UseShoppingListResult = {
  items: ShoppingItem[];
  name: string;
  quantityInput: string;
  isLoading: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  setName: (value: string) => void;
  setQuantityInput: (value: string) => void;
  submitItem: () => Promise<void>;
  toggleItem: (itemId: string, nextValue: boolean) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
};

export const useShoppingList = (): UseShoppingListResult => {
  const activeHouseholdId = useAuthStore((state) => state.activeHouseholdId);
  const user = useAuthStore((state) => state.user);

  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [name, setName] = useState("");
  const [quantityInput, setQuantityInput] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reloadItems = useCallback(async () => {
    if (!activeHouseholdId) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextItems = await shoppingService.listHouseholdShoppingItems(activeHouseholdId);
      setItems(nextItems);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load shopping items. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeHouseholdId]);

  useEffect(() => {
    void reloadItems();
  }, [reloadItems]);

  useEffect(() => {
    if (!activeHouseholdId) {
      return;
    }

    const unsubscribe = shoppingService.subscribeToHouseholdShoppingItems(
      activeHouseholdId,
      reloadItems,
    );

    return unsubscribe;
  }, [activeHouseholdId, reloadItems]);

  const submitItem = async () => {
    if (!activeHouseholdId) {
      setErrorMessage("Select a household before adding shopping items.");
      return;
    }

    if (!user?.id) {
      setErrorMessage("You must be logged in to add shopping items.");
      return;
    }

    const parsedQuantity = Number(quantityInput);

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await shoppingService.createShoppingItem({
        householdId: activeHouseholdId,
        name,
        quantity: parsedQuantity,
        addedByUserId: user.id,
      });
      setName("");
      setQuantityInput("1");
      await reloadItems();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create shopping item. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleItem = async (itemId: string, nextValue: boolean) => {
    try {
      await shoppingService.toggleShoppingItemCompletion(itemId, nextValue);
      await reloadItems();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update item status. Please try again.",
      );
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await shoppingService.deleteShoppingItem(itemId);
      await reloadItems();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete item. Please try again.",
      );
    }
  };

  return {
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
  };
};
