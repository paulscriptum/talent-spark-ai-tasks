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
  FileText, UserCheck, TrendingUp, Upload, X,
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
      if (file.size > 10 * 1024 * 1024) { toast.error(`File ${file.name} is too large. Max 10MB.`); continue; }
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
      <Label htmlFor={id} className="text-foreground font-medium flex items-center gap-2">
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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Generate Task</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Define your brand and role requirements to create AI-powered recruitment tasks
          </p>
        </div>

        <Card className="glass-card max-w-4xl">
          <CardHeader className="glass-header">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Task Generation</CardTitle>
                <CardDescription className="text-base mt-1">
                  Provide details about your brand, role, and requirements to generate a custom recruitment task.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField id="role" label="Role/Position" icon={UserCheck} required error={errors.role?.message}>
                  <Input id="role" {...register("role", { required: "Role is required" })} placeholder="e.g., Frontend Developer" className={`form-input ${errors.role ? "border-destructive" : ""}`} />
                </FormField>
                <FormField id="level" label="Experience Level" icon={TrendingUp} required>
                  <Select onValueChange={(v) => setValue("level", v as "junior" | "middle" | "senior")} defaultValue="middle">
                    <SelectTrigger className="form-input"><SelectValue placeholder="Select experience level" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                      <SelectItem value="middle">Middle (2-5 years)</SelectItem>
                      <SelectItem value="senior">Senior (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField id="companyName" label="Company Name" icon={Building} required error={errors.companyName?.message}>
                  <Input id="companyName" {...register("companyName", { required: "Company name is required" })} placeholder="e.g., Acme Corporation" className={`form-input ${errors.companyName ? "border-destructive" : ""}`} />
                </FormField>
                <FormField id="industry" label="Industry" icon={Target} required error={errors.industry?.message}>
                  <Input id="industry" {...register("industry", { required: "Industry is required" })} placeholder="e.g., Technology, Healthcare" className={`form-input ${errors.industry ? "border-destructive" : ""}`} />
                </FormField>
              </div>

              <FormField id="targetAudience" label="Target Audience" icon={Users} required error={errors.targetAudience?.message}>
                <Input id="targetAudience" {...register("targetAudience", { required: "Target audience is required" })} placeholder="e.g., Professionals 25-40, Recent graduates" className={`form-input ${errors.targetAudience ? "border-destructive" : ""}`} />
              </FormField>

              <FormField id="companyValues" label="Company Values" icon={FileText} required error={errors.companyValues?.message}>
                <Input id="companyValues" {...register("companyValues", { required: "At least one company value is required" })} placeholder="e.g., Innovation, Integrity, Customer-focus (comma separated)" className={`form-input ${errors.companyValues ? "border-destructive" : ""}`} />
              </FormField>

              <FormField id="tone" label="Brand Tone" icon={Palette} required error={errors.tone?.message}>
                <Input id="tone" {...register("tone", { required: "Brand tone is required" })} placeholder="e.g., Professional, Friendly, Technical" className={`form-input ${errors.tone ? "border-destructive" : ""}`} />
              </FormField>

              <FormField id="additionalInfo" label="Additional Information" icon={MessageSquare}>
                <Textarea id="additionalInfo" {...register("additionalInfo")} placeholder="Any additional details about your brand or specific requirements..." rows={4} className="form-input" />
              </FormField>

              <FormField id="attachments" label="Reference Files (Optional)" icon={Upload}>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />Select Files
                    </Button>
                    <p className="text-sm text-muted-foreground">Upload job descriptions or reference materials (Max 10MB)</p>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Attached Files:</p>
                      {selectedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between bg-accent/30 p-3 rounded-lg border border-border">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{file.name}</span>
                            <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="hover:bg-destructive/10 hover:text-destructive">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" style={{ display: "none" }} />
                </div>
              </FormField>

              <div className="pt-4 border-t border-border">
                <Button type="submit" size="lg" className="w-full btn-ai-gradient" disabled={isSubmitting || generateTaskMutation.isPending}>
                  {isSubmitting || generateTaskMutation.isPending ? (
                    <><Sparkles className="mr-2 h-4 w-4 animate-spin" />Generating Task...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" />Generate AI Task</>
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
