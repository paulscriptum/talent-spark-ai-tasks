import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ClipboardList, Plus, Building } from 'lucide-react';

const Projects = () => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getAllTasks,
  });

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Active Projects</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage and monitor your recruitment tasks
            </p>
          </div>
          <Button as={Link} to="/generate" className="btn-hover">
            <Plus className="mr-2 h-4 w-4" />
            Generate New Task
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-16">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : tasks?.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="text-center p-16 space-y-6">
              <div className="mx-auto p-4 bg-muted/50 rounded-lg w-fit">
                <ClipboardList className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
                <p className="text-muted-foreground text-base">
                  Get started by generating your first AI-powered recruitment task
                </p>
              </div>
              <Button as={Link} to="/generate" size="lg" className="btn-hover">
                <Plus className="mr-2 h-4 w-4" />
                Generate Your First Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tasks?.map(task => (
              <Card key={task.id} className="glass-card hover:shadow-md transition-shadow duration-200">
                <CardHeader className="glass-header">
                  <div className="flex justify-between items-start gap-3">
                    <CardTitle className="text-lg font-semibold line-clamp-2">{task.title}</CardTitle>
                    <Badge 
                      className={`status-badge shrink-0 ${
                        task.status === 'active' ? 'status-active' : 'status-completed'
                      }`}
                    >
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-4">
                  <div className="space-y-4">
                    <div className="content-block">
                      <p className="text-sm text-foreground/90 line-clamp-2">{task.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span>{task.brandDefinition.companyName}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{task.responses.length} responses</span>
                        <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {task.brandDefinition.companyValues.slice(0, 3).map((value, idx) => (
                        <Badge key={idx} variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                          {value}
                        </Badge>
                      ))}
                      {task.brandDefinition.companyValues.length > 3 && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                          +{task.brandDefinition.companyValues.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button 
                        variant="default" 
                        className="w-full btn-hover"
                        as={Link}
                        to={`/projects/${task.id}`}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
