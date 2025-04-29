
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { TaskResponse } from '../types';
import { ArrowLeft } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newResponse, setNewResponse] = useState({ candidateName: '', responseContent: '' });
  const [activeTab, setActiveTab] = useState("details");
  
  const { data: task, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTaskById(id || ''),
    enabled: !!id,
  });

  const submitResponseMutation = useMutation({
    mutationFn: (response: Omit<TaskResponse, 'id' | 'submittedAt' | 'aiAnalysis'>) => {
      if (!id) throw new Error('Task ID is required');
      
      const newResponseObj: TaskResponse = {
        ...response,
        id: `${Date.now()}`,
        submittedAt: new Date().toISOString()
      };
      
      return taskService.analyzeResponse(id, newResponseObj);
    },
    onSuccess: () => {
      toast.success('Response submitted and analyzed!');
      setNewResponse({ candidateName: '', responseContent: '' });
    },
    onError: () => {
      toast.error('Failed to submit response. Please try again.');
    }
  });

  const handleSubmitResponse = () => {
    if (!newResponse.candidateName.trim() || !newResponse.responseContent.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    submitResponseMutation.mutate(newResponse);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Loading task details...</p>
        </div>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Task not found</h2>
          <Button onClick={() => navigate('/projects')}>
            Back to Projects
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm"
          className="mb-4" 
          onClick={() => navigate('/projects')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
            <p className="text-muted-foreground mt-1">
              {task.brandDefinition.companyName} • Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
            </p>
          </div>
          <Badge variant={task.status === 'active' ? 'default' : 'outline'} className="w-fit">
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="details" onValueChange={handleTabChange} value={activeTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Task Details</TabsTrigger>
          <TabsTrigger value="responses">
            Responses ({task.responses.length})
          </TabsTrigger>
          <TabsTrigger value="submit">Submit Response</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="grid gap-6 md:grid-cols-5">
            <Card className="md:col-span-3 glass-card">
              <CardHeader className="glass-header">
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {task.description.split('\n\n').map((paragraph, idx) => (
                  <div key={idx} className="text-block">
                    <p>{paragraph}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <div className="md:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader className="glass-header">
                  <CardTitle>Brand Definition</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="content-block">
                    <h4 className="text-sm font-medium text-primary mb-1">Company</h4>
                    <p>{task.brandDefinition.companyName}</p>
                  </div>
                  <div className="content-block">
                    <h4 className="text-sm font-medium text-primary mb-1">Industry</h4>
                    <p>{task.brandDefinition.industry}</p>
                  </div>
                  <div className="content-block">
                    <h4 className="text-sm font-medium text-primary mb-1">Target Audience</h4>
                    <p>{task.brandDefinition.targetAudience}</p>
                  </div>
                  <div className="content-block">
                    <h4 className="text-sm font-medium text-primary mb-1">Brand Tone</h4>
                    <p>{task.brandDefinition.tone}</p>
                  </div>
                  <div className="content-block">
                    <h4 className="text-sm font-medium text-primary mb-1">Company Values</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {task.brandDefinition.companyValues.map((value, idx) => (
                        <Badge key={idx} variant="outline" className="bg-primary/10">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {task.brandDefinition.additionalInfo && (
                    <div className="content-block">
                      <h4 className="text-sm font-medium text-primary mb-1">Additional Information</h4>
                      <p className="text-sm">{task.brandDefinition.additionalInfo}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader className="glass-header">
                  <CardTitle>Task Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="content-block">
                    <h4 className="text-sm font-medium text-primary mb-1">Created</h4>
                    <p>{format(new Date(task.createdAt), 'PPP')}</p>
                  </div>
                  {task.deadline && (
                    <div className="content-block">
                      <h4 className="text-sm font-medium text-primary mb-1">Deadline</h4>
                      <p>{format(new Date(task.deadline), 'PPP')}</p>
                    </div>
                  )}
                  <div className="content-block">
                    <h4 className="text-sm font-medium text-primary mb-1">Responses</h4>
                    <p>{task.responses.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="responses">
          <div className="space-y-6">
            {task.responses.length === 0 ? (
              <Card className="text-center py-12 glass-card">
                <CardContent>
                  <h3 className="text-xl font-medium mb-2">No responses yet</h3>
                  <p className="text-muted-foreground mb-6">
                    There are no candidate responses for this task yet.
                  </p>
                  <Button onClick={() => setActiveTab("submit")}>
                    Submit a Response
                  </Button>
                </CardContent>
              </Card>
            ) : (
              task.responses.map(response => (
                <Card key={response.id} className="overflow-hidden glass-card">
                  <CardHeader className="glass-header">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{response.candidateName}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        Submitted {formatDistanceToNow(new Date(response.submittedAt), { addSuffix: true })}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-primary">Response</h3>
                      <div className="content-block whitespace-pre-wrap">
                        <p>{response.responseContent}</p>
                      </div>
                    </div>
                    
                    {response.aiAnalysis && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium mb-2 text-primary">AI Analysis</h3>
                        
                        <div className="content-block">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Overall Score</span>
                            <span className="font-medium">{response.aiAnalysis.overallScore}/100</span>
                          </div>
                          <Progress value={response.aiAnalysis.overallScore} className="h-2" />
                        </div>
                        
                        <div className="space-y-3 content-block">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Fit to Brand</span>
                              <span>{response.aiAnalysis.fitToBrand}/100</span>
                            </div>
                            <Progress value={response.aiAnalysis.fitToBrand} className="h-1.5" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Creativity</span>
                              <span>{response.aiAnalysis.creativityScore}/100</span>
                            </div>
                            <Progress value={response.aiAnalysis.creativityScore} className="h-1.5" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Technical Accuracy</span>
                              <span>{response.aiAnalysis.technicalAccuracy}/100</span>
                            </div>
                            <Progress value={response.aiAnalysis.technicalAccuracy} className="h-1.5" />
                          </div>
                        </div>
                        
                        <div className="content-block">
                          <h4 className="text-sm font-medium mb-1 text-primary">Summary</h4>
                          <p className="text-sm">{response.aiAnalysis.summary}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="content-block">
                            <h4 className="text-sm font-medium text-green-400 mb-1">Strengths</h4>
                            <ul className="text-sm list-disc list-inside space-y-1">
                              {response.aiAnalysis.strengths.map((strength, idx) => (
                                <li key={idx}>{strength}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="content-block">
                            <h4 className="text-sm font-medium text-red-400 mb-1">Areas to Improve</h4>
                            <ul className="text-sm list-disc list-inside space-y-1">
                              {response.aiAnalysis.weaknesses.map((weakness, idx) => (
                                <li key={idx}>{weakness}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="submit">
          <Card className="glass-card">
            <CardHeader className="glass-header">
              <CardTitle>Submit a Response</CardTitle>
              <CardDescription>
                Fill out this form to submit a new candidate response for this task
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="candidateName">Candidate Name</Label>
                  <Input 
                    id="candidateName" 
                    value={newResponse.candidateName}
                    onChange={(e) => setNewResponse(prev => ({ ...prev, candidateName: e.target.value }))}
                    placeholder="Enter candidate's full name"
                    className="bg-black/30"
                  />
                </div>
                
                <div>
                  <Label htmlFor="responseContent">Response</Label>
                  <Textarea 
                    id="responseContent"
                    value={newResponse.responseContent}
                    onChange={(e) => setNewResponse(prev => ({ ...prev, responseContent: e.target.value }))}
                    placeholder="Enter the candidate's response to this task..."
                    rows={10}
                    className="bg-black/30"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-6">
              <Button 
                onClick={handleSubmitResponse} 
                disabled={submitResponseMutation.isPending}
              >
                {submitResponseMutation.isPending ? 'Submitting...' : 'Submit and Analyze'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default ProjectDetail;
