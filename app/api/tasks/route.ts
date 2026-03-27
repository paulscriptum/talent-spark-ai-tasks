import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select(`
      *,
      task_sections (*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(tasks)
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, category, difficulty, estimatedTime, sections, status = "draft" } = body

  // Create the task
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      title,
      description,
      category,
      difficulty,
      estimated_time: estimatedTime,
      status,
    })
    .select()
    .single()

  if (taskError) {
    return NextResponse.json({ error: taskError.message }, { status: 500 })
  }

  // Create sections if provided
  if (sections && sections.length > 0) {
    const sectionsData = sections.map((section: { title: string; content: string; orderIndex: number }) => ({
      task_id: task.id,
      title: section.title,
      content: section.content,
      order_index: section.orderIndex,
    }))

    const { error: sectionsError } = await supabase
      .from("task_sections")
      .insert(sectionsData)

    if (sectionsError) {
      // Rollback task creation if sections fail
      await supabase.from("tasks").delete().eq("id", task.id)
      return NextResponse.json({ error: sectionsError.message }, { status: 500 })
    }
  }

  // Fetch the complete task with sections
  const { data: completeTask, error: fetchError } = await supabase
    .from("tasks")
    .select(`
      *,
      task_sections (*)
    `)
    .eq("id", task.id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  return NextResponse.json(completeTask, { status: 201 })
}
