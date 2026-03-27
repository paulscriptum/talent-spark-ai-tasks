import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Users, Clock, ArrowRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user's tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch task counts
  const { count: totalTasks } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)

  const { count: publishedTasks } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)
    .eq("status", "published")

  const { count: totalResponses } = await supabase
    .from("task_responses")
    .select("*, tasks!inner(*)", { count: "exact", head: true })
    .eq("tasks.user_id", user?.id)

  const stats = [
    { label: "Total Tasks", value: totalTasks || 0, icon: FileText },
    { label: "Published", value: publishedTasks || 0, icon: Clock },
    { label: "Responses", value: totalResponses || 0, icon: Users },
  ]

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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.user_metadata?.full_name || "there"}!
          </p>
        </div>
        <Link href="/generate">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Generate Task
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your most recently created tasks</CardDescription>
          </div>
          <Link href="/projects">
            <Button variant="ghost" size="sm">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {tasks && tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/projects/${task.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{task.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                      <span>{task.category}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No tasks yet</h3>
              <p className="text-muted-foreground">
                Get started by generating your first AI-powered task.
              </p>
              <Link href="/generate" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Task
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
