import { streamText } from "ai"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const { content, action, context } = body

  let systemPrompt = "You are an expert content editor and writer."
  let userPrompt = ""

  switch (action) {
    case "improve":
      systemPrompt += " Your task is to improve the given content while maintaining its core message."
      userPrompt = `Improve the following content, making it clearer, more professional, and better structured:\n\n${content}`
      break
    case "expand":
      systemPrompt += " Your task is to expand and add more detail to the given content."
      userPrompt = `Expand the following content with more details, examples, and explanations:\n\n${content}`
      break
    case "simplify":
      systemPrompt += " Your task is to simplify the given content while keeping essential information."
      userPrompt = `Simplify the following content, making it more concise and easier to understand:\n\n${content}`
      break
    case "grammar":
      systemPrompt += " Your task is to fix grammar, spelling, and punctuation errors."
      userPrompt = `Fix any grammar, spelling, or punctuation errors in the following content:\n\n${content}`
      break
    case "format":
      systemPrompt += " Your task is to improve the formatting and structure of the content."
      userPrompt = `Improve the formatting and structure of the following content using markdown:\n\n${content}`
      break
    default:
      userPrompt = `${action}: ${content}`
  }

  if (context) {
    userPrompt += `\n\nContext: ${context}`
  }

  const result = streamText({
    model: "openai/gpt-4o",
    system: systemPrompt,
    prompt: userPrompt,
  })

  return result.toUIMessageStreamResponse()
}
