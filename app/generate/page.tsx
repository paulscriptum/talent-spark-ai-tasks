"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { taskService } from "@/lib/taskService";
import type { BrandDefinition, FileAttachment } from "@/types";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Sparkles, Upload, X, FileText, Loader2, Building2, Users, Target, Briefcase } from "lucide-react";

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

  const isLoading = isSubmitting || generateTaskMutation.isPending;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="tag mb-4 w-fit">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            AI-Powered
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Generate New Task</h1>
          <p className="text-muted-foreground text-lg">
            Define your brand and requirements to create a tailored recruitment assessment
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Role Info */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/15 to-[hsl(42,90%,55%)]/5 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-semibold">Role Information</h2>
                <p className="text-sm text-muted-foreground">Define the position you&apos;re hiring for</p>
              </div>
            </div>
            
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">Position title *</Label>
                <Input
                  id="role"
                  {...register("role", { required: "Required" })}
                  placeholder="e.g., Frontend Developer"
                  className={`h-12 rounded-xl input-glow ${errors.role ? "border-destructive" : ""}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-medium">Experience level *</Label>
                <Select onValueChange={(v) => setValue("level", v as "junior" | "middle" | "senior")} defaultValue="middle">
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                    <SelectItem value="middle">Mid-level (2-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Company Details</h2>
                <p className="text-sm text-muted-foreground">Help us understand your organization</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium">Company name *</Label>
                  <Input
                    id="companyName"
                    {...register("companyName", { required: "Required" })}
                    placeholder="e.g., Acme Corp"
                    className={`h-12 rounded-xl input-glow ${errors.companyName ? "border-destructive" : ""}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium">Industry *</Label>
                  <Input
                    id="industry"
                    {...register("industry", { required: "Required" })}
                    placeholder="e.g., Technology"
                    className={`h-12 rounded-xl input-glow ${errors.industry ? "border-destructive" : ""}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-sm font-medium">Target audience *</Label>
                <Input
                  id="targetAudience"
                  {...register("targetAudience", { required: "Required" })}
                  placeholder="e.g., Tech-savvy professionals aged 25-40"
                  className={`h-12 rounded-xl input-glow ${errors.targetAudience ? "border-destructive" : ""}`}
                />
              </div>
            </div>
          </div>

          {/* Brand Identity */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(42,90%,55%)]/15 to-[hsl(42,90%,55%)]/5 flex items-center justify-center">
                <Target className="w-5 h-5 text-[hsl(42,90%,55%)]" />
              </div>
              <div>
                <h2 className="font-semibold">Brand Identity</h2>
                <p className="text-sm text-muted-foreground">Define your company culture and voice</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="companyValues" className="text-sm font-medium">Core values *</Label>
                <Input
                  id="companyValues"
                  {...register("companyValues", { required: "Required" })}
                  placeholder="e.g., Innovation, Integrity, Customer-focus"
                  className={`h-12 rounded-xl input-glow ${errors.companyValues ? "border-destructive" : ""}`}
                />
                <p className="text-xs text-muted-foreground">Separate multiple values with commas</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone" className="text-sm font-medium">Communication tone *</Label>
                <Input
                  id="tone"
                  {...register("tone", { required: "Required" })}
                  placeholder="e.g., Professional yet approachable"
                  className={`h-12 rounded-xl input-glow ${errors.tone ? "border-destructive" : ""}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalInfo" className="text-sm font-medium">Additional context</Label>
                <Textarea
                  id="additionalInfo"
                  {...register("additionalInfo")}
                  placeholder="Any specific requirements, skills to assess, or context about the role..."
                  rows={4}
                  className="rounded-xl resize-none input-glow"
                />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(15,70%,50%)]/15 to-[hsl(15,70%,50%)]/5 flex items-center justify-center">
                <Upload className="w-5 h-5 text-[hsl(15,70%,50%)]" />
              </div>
              <div>
                <h2 className="font-semibold">Reference Materials</h2>
                <p className="text-sm text-muted-foreground">Upload documents to help the AI understand your needs</p>
              </div>
            </div>
            
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border/80 rounded-2xl p-10 text-center cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
                <Upload className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <p className="font-medium mb-1">Click to upload files</p>
              <p className="text-sm text-muted-foreground">PDF, DOC, images up to 10MB each</p>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {selectedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center border border-border/50">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="shrink-0 h-9 w-9 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              className="hidden"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-14 rounded-xl text-base shadow-lg shadow-primary/25"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating your task...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Recruitment Task
              </>
            )}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
