import { NextRequest, NextResponse } from "next/server";
import type { Task, TaskResponse } from "@/types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  const { task, response }: { task: Task; response: Omit<TaskResponse, "id" | "submittedAt" | "aiAnalysis"> } =
    await req.json();

  const wordCount = response.responseContent.trim().split(/\s+/).length;
  const attachments = response.attachments ?? [];

  const messages = [
    {
      role: "system",
      content: `You are a STRICT and THOROUGH expert evaluator for candidate assessment tasks.

SCORING GUIDELINES (BE STRICT BUT FAIR):
- 90-100: Exceptional, comprehensive, professional, exceeds expectations significantly
- 80-89: Very good, meets all requirements with strong execution and creativity
- 70-79: Good, meets most requirements adequately with some strengths
- 60-69: Acceptable, meets basic requirements but lacks depth
- 50-59: Below average, misses several requirements or shows poor execution
- 40-49: Poor, significant gaps, minimal effort
- Below 40: Unacceptable

Format your response as JSON:
{"overallScore": number, "strengths": ["str1","str2","str3"], "weaknesses": ["w1","w2","w3"], "fitToBrand": number, "creativityScore": number, "technicalAccuracy": number, "summary": "detailed summary"}`,
    },
    {
      role: "user",
      content: `TASK CONTEXT:
Title: ${task.title}
Description: ${task.description}

COMPANY:
Company: ${task.brandDefinition.companyName}
Industry: ${task.brandDefinition.industry}
Values: ${task.brandDefinition.companyValues.join(", ")}
Tone: ${task.brandDefinition.tone}
Role: ${task.brandDefinition.role} (${task.brandDefinition.level})

REQUIREMENTS:
${task.sections?.filter((s) => s.type === "requirements").map((s) => s.content).join("\n") || "None"}

DELIVERABLES:
${task.sections?.filter((s) => s.type === "deliverables").map((s) => s.content).join("\n") || "None"}

CANDIDATE SUBMISSION:
Name: ${response.candidateName}
Word count: ${wordCount}
Response: "${response.responseContent}"
Attachments: ${attachments.length} file(s) - ${attachments.map((a) => a.name).join(", ") || "none"}

Evaluate this submission comprehensively.`,
    },
  ];

  const apiResponse = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages,
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!apiResponse.ok) {
    const err = await apiResponse.text();
    return NextResponse.json({ error: err }, { status: apiResponse.status });
  }

  const data = await apiResponse.json();
  const analysis = JSON.parse(data.choices[0].message.content);

  // Clamp scores
  analysis.overallScore = Math.max(0, Math.min(100, analysis.overallScore ?? 0));
  analysis.fitToBrand = Math.max(0, Math.min(100, analysis.fitToBrand ?? 0));
  analysis.creativityScore = Math.max(0, Math.min(100, analysis.creativityScore ?? 0));
  analysis.technicalAccuracy = Math.max(0, Math.min(100, analysis.technicalAccuracy ?? 0));

  return NextResponse.json(analysis);
}
