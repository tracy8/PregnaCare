import { supabase } from "./supabase";
import type { Prediction, Profile, Reading, ReadingInput } from "./types";

// RLS sets the owner automatically? No — we pass user_id explicitly and the
// policy verifies it equals auth.uid(). So we read the current user first.
async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

// Save one risk check (inputs + the model's result) to history.
export async function saveReading(input: ReadingInput, result: Prediction) {
  const user_id = await currentUserId();
  const { error } = await supabase.from("readings").insert({
    user_id,
    ...input,
    risk_level: result.risk_level,
    confidence: result.confidence,
    factors: result.top_factors,
  });
  if (error) throw error;

  // Keep the profile's headline risk_level in step with the latest check.
  await supabase.from("profiles").update({ risk_level: result.risk_level }).eq("id", user_id);
}

export async function getReadings(limit = 20): Promise<Reading[]> {
  const { data, error } = await supabase
    .from("readings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Reading[];
}

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").single();
  if (error) {
    if (error.code === "PGRST116") return null; // no row yet
    throw error;
  }
  return data as Profile;
}

export async function updateProfile(patch: Partial<Profile>) {
  const user_id = await currentUserId();
  const { error } = await supabase.from("profiles").update(patch).eq("id", user_id);
  if (error) throw error;
}
