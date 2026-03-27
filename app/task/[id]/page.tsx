import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Clock, BarChart } from "lucide-react"
import { SubmissionForm } from "@/components/submission-form"

export default async function PublicTaskPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

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
    notFound()
  }

  const sortedSections = task.task_sections?.sort(
    (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
  ) || []

  const difficultyColors = {
    junior: "bg-green-100 text-green-800",
    middle: "bg-blue-100 text-blue-800",
    senior: "bg-orange-100 text-orange-800",
    lead: "bg-purple-100 text-purple-800",
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Talent Spark AI</span>
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-4xl mx-auto">
        {/* Task Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge
              variant="secondary"
              className={difficultyColors[task.difficulty as keyof typeof difficultyColors]}
            >
              {task.difficulty}
            </Badge>
            <Badge variant="outline">{task.category}</Badge>
            {task.estimated_time && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {task.estimated_time}
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
          <p className="text-muted-foreground mt-2">{task.description}</p>
        </div>

        {/* Task Content */}
        <div className="space-y-6 mb-12">
          {sortedSections.map((section: { id: string; title: string; content: string }) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose-task whitespace-pre-wrap">{section.content}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submission Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Submit Your Response
            </CardTitle>
            <CardDescription>
              Complete the task and submit your work for review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubmissionForm taskId={task.id} />
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>Powered by Talent Spark AI</p>
        </div>
      </footer>
    </div>
  )
}
