import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch task without user authentication check for public access
  const { data: task, error } = await supabase
    .from("tasks")
    .select(`
      id,
      title,
      description,
      category,
      difficulty,
      estimated_time,
      status,
      created_at,
      task_sections (
        id,
        title,
        content,
        order_index
      )
    `)
    .eq("id", id)
    .eq("status", "published")
    .single()

  if (error || !task) {
    return NextResponse.json(
      { error: "Task not found or not published" },
      { status: 404 }
    )
  }

  return NextResponse.json(task)
}
