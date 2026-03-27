import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: task, error } = await supabase
    .from("tasks")
    .select(`
      *,
      task_sections (*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(task)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, category, difficulty, estimatedTime, status, sections } = body

  // Update the task
  const updateData: Record<string, unknown> = {}
  if (title !== undefined) updateData.title = title
  if (description !== undefined) updateData.description = description
  if (category !== undefined) updateData.category = category
  if (difficulty !== undefined) updateData.difficulty = difficulty
  if (estimatedTime !== undefined) updateData.estimated_time = estimatedTime
  if (status !== undefined) updateData.status = status

  const { error: taskError } = await supabase
    .from("tasks")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)

  if (taskError) {
    return NextResponse.json({ error: taskError.message }, { status: 500 })
  }

  // Update sections if provided
  if (sections !== undefined) {
    // Delete existing sections
    await supabase.from("task_sections").delete().eq("task_id", id)

    // Insert new sections
    if (sections.length > 0) {
      const sectionsData = sections.map((section: { title: string; content: string; orderIndex: number }) => ({
        task_id: id,
        title: section.title,
        content: section.content,
        order_index: section.orderIndex,
      }))

      const { error: sectionsError } = await supabase
        .from("task_sections")
        .insert(sectionsData)

      if (sectionsError) {
        return NextResponse.json({ error: sectionsError.message }, { status: 500 })
      }
    }
  }

  // Fetch updated task
  const { data: task, error: fetchError } = await supabase
    .from("tasks")
    .select(`
      *,
      task_sections (*)
    `)
    .eq("id", id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  return NextResponse.json(task)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
