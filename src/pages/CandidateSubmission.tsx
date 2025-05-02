
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Send } from 'lucide-react';
import { format } from 'date-fns';
import { TaskResponse } from '@/types';

const CandidateSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const [candidateName, setCandidateName] = useState('');
  const [responseContent, setResponseContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { data: task, isLoading, error } = useQuery({
    queryKey: ['task-for-candidate', id],
    queryFn: () => taskService.getTaskByIdForCandidate(id || ''),
    enabled: !!id,
    retry: 3, // Retry 3 times if task is not found initially
  });
  
  const submitMutation = useMutation({
    mutationFn: (data: Omit<TaskResponse, 'id' | 'submittedAt' | 'aiAnalysis'>) => {
      if (!id) throw new Error('Task ID is required');
      return taskService.submitResponse(id, data);
    },
    onSuccess: () => {
      toast.success('Your response was submitted successfully!');
      setIsSubmitted(true);
    },
    onError: () => {
      toast.error('Failed to submit your response. Please try again.');
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!candidateName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (!responseContent.trim()) {
      toast.error('Please enter your response');
      return;
    }
    
    submitMutation.mutate({ candidateName, responseContent });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading task details...</p>
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">Task Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">
              The task you're looking for may have been removed or the link is incorrect.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">Submission Successful</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">
              Thank you for your submission. Your response has been recorded.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{task.title}</h1>
          <p className="text-muted-foreground mt-1">
            {task.brandDefinition.companyName} • Deadline: {format(new Date(task.deadline || ''), 'PPP')}
          </p>
        </div>
        
        <Card className="glass-card">
          <CardHeader className="glass-header">
            <CardTitle className="text-xl">Task Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{task.description}</p>
          </CardContent>
        </Card>
        
        {task.sections?.filter(section => section.type === 'requirements').length > 0 && (
          <Card className="glass-card">
            <CardHeader className="glass-header">
              <CardTitle className="text-xl">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              {task.sections?.filter(section => section.type === 'requirements').map((section) => (
                <div key={section.id} className="mb-4 last:mb-0">
                  <h3 className="font-semibold mb-2">{section.title}</h3>
                  <p className="whitespace-pre-wrap">{section.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {task.sections?.filter(section => section.type === 'deliverables').length > 0 && (
          <Card className="glass-card">
            <CardHeader className="glass-header">
              <CardTitle className="text-xl">Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              {task.sections?.filter(section => section.type === 'deliverables').map((section) => (
                <div key={section.id} className="mb-4 last:mb-0">
                  <h3 className="font-semibold mb-2">{section.title}</h3>
                  <p className="whitespace-pre-wrap">{section.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        <Card className="glass-card">
          <CardHeader className="glass-header">
            <CardTitle>Submit Your Response</CardTitle>
            <CardDescription>Complete the form below to submit your response to this task</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="candidateName">Your Name</Label>
                <Input 
                  id="candidateName"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-black/30"
                />
              </div>
              
              <div>
                <Label htmlFor="responseContent">Your Response</Label>
                <Textarea
                  id="responseContent"
                  value={responseContent}
                  onChange={(e) => setResponseContent(e.target.value)}
                  placeholder="Enter your response to this task..."
                  rows={10}
                  className="bg-black/30"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Response
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CandidateSubmission;
