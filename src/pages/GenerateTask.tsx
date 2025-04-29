
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

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Generate Task</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Brand Definition</CardTitle>
            <CardDescription>
              Define the brand to generate a tailored task that fits your company's identity.
              Our AI will create a custom task based on these details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName"
                    {...register('companyName', { required: 'Company name is required' })} 
                    placeholder="e.g., Acme Corporation"
                    className={errors.companyName ? 'border-red-500' : ''}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input 
                    id="industry"
                    {...register('industry', { required: 'Industry is required' })} 
                    placeholder="e.g., Technology, Healthcare, Finance"
                    className={errors.industry ? 'border-red-500' : ''}
                  />
                  {errors.industry && (
                    <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input 
                    id="targetAudience"
                    {...register('targetAudience', { required: 'Target audience is required' })} 
                    placeholder="e.g., Professionals 25-40, Small business owners"
                    className={errors.targetAudience ? 'border-red-500' : ''}
                  />
                  {errors.targetAudience && (
                    <p className="text-red-500 text-sm mt-1">{errors.targetAudience.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="companyValues">Company Values</Label>
                  <Input 
                    id="companyValues"
                    {...register('companyValues', { required: 'At least one company value is required' })} 
                    placeholder="e.g., Innovation, Integrity, Customer-focus (comma separated)"
                    className={errors.companyValues ? 'border-red-500' : ''}
                  />
                  {errors.companyValues && (
                    <p className="text-red-500 text-sm mt-1">{errors.companyValues.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="tone">Brand Tone</Label>
                  <Input 
                    id="tone"
                    {...register('tone', { required: 'Brand tone is required' })} 
                    placeholder="e.g., Professional, Friendly, Technical, Casual"
                    className={errors.tone ? 'border-red-500' : ''}
                  />
                  {errors.tone && (
                    <p className="text-red-500 text-sm mt-1">{errors.tone.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="additionalInfo">Additional Information (optional)</Label>
                  <Textarea 
                    id="additionalInfo"
                    {...register('additionalInfo')} 
                    placeholder="Any additional details about the brand or specific requirements for the task"
                    rows={4}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || generateTaskMutation.isPending}
              >
                {(isSubmitting || generateTaskMutation.isPending) ? 'Generating...' : 'Generate Task'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GenerateTask;
