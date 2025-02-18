import { supabase } from "./supabase";

export interface WorkflowTrigger {
  id: string;
  type:
    | "churn_risk"
    | "payment_failed"
    | "subscription_renewal"
    | "usage_threshold";
  conditions: {
    metric: string;
    operator: ">" | "<" | "=" | "!=";
    value: number;
  }[];
}

export interface WorkflowAction {
  id: string;
  type: "send_email" | "send_notification" | "apply_discount" | "create_task";
  params: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  isActive: boolean;
}

export const createWorkflow = async (
  workflow: Omit<Workflow, "id">,
): Promise<Workflow> => {
  const { data, error } = await supabase
    .from("workflows")
    .insert([workflow])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const executeWorkflow = async (
  workflowId: string,
  context: Record<string, any>,
) => {
  return supabase.functions.invoke("execute-workflow", {
    body: { workflowId, context },
  });
};

export const getActiveWorkflows = async (): Promise<Workflow[]> => {
  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("isActive", true);

  if (error) throw error;
  return data;
};
