import { streamText, Output } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const TaskSectionSchema = z.object({
  title: z.string().describe("Section title"),
  content: z.string().describe("Detailed content for this section in markdown format"),
  orderIndex: z.number().describe("Order of this section (0-based)")
})

const TaskOutputSchema = z.object({
  title: z.string().describe("Task title"),
  description: z.string().describe("Brief task description"),
  category: z.enum(["development", "design", "writing", "analysis", "research", "other"]).describe("Task category"),
  difficulty: z.enum(["junior", "middle", "senior", "lead"]).describe("Difficulty level"),
  estimatedTime: z.string().describe("Estimated completion time (e.g., '2-3 hours', '1 day')"),
  sections: z.array(TaskSectionSchema).describe("Task sections with detailed content")
})

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const { prompt, category, difficulty, taskType } = body

  const systemPrompt = `You are an expert task generator for talent assessment. 
Create comprehensive, professional tasks that evaluate candidates' skills effectively.

Guidelines:
- Tasks should be practical and relevant to real-world scenarios
- Include clear objectives and deliverables
- Provide context and background information
- Specify evaluation criteria
- Include constraints and requirements
- Make the task challenging but achievable within the estimated time

Structure each task with these sections:
1. Overview - Brief introduction and context
2. Objectives - Clear goals and deliverables
3. Requirements - Technical/skill requirements
4. Specifications - Detailed specifications and constraints
5. Evaluation Criteria - How the submission will be assessed
6. Resources - Any helpful resources or references (optional)`

  const userPrompt = `Generate a ${difficulty || "middle"} level ${category || "development"} task.
${taskType ? `Task type: ${taskType}` : ""}
${prompt ? `Additional requirements: ${prompt}` : ""}

Create a comprehensive task with all necessary details for a candidate to complete it successfully.`

  const result = streamText({
    model: "openai/gpt-4o",
    system: systemPrompt,
    prompt: userPrompt,
    output: Output.object({ schema: TaskOutputSchema }),
  })

  return result.toUIMessageStreamResponse()
}
