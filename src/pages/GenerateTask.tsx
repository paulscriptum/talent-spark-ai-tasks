import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { BrandDefinition } from '../types';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Building, Users, Target, Palette, MessageSquare, FileText } from 'lucide-react';

const GenerateTask = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<BrandDefinition>({
    defaultValues: {
      companyValues: []
    }
  });

  const generateTaskMutation = useMutation({
    mutationFn: taskService.generateTask,
    onSuccess: (task) => {
      toast.success('Task generated successfully!');
      reset();
      navigate(`/projects/${task.id}`);
    },
    onError: () => {
      toast.error('Failed to generate task. Please try again.');
    }
  });

  const onSubmit = async (data: BrandDefinition) => {
    // Convert comma-separated values to array
    const formattedData = {
      ...data,
      companyValues: typeof data.companyValues === 'string' 
        ? (data.companyValues as string).split(',').map(v => v.trim())
        : data.companyValues
    };
    
    generateTaskMutation.mutate(formattedData);
  };

  const FormField = ({ id, label, icon: Icon, required = false, error, children }: {
    id: string;
    label: string;
    icon: any;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-foreground font-medium flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-destructive text-sm flex items-center gap-1 mt-1">
          {error}
        </p>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Generate Task</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Define your brand to create AI-powered recruitment tasks tailored to your company
          </p>
        </div>
        
        <Card className="glass-card max-w-4xl">
          <CardHeader className="glass-header">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Brand Definition</CardTitle>
                <CardDescription className="text-base mt-1">
                  Provide details about your brand to generate a custom recruitment task. Our AI will create 
                  content that perfectly matches your company's identity and values.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  id="companyName"
                  label="Company Name"
                  icon={Building}
                  required
                  error={errors.companyName?.message}
                >
                  <Input 
                    id="companyName"
                    {...register('companyName', { required: 'Company name is required' })} 
                    placeholder="e.g., Acme Corporation"
                    className={`form-input ${errors.companyName ? 'border-destructive focus:border-destructive' : ''}`}
                  />
                </FormField>
                
                <FormField
                  id="industry"
                  label="Industry"
                  icon={Target}
                  required
                  error={errors.industry?.message}
                >
                  <Input 
                    id="industry"
                    {...register('industry', { required: 'Industry is required' })} 
                    placeholder="e.g., Technology, Healthcare, Finance"
                    className={`form-input ${errors.industry ? 'border-destructive focus:border-destructive' : ''}`}
                  />
                </FormField>
              </div>
              
              <FormField
                id="targetAudience"
                label="Target Audience"
                icon={Users}
                required
                error={errors.targetAudience?.message}
              >
                <Input 
                  id="targetAudience"
                  {...register('targetAudience', { required: 'Target audience is required' })} 
                  placeholder="e.g., Professionals 25-40, Small business owners, Recent graduates"
                  className={`form-input ${errors.targetAudience ? 'border-destructive focus:border-destructive' : ''}`}
                />
              </FormField>
              
              <FormField
                id="companyValues"
                label="Company Values"
                icon={FileText}
                required
                error={errors.companyValues?.message}
              >
                <Input 
                  id="companyValues"
                  {...register('companyValues', { required: 'At least one company value is required' })} 
                  placeholder="e.g., Innovation, Integrity, Customer-focus, Teamwork (comma separated)"
                  className={`form-input ${errors.companyValues ? 'border-destructive focus:border-destructive' : ''}`}
                />
              </FormField>
              
              <FormField
                id="tone"
                label="Brand Tone"
                icon={Palette}
                required
                error={errors.tone?.message}
              >
                <Input 
                  id="tone"
                  {...register('tone', { required: 'Brand tone is required' })} 
                  placeholder="e.g., Professional, Friendly, Technical, Casual, Authoritative"
                  className={`form-input ${errors.tone ? 'border-destructive focus:border-destructive' : ''}`}
                />
              </FormField>
              
              <FormField
                id="additionalInfo"
                label="Additional Information"
                icon={MessageSquare}
              >
                <Textarea 
                  id="additionalInfo"
                  {...register('additionalInfo')} 
                  placeholder="Any additional details about your brand, specific requirements for the task, or particular skills you want to evaluate..."
                  rows={4}
                  className="form-input"
                />
              </FormField>
              
              <div className="pt-4 border-t border-border">
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full btn-ai-gradient"
                  disabled={isSubmitting || generateTaskMutation.isPending}
                >
                  {(isSubmitting || generateTaskMutation.isPending) ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Generating Task...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate AI Task
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GenerateTask;
