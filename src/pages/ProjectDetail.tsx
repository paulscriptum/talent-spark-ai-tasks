
import React, { useState, useRef } from 'react';
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
import { TaskResponse, TaskSection } from '../types';
import { ArrowLeft, Clock, Check, FileText, PenLine, Link2, AlertCircle, Info, Copy } from 'lucide-react';
import { Form, FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newResponse, setNewResponse] = useState({ candidateName: '', responseContent: '' });
  const [activeTab, setActiveTab] = useState("details");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const shareLinkRef = useRef<HTMLDivElement>(null);
  
  const { data: task, isLoading, refetch } = useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTaskById(id || ''),
    enabled: !!id,
  });

  const submitResponseMutation = useMutation({
    mutationFn: (response: Omit<TaskResponse, 'id' | 'submittedAt' | 'aiAnalysis'>) => {
      if (!id) throw new Error('Task ID is required');
      
      return taskService.submitResponse(id, response);
    },
    onSuccess: () => {
      toast.success('Response submitted and analyzed!');
      setNewResponse({ candidateName: '', responseContent: '' });
      refetch();
    },
    onError: () => {
      toast.error('Failed to submit response. Please try again.');
    }
  });

  const updateSectionMutation = useMutation({
    mutationFn: (data: { taskId: string, sectionId: string, content: string }) => {
      return taskService.updateTaskSection(data.taskId, data.sectionId, data.content);
    },
    onSuccess: () => {
      toast.success('Section updated successfully!');
      refetch();
      setEditingSection(null);
    },
    onError: () => {
      toast.error('Failed to update section. Please try again.');
    }
  });

  const updateDescriptionMutation = useMutation({
    mutationFn: (data: { taskId: string, description: string }) => {
      return taskService.updateTaskDescription(data.taskId, data.description);
    },
    onSuccess: () => {
      toast.success('Description updated successfully!');
      refetch();
      setEditingDescription(false);
    },
    onError: () => {
      toast.error('Failed to update description. Please try again.');
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
  
  const handleSectionEdit = (sectionId: string, content: string) => {
    if (!id) return;
    updateSectionMutation.mutate({ taskId: id, sectionId, content });
  };

  const handleDescriptionEdit = (description: string) => {
    if (!id || !task) return;
    updateDescriptionMutation.mutate({ taskId: id, description });
  };

  const handleCopyLink = () => {
    const shareLink = `${window.location.origin}/tasks/${id}/submit`;
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        setLinkCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setLinkCopied(false), 3000);
      })
      .catch((err) => {
        console.error('Error copying link:', err);
        toast.error('Failed to copy link');
      });
  };

  // Render different section types
  const renderSectionContent = (section: TaskSection) => {
    const isEditing = editingSection === section.id;

    const getIconForSection = () => {
      switch(section.type) {
        case 'requirements':
          return <Check className="text-primary h-5 w-5" />;
        case 'deliverables':
          return <FileText className="text-primary h-5 w-5" />;
        case 'evaluation':
          return <AlertCircle className="text-primary h-5 w-5" />;
        case 'time':
          return <Clock className="text-primary h-5 w-5" />;
        case 'note':
          return <Info className="text-primary h-5 w-5" />;
        default:
          return null;
      }
    };
    
    const getClassForSection = () => {
      switch(section.type) {
        case 'requirements':
          return 'task-requirements-block';
        case 'deliverables':
          return 'task-deliverables-block';
        case 'evaluation':
          return 'task-evaluation-block';
        case 'time':
          return 'task-time-block';
        case 'note':
          return 'task-note-block';
        default:
          return 'task-content-block';
      }
    };

    if (isEditing) {
      const form = useForm({
        defaultValues: {
          content: section.content
        }
      });
      
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => handleSectionEdit(section.id, data.content))}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="min-h-[150px] bg-black/30"
                      autoFocus
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setEditingSection(null)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                size="sm"
                disabled={updateSectionMutation.isPending}
              >
                {updateSectionMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      );
    }
    
    const sectionClass = getClassForSection();
    const icon = getIconForSection();

    return (
      <div className={sectionClass}>
        {icon && <div className="flex gap-2 items-center mb-2">{icon} <span className="font-semibold">{section.title}</span></div>}
        {!icon && <div className="font-semibold mb-2">{section.title}</div>}
        
        <div className="whitespace-pre-wrap">{section.content}</div>
        
        {/* Edit button for all sections */}
        <div className="flex justify-end mt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setEditingSection(section.id)}
          >
            <PenLine className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
        </div>
      </div>
    );
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

  // Generate the share link
  const shareLink = `${window.location.origin}/tasks/${id}/submit`;

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
            Responses ({task?.responses.length || 0})
          </TabsTrigger>
          <TabsTrigger value="submit">Submit Response</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="grid gap-6 md:grid-cols-5">
            <div className="space-y-6 md:col-span-3">
              {/* Candidate sharing link card */}
              <Card className="glass-card">
                <CardHeader className="glass-header">
                  <CardTitle className="text-xl">Share with Candidates</CardTitle>
                  <CardDescription>Send this link to candidates to complete the test task</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div 
                      ref={shareLinkRef}
                      className="bg-black/60 rounded-md border border-white/10 px-3 py-2 text-sm flex-1 overflow-hidden"
                    >
                      <div className="truncate">{shareLink}</div>
                    </div>
                    <Button
                      variant="outline" 
                      size="sm" 
                      className="shrink-0"
                      onClick={handleCopyLink}
                    >
                      {linkCopied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Task Content Card */}
              <Card className="glass-card">
                <CardHeader className="glass-header">
                  <CardTitle>Task Description</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6">
                    {editingDescription ? (
                      <div>
                        <Form {...useForm({
                          defaultValues: {
                            description: task.description
                          }
                        })}>
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const description = formData.get('description') as string;
                            handleDescriptionEdit(description);
                          }}>
                            <FormItem>
                              <FormControl>
                                <Textarea 
                                  name="description"
                                  className="min-h-[150px] bg-black/30"
                                  defaultValue={task.description}
                                  autoFocus
                                />
                              </FormControl>
                            </FormItem>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setEditingDescription(false)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                type="submit" 
                                size="sm"
                                disabled={updateDescriptionMutation.isPending}
                              >
                                {updateDescriptionMutation.isPending ? 'Saving...' : 'Save Changes'}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </div>
                    ) : (
                      <div className="task-content-block mb-6">
                        {task.description}
                        <div className="flex justify-end mt-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => setEditingDescription(true)}
                          >
                            <PenLine className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Requirements Section Card */}
              <Card className="glass-card">
                <CardHeader className="glass-header">
                  <CardTitle className="text-xl">Requirements</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {task.sections?.filter(section => section.type === 'requirements').map((section) => (
                    <div key={section.id} className="mb-6 last:mb-0">
                      {renderSectionContent(section)}
                    </div>
                  ))}
                  {(!task.sections || task.sections.filter(s => s.type === 'requirements').length === 0) && (
                    <div className="text-muted-foreground italic">No requirements defined yet. Click Edit to add.</div>
                  )}
                </CardContent>
              </Card>

              {/* Deliverables Section Card */}
              <Card className="glass-card">
                <CardHeader className="glass-header">
                  <CardTitle className="text-xl">Deliverables</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {task.sections?.filter(section => section.type === 'deliverables').map((section) => (
                    <div key={section.id} className="mb-6 last:mb-0">
                      {renderSectionContent(section)}
                    </div>
                  ))}
                  {(!task.sections || task.sections.filter(s => s.type === 'deliverables').length === 0) && (
                    <div className="text-muted-foreground italic">No deliverables defined yet. Click Edit to add.</div>
                  )}
                </CardContent>
              </Card>

              {/* Evaluation Criteria Card */}
              <Card className="glass-card">
                <CardHeader className="glass-header">
                  <CardTitle className="text-xl">Evaluation Criteria</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {task.sections?.filter(section => section.type === 'evaluation').map((section) => (
                    <div key={section.id} className="mb-6 last:mb-0">
                      {renderSectionContent(section)}
                    </div>
                  ))}
                  {(!task.sections || task.sections.filter(s => s.type === 'evaluation').length === 0) && (
                    <div className="text-muted-foreground italic">No evaluation criteria defined yet. Click Edit to add.</div>
                  )}
                </CardContent>
              </Card>

              {/* Notes Card */}
              <Card className="glass-card">
                <CardHeader className="glass-header">
                  <CardTitle className="text-xl">Notes</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {task.sections?.filter(section => section.type === 'note').map((section) => (
                    <div key={section.id} className="mb-6 last:mb-0">
                      {renderSectionContent(section)}
                    </div>
                  ))}
                  {(!task.sections || task.sections.filter(s => s.type === 'note').length === 0) && (
                    <div className="text-muted-foreground italic">No notes defined yet. Click Edit to add.</div>
                  )}
                </CardContent>
              </Card>
            </div>
            
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
                    <p>{task?.responses.length || 0}</p>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (id) {
                          taskService.markTaskComplete(id);
                          refetch();
                          toast.success('Task marked as completed');
                        }
                      }}
                      disabled={task.status === 'completed'}
                    >
                      {task.status === 'completed' ? 'Task Completed' : 'Mark as Complete'}
                    </Button>
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
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => setActiveTab("submit")}>
                      Submit a Test Response
                    </Button>
                    <Button variant="outline" onClick={handleCopyLink}>
                      <Link2 className="mr-2 h-4 w-4" />
                      Copy Candidate Link
                    </Button>
                  </div>
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
