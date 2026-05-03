import { supabase } from "@/src/services/supabase";
import type { CreateShoppingItemInput, ShoppingItem } from "@/src/types/shopping";

const mapShoppingItemRow = (row: {
  id: string;
  household_id: string;
  name: string;
  quantity: number;
  added_by_user_id: string;
  is_completed: boolean;
  created_at: string;
}): ShoppingItem => {
  return {
    id: row.id,
    householdId: row.household_id,
    name: row.name,
    quantity: row.quantity,
    addedByUserId: row.added_by_user_id,
    isCompleted: row.is_completed,
    createdAt: row.created_at,
  };
};

const listHouseholdShoppingItems = async (householdId: string): Promise<ShoppingItem[]> => {
  const { data, error } = await supabase
    .from("shopping_items")
    .select("*")
    .eq("household_id", householdId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapShoppingItemRow);
};

const createShoppingItem = async ({
  householdId,
  name,
  quantity,
  addedByUserId,
}: CreateShoppingItemInput): Promise<ShoppingItem> => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Item name is required.");
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }

  const { data, error } = await supabase
    .from("shopping_items")
    .insert({
      household_id: householdId,
      name: trimmedName,
      quantity,
      added_by_user_id: addedByUserId,
    })
    .select()
    .single();

  if (error || !data) {
    throw error ?? new Error("Unable to create shopping item.");
  }

  return mapShoppingItemRow(data);
};

const toggleShoppingItemCompletion = async (
  itemId: string,
  isCompleted: boolean,
): Promise<void> => {
  const { error } = await supabase
    .from("shopping_items")
    .update({ is_completed: isCompleted })
    .eq("id", itemId);

  if (error) {
    throw error;
  }
};

const deleteShoppingItem = async (itemId: string): Promise<void> => {
  const { error } = await supabase.from("shopping_items").delete().eq("id", itemId);

  if (error) {
    throw error;
  }
};

const subscribeToHouseholdShoppingItems = (
  householdId: string,
  onChange: () => Promise<void> | void,
) => {
  const channel = supabase
    .channel(`shopping:${householdId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "shopping_items",
        filter: `household_id=eq.${householdId}`,
      },
      () => {
        void onChange();
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
};

export const shoppingService = {
  listHouseholdShoppingItems,
  createShoppingItem,
  toggleShoppingItemCompletion,
  deleteShoppingItem,
  subscribeToHouseholdShoppingItems,
};
