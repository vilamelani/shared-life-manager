import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useShoppingList } from "@/src/hooks/use-shopping-list";
import { shoppingService } from "@/src/services/shopping/shopping-service";
import { authStore } from "@/src/store/auth-store";

jest.mock("@/src/services/shopping/shopping-service", () => ({
  shoppingService: {
    listHouseholdShoppingItems: jest.fn(),
    createShoppingItem: jest.fn(),
    toggleShoppingItemCompletion: jest.fn(),
    deleteShoppingItem: jest.fn(),
    subscribeToHouseholdShoppingItems: jest.fn(),
  },
}));

describe("useShoppingList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authStore.resetForTests();
    authStore.setSession({
      user: {
        id: "u1",
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
      },
    } as never);
    authStore.setHouseholds([
      {
        id: "h1",
        name: "Family",
        inviteCode: "ABC123",
        createdBy: "u1",
        createdAt: "2026-01-01",
      },
    ]);

    (shoppingService.listHouseholdShoppingItems as jest.Mock).mockResolvedValue([]);
    (shoppingService.subscribeToHouseholdShoppingItems as jest.Mock).mockReturnValue(
      jest.fn(),
    );
  });

  it("loads shopping items for active household", async () => {
    renderHook(() => useShoppingList());

    await waitFor(() =>
      expect(shoppingService.listHouseholdShoppingItems).toHaveBeenCalledWith("h1"),
    );
  });

  it("submits shopping item", async () => {
    (shoppingService.createShoppingItem as jest.Mock).mockResolvedValue({
      id: "s1",
      householdId: "h1",
      name: "Milk",
      quantity: 2,
      addedByUserId: "u1",
      isCompleted: false,
      createdAt: "2026-01-01",
    });

    const { result } = renderHook(() => useShoppingList());

    act(() => {
      result.current.setName("Milk");
      result.current.setQuantityInput("2");
    });

    await act(async () => {
      await result.current.submitItem();
    });

    expect(shoppingService.createShoppingItem).toHaveBeenCalledWith({
      householdId: "h1",
      name: "Milk",
      quantity: 2,
      addedByUserId: "u1",
    });
  });
});
