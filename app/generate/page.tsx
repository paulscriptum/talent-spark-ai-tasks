"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { taskService } from "@/lib/taskService";
import type { BrandDefinition, FileAttachment } from "@/types";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Sparkles, Building, Users, Target, Palette, MessageSquare,
  FileText, UserCheck, TrendingUp, Upload, X, ArrowRight,
} from "lucide-react";

export default function GenerateTask() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileAttachment[]>([]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } =
    useForm<BrandDefinition>({ defaultValues: { companyValues: [], level: "middle", attachments: [] } });

  const generateTaskMutation = useMutation({
    mutationFn: taskService.generateTask,
    onSuccess: (task) => {
      toast.success("Task generated successfully!");
      reset();
      setSelectedFiles([]);
      router.push(`/projects/${task.id}`);
    },
    onError: () => toast.error("Failed to generate task. Please try again."),
  });

  const convertFilesToAttachments = async (files: File[]): Promise<FileAttachment[]> => {
    const attachments: FileAttachment[] = [];
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) { toast.error(`File ${file.name} is too large (max 10MB)`); continue; }
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      attachments.push({ id: Math.random().toString(36).substr(2, 9), name: file.name, size: file.size, type: file.type, dataUrl });
    }
    return attachments;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newAttachments = await convertFilesToAttachments(files);
      setSelectedFiles((prev) => [...prev, ...newAttachments]);
    }
  };

  const removeFile = (fileId: string) => setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));

  const onSubmit = async (data: BrandDefinition) => {
    const formattedData = {
      ...data,
      companyValues: typeof data.companyValues === "string"
        ? (data.companyValues as string).split(",").map((v) => v.trim())
        : data.companyValues,
      attachments: selectedFiles,
    };
    generateTaskMutation.mutate(formattedData);
  };

  const FormField = ({ id, label, icon: Icon, required = false, error, children }: {
    id: string; label: string; icon: React.ElementType; required?: boolean; error?: string; children: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  );

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight brand-font">Generate Task</h1>
          <p className="text-muted-foreground text-lg mt-1">
            Define your brand and requirements to create AI-powered assessments
          </p>
        </div>

        <Card className="glass-card overflow-hidden">
          <CardHeader className="p-6 lg:p-8 border-b border-border/40 bg-card/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Task Configuration</CardTitle>
                <CardDescription className="text-base mt-1">
                  Fill in the details below and our AI will generate a custom recruitment task
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 lg:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Role Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Role Information</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField id="role" label="Position Title" icon={UserCheck} required error={errors.role?.message}>
                    <Input id="role" {...register("role", { required: "Position is required" })} placeholder="e.g., Frontend Developer" className={`h-11 rounded-xl form-input ${errors.role ? "border-destructive" : ""}`} />
                  </FormField>
                  <FormField id="level" label="Experience Level" icon={TrendingUp} required>
                    <Select onValueChange={(v) => setValue("level", v as "junior" | "middle" | "senior")} defaultValue="middle">
                      <SelectTrigger className="h-11 rounded-xl form-input"><SelectValue placeholder="Select level" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                        <SelectItem value="middle">Mid-level (2-5 years)</SelectItem>
                        <SelectItem value="senior">Senior (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>
              </div>

              {/* Company Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Company Details</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField id="companyName" label="Company Name" icon={Building} required error={errors.companyName?.message}>
                    <Input id="companyName" {...register("companyName", { required: "Company name is required" })} placeholder="e.g., Acme Corporation" className={`h-11 rounded-xl form-input ${errors.companyName ? "border-destructive" : ""}`} />
                  </FormField>
                  <FormField id="industry" label="Industry" icon={Target} required error={errors.industry?.message}>
                    <Input id="industry" {...register("industry", { required: "Industry is required" })} placeholder="e.g., Technology, Healthcare" className={`h-11 rounded-xl form-input ${errors.industry ? "border-destructive" : ""}`} />
                  </FormField>
                </div>
                
                <FormField id="targetAudience" label="Target Audience" icon={Users} required error={errors.targetAudience?.message}>
                  <Input id="targetAudience" {...register("targetAudience", { required: "Target audience is required" })} placeholder="e.g., Tech-savvy professionals aged 25-40" className={`h-11 rounded-xl form-input ${errors.targetAudience ? "border-destructive" : ""}`} />
                </FormField>
              </div>

              {/* Brand Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Brand Identity</h3>
                <FormField id="companyValues" label="Core Values" icon={FileText} required error={errors.companyValues?.message}>
                  <Input id="companyValues" {...register("companyValues", { required: "At least one value is required" })} placeholder="e.g., Innovation, Integrity, Customer-focus (comma separated)" className={`h-11 rounded-xl form-input ${errors.companyValues ? "border-destructive" : ""}`} />
                </FormField>

                <FormField id="tone" label="Communication Tone" icon={Palette} required error={errors.tone?.message}>
                  <Input id="tone" {...register("tone", { required: "Brand tone is required" })} placeholder="e.g., Professional yet approachable, Technical" className={`h-11 rounded-xl form-input ${errors.tone ? "border-destructive" : ""}`} />
                </FormField>

                <FormField id="additionalInfo" label="Additional Context" icon={MessageSquare}>
                  <Textarea id="additionalInfo" {...register("additionalInfo")} placeholder="Any specific requirements, skills to assess, or context about the role..." rows={4} className="rounded-xl form-input resize-none" />
                </FormField>
              </div>

              {/* Attachments Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Reference Materials</h3>
                <FormField id="attachments" label="Upload Files (Optional)" icon={Upload}>
                  <div className="space-y-4">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-accent/20 transition-all duration-200"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm font-medium text-foreground">Click to upload files</p>
                      <p className="text-xs text-muted-foreground mt-1">Job descriptions, requirements docs, etc. (Max 10MB per file)</p>
                    </div>
                    
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        {selectedFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between bg-accent/30 p-3 rounded-xl border border-border/40">
                            <div className="flex items-center gap-3 min-w-0">
                              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
                              <span className="text-xs text-muted-foreground shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="shrink-0 hover:bg-destructive/10 hover:text-destructive rounded-lg">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" className="hidden" />
                  </div>
                </FormField>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-border/40">
                <Button type="submit" size="lg" className="w-full h-12 btn-ai-gradient rounded-xl text-base" disabled={isSubmitting || generateTaskMutation.isPending}>
                  {isSubmitting || generateTaskMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 animate-spin" />
                      Generating your task...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Generate AI Task
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
