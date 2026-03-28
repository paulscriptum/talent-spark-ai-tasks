"use client";

import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/lib/taskService";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { FileText, Plus, Users, ArrowRight, Sparkles, Loader2 } from "lucide-react";

export default function Projects() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getAllTasks,
  });

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your recruitment tasks
            </p>
          </div>
          <Link href="/generate">
            <Button size="sm" className="rounded-lg">
              <Plus className="w-4 h-4 mr-2" />
              New task
            </Button>
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : tasks?.length === 0 ? (
          <div className="p-12 rounded-xl border border-border/50 border-dashed text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No projects yet</h3>
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
            {tasks?.map((task) => (
              <Link
                key={task.id}
                href={`/projects/${task.id}`}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate group-hover:text-primary transition-colors">
                      {task.title}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-3 mt-0.5">
                      <span>{task.brandDefinition.companyName}</span>
                      <span className="text-muted-foreground/50">·</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {task.responses.length}
                      </span>
                      <span className="text-muted-foreground/50">·</span>
                      <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge
                    variant={task.status === "active" ? "default" : "secondary"}
                    className="rounded-md"
                  >
                    {task.status}
                  </Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
