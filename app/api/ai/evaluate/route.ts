import { streamText, Output } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const EvaluationSchema = z.object({
  overallScore: z.number().min(0).max(100).describe("Overall score from 0-100"),
  strengths: z.array(z.string()).describe("List of strengths identified"),
  weaknesses: z.array(z.string()).describe("List of areas for improvement"),
  detailedFeedback: z.string().describe("Comprehensive feedback in markdown format"),
  recommendations: z.array(z.string()).describe("Specific recommendations for improvement"),
  skillAssessment: z.object({
    technicalSkills: z.number().min(0).max(100).nullable(),
    problemSolving: z.number().min(0).max(100).nullable(),
    codeQuality: z.number().min(0).max(100).nullable(),
    communication: z.number().min(0).max(100).nullable(),
    creativity: z.number().min(0).max(100).nullable(),
  }).describe("Assessment of specific skills")
})

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const { taskDescription, submission, evaluationCriteria } = body

  const systemPrompt = `You are an expert evaluator for talent assessment tasks.
Provide thorough, constructive, and fair evaluations of candidate submissions.

Your evaluation should:
- Be objective and based on the provided criteria
- Highlight both strengths and areas for improvement
- Provide actionable recommendations
- Be encouraging while maintaining high standards`

  const userPrompt = `Evaluate the following submission:

## Task Description
${taskDescription}

## Submission
${submission}

${evaluationCriteria ? `## Evaluation Criteria\n${evaluationCriteria}` : ""}

Provide a comprehensive evaluation with scores and detailed feedback.`

  const result = streamText({
    model: "openai/gpt-4o",
    system: systemPrompt,
    prompt: userPrompt,
    output: Output.object({ schema: EvaluationSchema }),
  })

  return result.toUIMessageStreamResponse()
}
