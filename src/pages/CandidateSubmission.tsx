
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskSection } from '../types';

const formSchema = z.object({
  candidateName: z.string().min(2, { message: 'Please enter your name' }),
  responseContent: z.string().min(10, { message: 'Please provide a more detailed response' })
});

const CandidateSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { data: task, isLoading, error } = useQuery({
    queryKey: ['task-candidate', id],
    queryFn: () => taskService.getTaskByIdForCandidate(id || ''),
    enabled: !!id,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateName: '',
      responseContent: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      
      await taskService.submitResponse(id, {
        candidateName: data.candidateName,
        responseContent: data.responseContent
      });
      
      toast.success('Your response has been submitted successfully!');
      setSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Failed to submit your response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render section content
  const renderSectionContent = (section: TaskSection) => {
    const getIconClass = () => {
      switch(section.type) {
        case 'requirements':
          return 'task-requirements-block';
        case 'deliverables':
          return 'task-deliverables-block';
        case 'evaluation':
          return 'task-evaluation-block';
        case 'note':
          return 'task-note-block';
        default:
          return 'task-content-block';
      }
    };
    
    return (
      <div className={getIconClass()}>
        <div className="font-semibold mb-2">{section.title}</div>
        <div className="whitespace-pre-wrap">{section.content}</div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex justify-center items-center p-10">
              <p>Loading task details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col justify-center items-center p-10">
              <h2 className="text-2xl font-bold mb-4">Task not found</h2>
              <p className="text-muted-foreground mb-6">The task you are looking for doesn't exist or has expired.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Thank You!</CardTitle>
            <CardDescription className="text-center">
              Your response has been submitted successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col justify-center items-center p-10">
              <p className="text-center mb-6">
                Your submission has been received and will be reviewed by the recruitment team.
                Thank you for taking the time to complete this assessment task.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{task.title}</CardTitle>
          <CardDescription>
            Assessment Task for {task.brandDefinition.companyName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="task-content-block">
              {task.description}
            </div>

            {task.sections?.filter(section => section.type === 'requirements').map((section) => (
              <div key={section.id}>
                {renderSectionContent(section)}
              </div>
            ))}

            {task.sections?.filter(section => section.type === 'deliverables').map((section) => (
              <div key={section.id}>
                {renderSectionContent(section)}
              </div>
            ))}

            {task.sections?.filter(section => section.type === 'evaluation').map((section) => (
              <div key={section.id}>
                {renderSectionContent(section)}
              </div>
            ))}

            {task.sections?.filter(section => section.type === 'note').map((section) => (
              <div key={section.id}>
                {renderSectionContent(section)}
              </div>
            ))}

            <div className="content-block">
              <h3 className="font-semibold mb-2">Company Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-primary mb-1">Company</div>
                  <p className="text-sm">{task.brandDefinition.companyName}</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-primary mb-1">Industry</div>
                  <p className="text-sm">{task.brandDefinition.industry}</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-primary mb-1">Target Audience</div>
                  <p className="text-sm">{task.brandDefinition.targetAudience}</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-primary mb-1">Brand Values</div>
                  <p className="text-sm">{task.brandDefinition.companyValues.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Submit Your Response</CardTitle>
          <CardDescription>
            Please fill out the form below to submit your response to this task
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="candidateName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="candidateName">Your Name</Label>
                    <FormControl>
                      <Input 
                        id="candidateName"
                        placeholder="Enter your full name"
                        className="bg-black/30"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responseContent"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="responseContent">Your Response</Label>
                    <FormControl>
                      <Textarea 
                        id="responseContent"
                        placeholder="Enter your response to the task..."
                        rows={15}
                        className="bg-black/30"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Response'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateSubmission;
