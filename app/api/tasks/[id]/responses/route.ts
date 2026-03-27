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

  // Verify user owns the task
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (taskError || !task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  const { data: responses, error } = await supabase
    .from("task_responses")
    .select(`
      *,
      file_attachments (*)
    `)
    .eq("task_id", id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(responses)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const body = await req.json()
  const { candidateName, candidateEmail, content, attachments } = body

  // Verify task exists and is published
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("id, status")
    .eq("id", id)
    .single()

  if (taskError || !task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  if (task.status !== "published") {
    return NextResponse.json(
      { error: "Task is not accepting submissions" },
      { status: 400 }
    )
  }

  // Create the response
  const { data: response, error: responseError } = await supabase
    .from("task_responses")
    .insert({
      task_id: id,
      candidate_name: candidateName,
      candidate_email: candidateEmail,
      content,
      status: "submitted",
    })
    .select()
    .single()

  if (responseError) {
    return NextResponse.json({ error: responseError.message }, { status: 500 })
  }

  // Create file attachments if provided
  if (attachments && attachments.length > 0) {
    const attachmentsData = attachments.map((attachment: { fileName: string; fileUrl: string; fileSize: number; fileType: string }) => ({
      response_id: response.id,
      file_name: attachment.fileName,
      file_url: attachment.fileUrl,
      file_size: attachment.fileSize,
      file_type: attachment.fileType,
    }))

    const { error: attachmentsError } = await supabase
      .from("file_attachments")
      .insert(attachmentsData)

    if (attachmentsError) {
      console.error("Error saving attachments:", attachmentsError)
    }
  }

  return NextResponse.json(response, { status: 201 })
}
