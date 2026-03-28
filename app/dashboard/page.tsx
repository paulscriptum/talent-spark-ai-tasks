"use client";

import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/lib/taskService";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { BarChart, Users, CheckCircle, Target, ArrowRight, Sparkles, TrendingUp, Clock } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: taskService.getDashboardStats,
  });

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getAllTasks,
  });

  const StatCard = ({ title, value, description, icon: Icon, gradient }: {
    title: string; value: string | number; description: string; icon: React.ElementType; gradient: string;
  }) => (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-3xl font-bold text-foreground tracking-tight">
              {isLoading ? "..." : value}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
            <Icon className="h-5 w-5 text-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight brand-font">Dashboard</h1>
            <p className="text-muted-foreground text-lg mt-1">
              Welcome back to your recruitment command center
            </p>
          </div>
          <Link href="/generate">
            <Button className="btn-ai-gradient rounded-xl h-11 px-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Task
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Active Tasks" 
            value={stats?.activeTasks ?? 0} 
            description="Currently in progress" 
            icon={Target} 
            gradient="from-amber-500/20 to-orange-500/20" 
          />
          <StatCard 
            title="Completed" 
            value={stats?.completedTasks ?? 0} 
            description="Successfully finished" 
            icon={CheckCircle} 
            gradient="from-emerald-500/20 to-teal-500/20" 
          />
          <StatCard 
            title="Candidates" 
            value={stats?.totalCandidates ?? 0} 
            description="Across all projects" 
            icon={Users} 
            gradient="from-blue-500/20 to-indigo-500/20" 
          />
          <StatCard 
            title="Avg Score" 
            value={`${stats?.averageScore ?? 0}/100`} 
            description="Based on AI analysis" 
            icon={TrendingUp} 
            gradient="from-purple-500/20 to-pink-500/20" 
          />
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Tasks */}
          <Card className="glass-card">
            <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Tasks</CardTitle>
              <Link href="/projects">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  View all <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {!tasks || tasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-accent/50 flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">No tasks yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Create your first task to get started</p>
                  <Link href="/generate" className="mt-4 inline-block">
                    <Button size="sm" className="btn-ai-gradient rounded-xl">
                      <Sparkles className="h-4 w-4 mr-1.5" />Generate Task
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.slice(0, 4).map((task) => (
                    <Link key={task.id} href={`/projects/${task.id}`} className="block">
                      <div className="p-4 rounded-xl border border-border/40 bg-card/30 hover:bg-accent/30 transition-all duration-200 hover:shadow-sm group">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                              {task.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {task.brandDefinition.companyName}
                            </p>
                          </div>
                          <Badge className={`shrink-0 ${task.status === "active" ? "status-active" : "status-completed"}`}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {task.responses.length} responses
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid gap-3">
                <Link href="/generate" className="block">
                  <div className="p-4 rounded-xl border border-border/40 bg-card/30 hover:bg-accent/30 transition-all duration-200 hover:shadow-sm group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Sparkles className="h-6 w-6 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">Generate New Task</h3>
                        <p className="text-sm text-muted-foreground">Create an AI-powered assessment</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
                
                <Link href="/projects" className="block">
                  <div className="p-4 rounded-xl border border-border/40 bg-card/30 hover:bg-accent/30 transition-all duration-200 hover:shadow-sm group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <BarChart className="h-6 w-6 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">View All Projects</h3>
                        <p className="text-sm text-muted-foreground">Manage and monitor tasks</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
                
                <div className="p-4 rounded-xl border border-border/40 bg-card/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Review Responses</h3>
                      <p className="text-sm text-muted-foreground">{stats?.totalCandidates ?? 0} candidates pending review</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
