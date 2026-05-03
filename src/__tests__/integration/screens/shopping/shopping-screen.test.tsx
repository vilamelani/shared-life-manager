import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { ShoppingScreen } from "@/src/screens/shopping/shopping-screen";
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

describe("ShoppingScreen", () => {
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

  it("creates a shopping item from form", async () => {
    (shoppingService.createShoppingItem as jest.Mock).mockResolvedValue({
      id: "s1",
      householdId: "h1",
      name: "Milk",
      quantity: 2,
      addedByUserId: "u1",
      isCompleted: false,
      createdAt: "2026-01-01",
    });

    const { getByTestId } = render(<ShoppingScreen />);

    fireEvent.changeText(getByTestId("shopping-name-input"), "Milk");
    fireEvent.changeText(getByTestId("shopping-quantity-input"), "2");
    fireEvent.press(getByTestId("shopping-submit-button"));

    await waitFor(() =>
      expect(shoppingService.createShoppingItem).toHaveBeenCalledWith({
        householdId: "h1",
        name: "Milk",
        quantity: 2,
        addedByUserId: "u1",
      }),
    );
  });
});
