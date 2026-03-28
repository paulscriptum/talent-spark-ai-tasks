"use client";

import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/lib/taskService";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ClipboardCheck, Plus, Building, Users, Clock, ArrowRight, Sparkles } from "lucide-react";

export default function Projects() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getAllTasks,
  });

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight brand-font">Projects</h1>
            <p className="text-muted-foreground text-lg mt-1">
              Manage and monitor your recruitment tasks
            </p>
          </div>
          <Link href="/generate">
            <Button className="btn-ai-gradient rounded-xl h-11 px-6">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <Sparkles className="h-8 w-8 text-primary mx-auto animate-pulse mb-3" />
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          </div>
        ) : tasks?.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-accent/50 flex items-center justify-center mx-auto mb-6">
                <ClipboardCheck className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No projects yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Create your first AI-powered recruitment task to start assessing candidates
              </p>
              <Link href="/generate">
                <Button size="lg" className="btn-ai-gradient rounded-xl h-12 px-8">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Your First Task
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tasks?.map((task) => (
              <Card key={task.id} className="glass-card project-card-hover group overflow-hidden">
                <CardHeader className="p-5 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {task.title}
                    </CardTitle>
                    <Badge className={`shrink-0 ${task.status === "active" ? "status-active" : "status-completed"}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <div className="space-y-4">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {task.description || "No description provided"}
                    </p>
                    
                    {/* Meta Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4 shrink-0" />
                        <span className="truncate">{task.brandDefinition.companyName}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-4 w-4" />
                          {task.responses.length} responses
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {task.brandDefinition.companyValues.slice(0, 3).map((value, idx) => (
                        <Badge key={idx} variant="outline" className="bg-primary/5 text-primary/80 border-primary/20 text-xs">
                          {value}
                        </Badge>
                      ))}
                      {task.brandDefinition.companyValues.length > 3 && (
                        <Badge variant="outline" className="bg-accent/50 text-muted-foreground border-border/40 text-xs">
                          +{task.brandDefinition.companyValues.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Action Button */}
                    <Link href={`/projects/${task.id}`} className="block pt-2">
                      <Button className="w-full btn-project-hover rounded-xl h-10 text-white">
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
