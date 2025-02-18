import { supabase } from "./supabase";

export interface User {
  id: string;
  email: string;
  role: "admin" | "accountant" | "support" | "user";
}

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { user: null, error };
  return { user: data.user as User, error: null };
};

export const signInWithOAuth = async (
  provider: "google" | "github" | "linkedin",
) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
  });

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async (): Promise<User | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user as User;
};
