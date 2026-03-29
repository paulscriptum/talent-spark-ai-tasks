"use client";

import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/lib/taskService";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { FileText, Plus, Users, ArrowRight, Sparkles, Loader2, FolderOpen, Clock } from "lucide-react";

export default function Projects() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getAllTasks,
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="tag mb-3 w-fit">
              <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
              All Projects
            </div>
            <h1 className="text-3xl font-semibold tracking-tight mb-1">Your Projects</h1>
            <p className="text-muted-foreground">
              Manage and track all your recruitment tasks
            </p>
          </div>
          <Link href="/generate">
            <Button className="rounded-xl h-11 px-5 btn-accent">
              <Sparkles className="w-4 h-4 mr-2" />
              Create task
            </Button>
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Loader2 className="w-7 h-7 animate-spin text-accent" />
            </div>
            <p className="text-muted-foreground">Loading your projects...</p>
          </div>
        ) : tasks?.length === 0 ? (
          <div className="card-glow p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 mesh-gradient opacity-30" />
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent/20 to-[hsl(42,90%,55%)]/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-9 h-9 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">No projects yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                Create your first AI-powered recruitment task and start finding perfect candidates.
              </p>
              <Link href="/generate">
                <Button className="rounded-xl h-12 px-8 btn-accent">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate your first task
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks?.map((task) => (
              <Link
                key={task.id}
                href={`/projects/${task.id}`}
                className="card-premium p-6 group block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/15 to-[hsl(42,90%,55%)]/5 flex items-center justify-center shrink-0 group-hover:from-accent/20 group-hover:to-[hsl(42,90%,55%)]/10 transition-colors">
                      <FileText className="w-6 h-6 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground/70">{task.brandDefinition.companyName}</span>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>{task.responses.length} response{task.responses.length !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className={`tag ${task.status === "active" ? "" : "tag-success"}`}>
                      {task.status === "active" ? "Active" : "Completed"}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
