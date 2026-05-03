export type ShoppingItem = {
  id: string;
  householdId: string;
  name: string;
  quantity: number;
  addedByUserId: string;
  isCompleted: boolean;
  createdAt: string;
};

export type CreateShoppingItemInput = {
  householdId: string;
  name: string;
  quantity: number;
  addedByUserId: string;
};
