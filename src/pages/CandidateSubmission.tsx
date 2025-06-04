import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Send, Upload, FileText, X } from 'lucide-react';
import { format } from 'date-fns';
import { TaskResponse, FileAttachment } from '@/types';

const CandidateSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const [candidateName, setCandidateName] = useState('');
  const [responseContent, setResponseContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    // Reset the input value so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const convertFilesToAttachments = async (files: File[]): Promise<FileAttachment[]> => {
    const attachments: FileAttachment[] = [];
    
    for (const file of files) {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      attachments.push({
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl
      });
    }
    
    return attachments;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!candidateName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (!responseContent.trim()) {
      toast.error('Please enter your response');
      return;
    }
    
    const attachments = await convertFilesToAttachments(selectedFiles);
    
    submitMutation.mutate({ 
      candidateName, 
      responseContent,
      attachments 
    });
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
    <div className="page-container">
      <div className="main-content">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">{task.title}</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {task.brandDefinition.companyName} • Deadline: {format(new Date(task.deadline || ''), 'PPP')}
          </p>
        </div>
        
        <div className="space-y-8">
          <Card className="glass-card">
            <CardHeader className="glass-header">
              <CardTitle className="text-xl">Task Description</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="whitespace-pre-wrap leading-relaxed">{task.description}</p>
            </CardContent>
          </Card>
          
          {task.sections?.filter(section => section.type === 'requirements').length > 0 && (
            <Card className="glass-card">
              <CardHeader className="glass-header">
                <CardTitle className="text-xl">Requirements</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {task.sections?.filter(section => section.type === 'requirements').map((section) => (
                  <div key={section.id} className="mb-4 last:mb-0">
                    <h3 className="font-semibold mb-3 text-foreground">{section.title}</h3>
                    <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{section.content}</p>
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
              <CardContent className="p-6">
                {task.sections?.filter(section => section.type === 'deliverables').map((section) => (
                  <div key={section.id} className="mb-4 last:mb-0">
                    <h3 className="font-semibold mb-3 text-foreground">{section.title}</h3>
                    <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{section.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {task.brandDefinition.attachments && task.brandDefinition.attachments.length > 0 && (
            <Card className="glass-card">
              <CardHeader className="glass-header">
                <CardTitle className="text-xl">Reference Files</CardTitle>
                <CardDescription>Supporting documents and materials for this task</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {task.brandDefinition.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg border border-border">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <a 
                          href={attachment.dataUrl} 
                          download={attachment.name}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors hover:underline"
                        >
                          {attachment.name}
                        </a>
                        <p className="text-xs text-muted-foreground">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card className="glass-card">
            <CardHeader className="glass-header">
              <CardTitle>Submit Your Response</CardTitle>
              <CardDescription>Complete the form below to submit your response to this task</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label htmlFor="candidateName" className="text-foreground font-medium">Your Name</Label>
                  <Input 
                    id="candidateName"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Enter your full name"
                    className="form-input mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="responseContent" className="text-foreground font-medium">Your Response</Label>
                  <Textarea
                    id="responseContent"
                    value={responseContent}
                    onChange={(e) => setResponseContent(e.target.value)}
                    placeholder="Enter your response to this task..."
                    rows={10}
                    className="form-input mt-2"
                  />
                </div>
                
                {selectedFiles.length > 0 && (
                  <div>
                    <Label className="text-foreground font-medium">Attached Files:</Label>
                    <div className="mt-3 space-y-3">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-accent/30 p-3 rounded-lg border border-border">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.zip,.rar"
                  style={{ display: 'none' }}
                />
              </CardContent>
              <CardFooter className="flex justify-between p-6 bg-muted/30 border-t border-border">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={triggerFileSelect}
                  className="flex items-center gap-2 btn-hover"
                >
                  <Upload className="h-4 w-4" />
                  Attach Files
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitMutation.isPending}
                  className="btn-hover"
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
    </div>
  );
};

export default CandidateSubmission;
