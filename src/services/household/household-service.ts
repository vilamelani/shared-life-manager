import { supabase } from "@/src/services/supabase";
import type {
  CreateHouseholdInput,
  Household,
  JoinHouseholdInput,
} from "@/src/types/household";

const generateInviteCode = () => {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
};

const mapHouseholdRow = (row: {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
}): Household => {
  return {
    id: row.id,
    name: row.name,
    inviteCode: row.invite_code,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
};

const createHousehold = async ({
  name,
  userId,
}: CreateHouseholdInput): Promise<Household> => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Household name is required.");
  }

  const inviteCode = generateInviteCode();

  const { data: household, error: householdError } = await supabase
    .from("households")
    .insert({
      name: trimmedName,
      created_by: userId,
      invite_code: inviteCode,
    })
    .select()
    .single();

  if (householdError || !household) {
    throw householdError ?? new Error("Unable to create household.");
  }

  const { error: membershipError } = await supabase
    .from("household_memberships")
    .insert({
      household_id: household.id,
      user_id: userId,
      role: "owner",
    });

  if (membershipError) {
    throw membershipError;
  }

  return mapHouseholdRow(household);
};

const joinHouseholdByInviteCode = async ({
  inviteCode,
  userId,
}: JoinHouseholdInput): Promise<Household> => {
  const normalizedCode = inviteCode.trim().toUpperCase();
  if (!normalizedCode) {
    throw new Error("Invite code is required.");
  }

  const { data: household, error: householdError } = await supabase
    .from("households")
    .select("*")
    .eq("invite_code", normalizedCode)
    .maybeSingle();

  if (householdError) {
    throw householdError;
  }

  if (!household) {
    throw new Error("Invalid invite code.");
  }

  const { error: membershipError } = await supabase
    .from("household_memberships")
    .insert({
      household_id: household.id,
      user_id: userId,
      role: "member",
    });

  if (membershipError) {
    throw membershipError;
  }

  return mapHouseholdRow(household);
};

export const householdService = {
  createHousehold,
  joinHouseholdByInviteCode,
};
