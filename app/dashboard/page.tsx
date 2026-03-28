"use client";

import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/lib/taskService";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Users, CheckCircle2, FileText, ArrowRight, Sparkles, Plus } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: taskService.getDashboardStats,
  });

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getAllTasks,
  });

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Overview of your recruitment tasks
            </p>
          </div>
          <Link href="/generate">
            <Button size="sm" className="rounded-lg">
              <Plus className="w-4 h-4 mr-2" />
              New task
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Active Tasks", value: stats?.activeTasks ?? 0, icon: FileText },
            { label: "Completed", value: stats?.completedTasks ?? 0, icon: CheckCircle2 },
            { label: "Candidates", value: stats?.totalCandidates ?? 0, icon: Users },
            { label: "Projects", value: tasks?.length ?? 0, icon: FolderOpen },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl border border-border/50 bg-card">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">
                    {isLoading ? "-" : stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Recent tasks</h2>
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View all
            </Link>
          </div>

          {!tasks || tasks.length === 0 ? (
            <div className="p-12 rounded-xl border border-border/50 border-dashed text-center">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">No tasks yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first AI-powered recruitment task
              </p>
              <Link href="/generate">
                <Button size="sm" className="rounded-lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate task
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-border/50 divide-y divide-border/50">
              {tasks.slice(0, 5).map((task) => (
                <Link
                  key={task.id}
                  href={`/projects/${task.id}`}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate group-hover:text-primary transition-colors">
                        {task.title}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-3">
                        <span>{task.brandDefinition.companyName}</span>
                        <span className="text-muted-foreground/50">·</span>
                        <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="secondary" className="rounded-md">
                      {task.responses.length} responses
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/generate" className="group">
            <div className="p-5 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium group-hover:text-primary transition-colors">Generate new task</div>
                  <div className="text-sm text-muted-foreground">Create AI-powered assessments</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
          <Link href="/projects" className="group">
            <div className="p-5 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium group-hover:text-primary transition-colors">View all projects</div>
                  <div className="text-sm text-muted-foreground">Manage and monitor tasks</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
