import { NextRequest, NextResponse } from "next/server";
import type { Task } from "@/types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  const { task, sectionType }: { task: Task; sectionType: string } = await req.json();

  const messages = [
    {
      role: "system",
      content: `You are an expert in creating content for technical assessment tasks. Given the brand information and a specific section type, generate concise and relevant content for that section. Return JSON: {"content": "the section content in markdown"}`,
    },
    {
      role: "user",
      content: `Generate the "${sectionType}" section content for:
Company: ${task.brandDefinition.companyName}
Industry: ${task.brandDefinition.industry}
Target Audience: ${task.brandDefinition.targetAudience}
Values: ${task.brandDefinition.companyValues.join(", ")}
Tone: ${task.brandDefinition.tone}
Task Title: ${task.title}
Task Description: ${task.description}

Create specific, actionable content for the "${sectionType}" section.`,
    },
  ];

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages,
      temperature: 0.6,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: err }, { status: response.status });
  }

  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content);
  return NextResponse.json(result);
}
