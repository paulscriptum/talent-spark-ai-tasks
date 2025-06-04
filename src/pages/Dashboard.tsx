import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { BarChart, Users, CheckCircle, Target } from 'lucide-react';

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: taskService.getDashboardStats,
  });

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getAllTasks,
  });

  const StatCard = ({ title, value, description, icon: Icon, color }: {
    title: string;
    value: string | number;
    description: string;
    icon: any;
    color: string;
  }) => (
    <Card className="glass-card btn-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-2xl font-semibold text-foreground mt-2">
              {isLoading ? "..." : value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Welcome to testask - your AI-powered recruitment task manager
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Tasks"
            value={stats?.activeTasks || 0}
            description="Tasks currently in progress"
            icon={Target}
            color="bg-primary"
          />
          <StatCard
            title="Completed Tasks"
            value={stats?.completedTasks || 0}
            description="Successfully completed tasks"
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Total Candidates"
            value={stats?.totalCandidates || 0}
            description="Across all active projects"
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Average Score"
            value={`${stats?.averageScore || 0}/100`}
            description="Based on AI analysis"
            icon={BarChart}
            color="bg-purple-500"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="glass-card">
            <CardHeader className="glass-header">
              <CardTitle className="text-xl">Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!tasks || tasks.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-base">No tasks created yet.</p>
                  <p className="text-sm mt-1">Start by generating a new task.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.slice(0, 3).map((task) => (
                    <Card key={task.id} className="border border-border project-card-hover">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{task.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{task.brandDefinition.companyName}</p>
                          </div>
                          <Badge 
                            variant={task.status === 'active' ? 'default' : 'outline'}
                            className={task.status === 'active' ? 'status-active' : 'status-completed'}
                          >
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <div className="text-muted-foreground">
                            {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">{task.responses.length} responses</span>
                            <Link 
                              to={`/projects/${task.id}`}
                              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                            >
                              View Details →
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="glass-header">
              <CardTitle className="text-xl">Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!tasks || tasks.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  <BarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-base">No projects to display.</p>
                  <p className="text-sm mt-1">Create your first task to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks?.slice(0, 3).map(task => (
                    <div key={task.id} className="p-4 border border-border rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{task.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.brandDefinition.companyName} • {task.responses.length} responses
                          </p>
                        </div>
                        <Badge 
                          className={`status-badge ${
                            task.status === 'active' ? 'status-active' : 'status-completed'
                          }`}
                        >
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
