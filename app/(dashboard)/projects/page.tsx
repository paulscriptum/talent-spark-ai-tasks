import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Search, Filter } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Input } from "@/components/ui/input"

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Build query
  let query = supabase
    .from("tasks")
    .select(`
      *,
      task_responses(count)
    `)
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  if (params.status) {
    query = query.eq("status", params.status)
  }

  if (params.category) {
    query = query.eq("category", params.category)
  }

  if (params.search) {
    query = query.ilike("title", `%${params.search}%`)
  }

  const { data: tasks } = await query

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all your assessment tasks
          </p>
        </div>
        <Link href="/generate">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Generate Task
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search tasks..."
                defaultValue={params.search}
                className="pl-10"
              />
            </div>
            <select
              name="status"
              defaultValue={params.status || ""}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <select
              name="category"
              defaultValue={params.category || ""}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All Categories</option>
              <option value="development">Development</option>
              <option value="design">Design</option>
              <option value="writing">Writing</option>
              <option value="analysis">Analysis</option>
              <option value="research">Research</option>
            </select>
            <Button type="submit" variant="secondary">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tasks Grid */}
      {tasks && tasks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Link key={task.id} href={`/projects/${task.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
                    <Badge
                      variant="secondary"
                      className={statusColors[task.status as keyof typeof statusColors]}
                    >
                      {task.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {task.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Badge
                      variant="secondary"
                      className={difficultyColors[task.difficulty as keyof typeof difficultyColors]}
                    >
                      {task.difficulty}
                    </Badge>
                    <Badge variant="outline">{task.category}</Badge>
                    {task.estimated_time && (
                      <span className="text-muted-foreground">{task.estimated_time}</span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {task.task_responses?.[0]?.count || 0} responses
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
            <p className="text-muted-foreground">
              {params.search || params.status || params.category
                ? "Try adjusting your filters"
                : "Get started by generating your first AI-powered task."}
            </p>
            {!params.search && !params.status && !params.category && (
              <Link href="/generate" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Task
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
