import { NextRequest, NextResponse } from "next/server";
import type { BrandDefinition } from "@/types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  const { brandDef }: { brandDef: BrandDefinition } = await req.json();

  const messages = [
    {
      role: "system",
      content: `You are an expert recruitment consultant who creates professional test assessment tasks for candidates. 
Generate a realistic, detailed assessment task based on the provided brand definition. 
The task should be specific to the company's industry, values, and requirements.
Format your response as JSON with this structure:
{
  "title": "Clear task title",
  "description": "Detailed task description (2-3 paragraphs)",
  "deadline": "ISO date string 7 days from now",
  "sections": [
    {"id": "unique-id-1", "title": "Requirements", "type": "requirements", "content": "Detailed requirements in markdown"},
    {"id": "unique-id-2", "title": "Deliverables", "type": "deliverables", "content": "Expected deliverables in markdown"},
    {"id": "unique-id-3", "title": "Evaluation Criteria", "type": "evaluation", "content": "How responses will be evaluated in markdown"},
    {"id": "unique-id-4", "title": "Time Estimate", "type": "time", "content": "Estimated time to complete"},
    {"id": "unique-id-5", "title": "Additional Notes", "type": "note", "content": "Any extra context or notes"}
  ]
}`,
    },
    {
      role: "user",
      content: `Create an assessment task for the following:
Role: ${brandDef.role} (${brandDef.level} level)
Company: ${brandDef.companyName}
Industry: ${brandDef.industry}
Target Audience: ${brandDef.targetAudience}
Company Values: ${Array.isArray(brandDef.companyValues) ? brandDef.companyValues.join(", ") : brandDef.companyValues}
Communication Tone: ${brandDef.tone}
${brandDef.additionalInfo ? `Additional Info: ${brandDef.additionalInfo}` : ""}`,
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
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: err }, { status: response.status });
  }

  const data = await response.json();
  const content = JSON.parse(data.choices[0].message.content);
  return NextResponse.json(content);
}
