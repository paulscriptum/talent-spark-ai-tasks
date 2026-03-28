import { createClient } from "@/lib/supabase/client";
import type {
  Task,
  BrandDefinition,
  TaskResponse,
  AiAnalysis,
  DashboardStats,
  TaskSection,
  FileAttachment,
} from "@/types";

// ─── helpers ────────────────────────────────────────────────────────────────

/** Convert a Supabase row to the Task shape used in the UI */
function rowToTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    description: row.description as string,
    status: (row.status as string) === "completed" ? "completed" : "active",
    createdAt: row.created_at as string,
    deadline: row.due_date as string | undefined,
    brandDefinition: row.ai_suggestions as BrandDefinition,
    responses: (row.recurrence_pattern as TaskResponse[]) || [],
    sections: (row.context as unknown as TaskSection[]) || [],
  };
}

// ─── AI helpers (server-side via API routes) ─────────────────────────────────

async function callAI(endpoint: string, body: object) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

// ─── task service ────────────────────────────────────────────────────────────

export const taskService = {
  /** Create a new task via the AI API route then persist to Supabase */
  generateTask: async (brandDef: BrandDefinition): Promise<Task> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Call server-side AI route
    const generated = await callAI("/api/ai/generate-task", { brandDef });

    // Persist to Supabase
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        title: generated.title,
        description: generated.description,
        status: "pending",
        priority: "medium",
        ai_generated: true,
        due_date: generated.deadline,
        ai_suggestions: brandDef,           // store full brand def
        recurrence_pattern: [],             // responses array (repurposed)
        context: JSON.stringify(generated.sections ?? []), // sections
        tags: [],
      })
      .select()
      .single();

    if (error) throw error;
    return rowToTask(data);
  },

  /** Get all tasks for the current user */
  getAllTasks: async (): Promise<Task[]> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(rowToTask);
  },

  /** Get a single task by id (for authenticated users) */
  getTaskById: async (taskId: string): Promise<Task | null> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (error) return null;
    return rowToTask(data);
  },

  /** Get a task for public candidate view (no auth required) */
  getTaskByIdForCandidate: async (taskId: string): Promise<Task | null> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (error) return null;
    return rowToTask(data);
  },

  /** Submit a candidate response and trigger AI analysis */
  submitResponse: async (
    taskId: string,
    response: Omit<TaskResponse, "id" | "submittedAt" | "aiAnalysis">
  ): Promise<TaskResponse> => {
    const supabase = createClient();

    // Get current task
    const { data: taskRow, error: fetchErr } = await supabase
      .from("tasks")
      .select("recurrence_pattern, ai_suggestions, title, description, context")
      .eq("id", taskId)
      .single();

    if (fetchErr) throw fetchErr;

    const task = rowToTask(taskRow);

    // Run AI analysis
    let aiAnalysis: AiAnalysis | undefined;
    try {
      aiAnalysis = await callAI("/api/ai/analyze-response", {
        task,
        response,
      });
    } catch (e) {
      console.error("AI analysis failed:", e);
    }

    const newResponse: TaskResponse = {
      id: crypto.randomUUID(),
      ...response,
      submittedAt: new Date().toISOString(),
      aiAnalysis,
    };

    const existingResponses: TaskResponse[] = taskRow.recurrence_pattern ?? [];
    const updatedResponses = [...existingResponses, newResponse];

    const { error: updateErr } = await supabase
      .from("tasks")
      .update({ recurrence_pattern: updatedResponses })
      .eq("id", taskId);

    if (updateErr) throw updateErr;
    return newResponse;
  },

  /** Get dashboard stats for current user */
  getDashboardStats: async (): Promise<DashboardStats> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("tasks")
      .select("status, recurrence_pattern")
      .eq("user_id", user.id);

    if (error) throw error;

    const tasks = data ?? [];
    const activeTasks = tasks.filter((t) => t.status !== "completed").length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const allResponses: TaskResponse[] = tasks.flatMap(
      (t) => (t.recurrence_pattern as TaskResponse[]) ?? []
    );
    const totalCandidates = allResponses.length;
    const scores = allResponses
      .map((r) => r.aiAnalysis?.overallScore)
      .filter((s): s is number => typeof s === "number");
    const averageScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    return { activeTasks, completedTasks, totalCandidates, averageScore };
  },

  /** Update a task section's content */
  updateTaskSection: async (
    taskId: string,
    sectionId: string,
    content: string
  ): Promise<void> => {
    const supabase = createClient();
    const { data: taskRow } = await supabase
      .from("tasks")
      .select("context")
      .eq("id", taskId)
      .single();

    if (!taskRow) throw new Error("Task not found");

    const sections: TaskSection[] = JSON.parse(taskRow.context ?? "[]");
    const updated = sections.map((s) =>
      s.id === sectionId ? { ...s, content } : s
    );

    const { error } = await supabase
      .from("tasks")
      .update({ context: JSON.stringify(updated) })
      .eq("id", taskId);

    if (error) throw error;
  },

  /** Update a task's description */
  updateTaskDescription: async (
    taskId: string,
    description: string
  ): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase
      .from("tasks")
      .update({ description })
      .eq("id", taskId);
    if (error) throw error;
  },

  /** Update task attachments stored inside brand definition */
  updateTaskAttachments: async (
    taskId: string,
    attachments: FileAttachment[]
  ): Promise<void> => {
    const supabase = createClient();
    const { data: taskRow } = await supabase
      .from("tasks")
      .select("ai_suggestions")
      .eq("id", taskId)
      .single();

    if (!taskRow) throw new Error("Task not found");

    const brandDef = (taskRow.ai_suggestions as BrandDefinition) ?? {};
    brandDef.attachments = attachments;

    const { error } = await supabase
      .from("tasks")
      .update({ ai_suggestions: brandDef })
      .eq("id", taskId);
    if (error) throw error;
  },

  /** Regenerate a section's content using AI */
  generateSectionContentWithAI: async (
    taskId: string,
    sectionId: string
  ): Promise<TaskSection | null> => {
    const supabase = createClient();
    const { data: taskRow } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (!taskRow) return null;
    const task = rowToTask(taskRow);
    const section = task.sections?.find((s) => s.id === sectionId);
    if (!section) return null;

    const newContent = await callAI("/api/ai/generate-section", {
      task,
      sectionType: section.type,
    });

    await taskService.updateTaskSection(taskId, sectionId, newContent.content);

    return { ...section, content: newContent.content };
  },
};
