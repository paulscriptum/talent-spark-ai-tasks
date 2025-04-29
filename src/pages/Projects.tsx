
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ClipboardList } from 'lucide-react';

const Projects = () => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getAllTasks,
  });

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Active Projects</h1>
        <Button as={Link} to="/generate">
          Generate New Task
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <p>Loading projects...</p>
        </div>
      ) : tasks?.length === 0 ? (
        <Card className="text-center p-12 card-gradient">
          <CardContent className="pt-10 space-y-4">
            <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-medium">No projects found</h3>
            <p className="text-muted-foreground">
              Get started by generating your first task
            </p>
            <Button as={Link} to="/generate" className="mt-4">
              Generate Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {tasks?.map(task => (
            <Card key={task.id} className="overflow-hidden card-gradient">
              <CardHeader className="bg-secondary/50 pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <Badge variant={task.status === 'active' ? 'default' : 'outline'}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="content-block">
                    <p className="text-sm line-clamp-2">{task.description}</p>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Company: {task.brandDefinition.companyName}</span>
                      <span>{task.responses.length} responses</span>
                    </div>
                    <div className="mt-1">
                      Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {task.brandDefinition.companyValues.slice(0, 3).map((value, idx) => (
                      <Badge key={idx} variant="outline" className="bg-primary/10">
                        {value}
                      </Badge>
                    ))}
                    {task.brandDefinition.companyValues.length > 3 && (
                      <Badge variant="outline" className="bg-primary/10">
                        +{task.brandDefinition.companyValues.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="pt-3">
                    <Button 
                      variant="default" 
                      className="w-full"
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
    </Layout>
  );
};

export default Projects;
