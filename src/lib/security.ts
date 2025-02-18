import { supabase } from "./supabase";

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  scopes: string[];
  expiresAt?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export const generateApiKey = async (
  name: string,
  scopes: string[],
): Promise<ApiKey> => {
  const { data, error } = await supabase.functions.invoke("generate-api-key", {
    body: { name, scopes },
  });

  if (error) throw error;
  return data;
};

export const logAuditEvent = async (
  event: Omit<AuditLog, "id" | "timestamp">,
) => {
  const { error } = await supabase
    .from("audit_logs")
    .insert([{ ...event, timestamp: new Date().toISOString() }]);

  if (error) throw error;
};

export const encryptSensitiveData = async (data: string): Promise<string> => {
  const { data: encrypted, error } = await supabase.functions.invoke(
    "encrypt-data",
    {
      body: { data },
    },
  );

  if (error) throw error;
  return encrypted;
};

export const validateGDPRConsent = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("user_consents")
    .select("hasConsented")
    .eq("userId", userId)
    .single();

  if (error) throw error;
  return data?.hasConsented || false;
};
