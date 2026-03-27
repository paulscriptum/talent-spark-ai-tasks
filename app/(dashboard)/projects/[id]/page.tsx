import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, ExternalLink, Edit, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { TaskActions } from "@/components/task-actions"
import { ResponsesList } from "@/components/responses-list"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: task, error } = await supabase
    .from("tasks")
    .select(`
      *,
      task_sections (*)
    `)
    .eq("id", id)
    .eq("user_id", user?.id)
    .single()

  if (error || !task) {
    notFound()
  }

  // Fetch responses
  const { data: responses } = await supabase
    .from("task_responses")
    .select(`
      *,
      file_attachments (*)
    `)
    .eq("task_id", id)
    .order("created_at", { ascending: false })

  const sortedSections = task.task_sections?.sort(
    (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
  ) || []

  const difficultyColors = {
    junior: "bg-green-100 text-green-800",
    middle: "bg-blue-100 text-blue-800",
    senior: "bg-orange-100 text-orange-800",
    lead: "bg-purple-100 text-purple-800",
  }

  const statusColors = {
    draft: "bg-muted text-muted-foreground",
    published: "bg-primary/10 text-primary",
    archived: "bg-secondary text-secondary-foreground",
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/task/${task.id}`

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
          <p className="text-muted-foreground">{task.description}</p>
        </div>
        <TaskActions task={task} />
      </div>

      {/* Task Info */}
      <div className="flex flex-wrap items-center gap-4">
        <Badge
          variant="secondary"
          className={difficultyColors[task.difficulty as keyof typeof difficultyColors]}
        >
          {task.difficulty}
        </Badge>
        <Badge
          variant="secondary"
          className={statusColors[task.status as keyof typeof statusColors]}
        >
          {task.status}
        </Badge>
        <Badge variant="outline">{task.category}</Badge>
        {task.estimated_time && (
          <span className="text-sm text-muted-foreground">
            Est. time: {task.estimated_time}
          </span>
        )}
        <span className="text-sm text-muted-foreground">
          Created {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
        </span>
      </div>

      {/* Public Link */}
      {task.status === "published" && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium">Public Link</p>
              <p className="text-sm text-muted-foreground truncate max-w-md">{publicUrl}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(publicUrl)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="responses">
            Responses ({responses?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {sortedSections.length > 0 ? (
            sortedSections.map((section: { id: string; title: string; content: string }) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose-task whitespace-pre-wrap">{section.content}</div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No content sections yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="responses">
          <ResponsesList responses={responses || []} taskId={task.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
