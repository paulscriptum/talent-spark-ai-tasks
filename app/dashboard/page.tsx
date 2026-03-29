"use client";

import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/lib/taskService";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Users, CheckCircle2, FileText, ArrowRight, Sparkles, Plus, Target, TrendingUp } from "lucide-react";

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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your recruitment activities
            </p>
          </div>
          <Link href="/generate">
            <Button className="rounded-xl h-11 px-5 shadow-lg shadow-primary/25">
              <Sparkles className="w-4 h-4 mr-2" />
              Create task
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Active Tasks", value: stats?.activeTasks ?? 0, icon: FileText, color: "accent" },
            { label: "Completed", value: stats?.completedTasks ?? 0, icon: CheckCircle2, color: "sage" },
            { label: "Candidates", value: stats?.totalCandidates ?? 0, icon: Users, color: "gold" },
            { label: "Total Projects", value: tasks?.length ?? 0, icon: FolderOpen, color: "terracotta" },
          ].map((stat, i) => (
            <div key={i} className="card-premium p-6 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/15 to-[hsl(42,90%,55%)]/5 flex items-center justify-center group-hover:from-accent/20 group-hover:to-[hsl(42,90%,55%)]/10 transition-colors">
                  <stat.icon className="w-5 h-5 text-accent" />
                </div>
                <TrendingUp className="w-4 h-4 text-muted-foreground/50" />
              </div>
              <div className="stat-value text-4xl mb-1">
                {isLoading ? "-" : stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Tasks */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold">Recent Tasks</h2>
              <p className="text-sm text-muted-foreground">Your latest recruitment assessments</p>
            </div>
            <Link href="/projects" className="text-sm text-accent hover:underline flex items-center gap-1">
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!tasks || tasks.length === 0 ? (
            <div className="card-glow p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 mesh-gradient opacity-30" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-[hsl(42,90%,55%)]/10 flex items-center justify-center mx-auto mb-5">
                  <Sparkles className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Create your first AI-powered recruitment task and start finding the perfect candidates.
                </p>
                <Link href="/generate">
                  <Button className="rounded-xl h-11 px-6 shadow-lg shadow-primary/25">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate your first task
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="card-premium divide-y divide-border/50 overflow-hidden">
              {tasks.slice(0, 5).map((task) => (
                <Link
                  key={task.id}
                  href={`/projects/${task.id}`}
                  className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/10 to-[hsl(42,90%,55%)]/5 flex items-center justify-center shrink-0 group-hover:from-accent/15 group-hover:to-[hsl(42,90%,55%)]/10 transition-colors">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate group-hover:text-accent transition-colors">
                        {task.title}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>{task.brandDefinition.companyName}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <Badge className="tag">
                      {task.responses.length} response{task.responses.length !== 1 ? "s" : ""}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-5">
          <Link href="/generate" className="group">
            <div className="card-premium p-6 h-full">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-[hsl(42,90%,55%)]/10 flex items-center justify-center shrink-0 group-hover:shadow-lg group-hover:shadow-accent/15 transition-shadow">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold group-hover:text-accent transition-colors">Generate New Task</h3>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Create AI-powered recruitment assessments tailored to your brand and requirements.
                  </p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/projects" className="group">
            <div className="card-premium p-6 h-full">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0 group-hover:shadow-lg group-hover:shadow-primary/10 transition-shadow">
                  <FolderOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">View All Projects</h3>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Manage your tasks, review candidate responses, and track progress.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
