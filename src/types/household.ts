export type Household = {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  createdAt: string;
};

export type HouseholdMembership = {
  id: string;
  householdId: string;
  userId: string;
  role: "owner" | "member";
  joinedAt: string;
};

export type CreateHouseholdInput = {
  name: string;
  userId: string;
};

export type JoinHouseholdInput = {
  inviteCode: string;
  userId: string;
};
