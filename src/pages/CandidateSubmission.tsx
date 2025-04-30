
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';

const CandidateSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const [candidateName, setCandidateName] = useState('');
  const [responseContent, setResponseContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch task for candidate view - uses specialized endpoint that doesn't expose sensitive data
  const { data: task, isLoading, error } = useQuery({
    queryKey: ['candidateTask', id],
    queryFn: () => taskService.getTaskByIdForCandidate(id || ''),
    enabled: !!id,
  });

  const submitMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error("Missing task ID");
      return taskService.submitResponse(id, {
        candidateName,
        responseContent
      });
    },
    onSuccess: () => {
      toast.success("Your response has been submitted successfully!");
      setIsSubmitted(true);
    },
    onError: (error) => {
      console.error("Submission error:", error);
      toast.error("Failed to submit your response. Please try again.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!candidateName.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!responseContent.trim()) {
      toast.error("Please enter your response.");
      return;
    }

    submitMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black bg-gradient-to-b from-gray-900 to-black text-white">
        <p>Loading task details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black bg-gradient-to-b from-gray-900 to-black text-white p-4">
        <h1 className="text-3xl font-bold mb-4">Task Not Found</h1>
        <p className="text-center mb-6">
          The task you're looking for doesn't exist or has been removed. 
          Please check the URL and try again.
        </p>
        <Button as={Link} to="/">Return to Home</Button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black bg-gradient-to-b from-gray-900 to-black text-white p-4">
        <Card className="w-full max-w-2xl bg-black/60 border border-gray-800 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Thank You!</CardTitle>
            <CardDescription>
              Your submission has been received for {task.brandDefinition.companyName}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p>
              Your response to the task "{task.title}" has been successfully submitted and will be reviewed.
            </p>
            <p className="mt-4">
              Thank you for your participation, {candidateName}!
            </p>
          </CardContent>
          <CardFooter className="pt-6 flex justify-center">
            <Button as={Link} to="/">Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-gradient-to-b from-gray-900 to-black text-white p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
          <p className="text-gray-300">
            Task for {task.brandDefinition.companyName} • 
            Due {format(new Date(task.deadline || ''), 'PPP')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3 space-y-6">
            <Card className="bg-black/60 border border-gray-800 backdrop-blur-lg">
              <CardHeader>
                <CardTitle>Task Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="task-content-block whitespace-pre-wrap mb-6">
                  {task.description}
                </div>
                
                {task.sections?.filter(section => section.type === 'requirements').length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Requirements</h3>
                    {task.sections?.filter(section => section.type === 'requirements').map((section, index) => (
                      <div key={index} className="task-content-block mb-4">
                        <h4 className="font-medium mb-1">{section.title}</h4>
                        <div className="whitespace-pre-wrap">{section.content}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {task.sections?.filter(section => section.type === 'deliverables').length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Deliverables</h3>
                    {task.sections?.filter(section => section.type === 'deliverables').map((section, index) => (
                      <div key={index} className="task-content-block mb-4">
                        <h4 className="font-medium mb-1">{section.title}</h4>
                        <div className="whitespace-pre-wrap">{section.content}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {task.sections?.filter(section => section.type === 'evaluation').length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">How You'll Be Evaluated</h3>
                    {task.sections?.filter(section => section.type === 'evaluation').map((section, index) => (
                      <div key={index} className="task-content-block mb-4">
                        <h4 className="font-medium mb-1">{section.title}</h4>
                        <div className="whitespace-pre-wrap">{section.content}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {task.sections?.filter(section => section.type === 'note').length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Additional Notes</h3>
                    {task.sections?.filter(section => section.type === 'note').map((section, index) => (
                      <div key={index} className="task-content-block mb-4">
                        <h4 className="font-medium mb-1">{section.title}</h4>
                        <div className="whitespace-pre-wrap">{section.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-black/60 border border-gray-800 backdrop-blur-lg">
              <CardHeader>
                <CardTitle>Submit Your Response</CardTitle>
                <CardDescription>
                  Complete the form below to submit your response to this task
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Your Full Name</Label>
                    <Input
                      id="name"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="Enter your full name"
                      className="bg-black/30"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="response">Your Response</Label>
                    <Textarea
                      id="response"
                      value={responseContent}
                      onChange={(e) => setResponseContent(e.target.value)}
                      placeholder="Write your response to the task here..."
                      className="bg-black/30 min-h-[200px]"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-4"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? "Submitting..." : "Submit Response"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="bg-black/60 border border-gray-800 backdrop-blur-lg">
              <CardHeader>
                <CardTitle>About {task.brandDefinition.companyName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-primary mb-1">Industry</h4>
                  <p>{task.brandDefinition.industry}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-primary mb-1">Target Audience</h4>
                  <p>{task.brandDefinition.targetAudience}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-primary mb-1">Company Values</h4>
                  <p>{task.brandDefinition.companyValues.join(", ")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSubmission;
