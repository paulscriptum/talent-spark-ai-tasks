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
import { Sparkles, Upload, X, FileText, Loader2 } from "lucide-react";

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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Generate task</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Define your brand and requirements to create an AI-powered assessment
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Role Info */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">Role information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm">Position title *</Label>
                <Input
                  id="role"
                  {...register("role", { required: "Required" })}
                  placeholder="e.g., Frontend Developer"
                  className={`h-10 rounded-lg ${errors.role ? "border-destructive" : ""}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm">Experience level *</Label>
                <Select onValueChange={(v) => setValue("level", v as "junior" | "middle" | "senior")} defaultValue="middle">
                  <SelectTrigger className="h-10 rounded-lg">
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
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">Company details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm">Company name *</Label>
                <Input
                  id="companyName"
                  {...register("companyName", { required: "Required" })}
                  placeholder="e.g., Acme Corp"
                  className={`h-10 rounded-lg ${errors.companyName ? "border-destructive" : ""}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm">Industry *</Label>
                <Input
                  id="industry"
                  {...register("industry", { required: "Required" })}
                  placeholder="e.g., Technology"
                  className={`h-10 rounded-lg ${errors.industry ? "border-destructive" : ""}`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience" className="text-sm">Target audience *</Label>
              <Input
                id="targetAudience"
                {...register("targetAudience", { required: "Required" })}
                placeholder="e.g., Tech-savvy professionals aged 25-40"
                className={`h-10 rounded-lg ${errors.targetAudience ? "border-destructive" : ""}`}
              />
            </div>
          </div>

          {/* Brand Identity */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">Brand identity</h2>
            <div className="space-y-2">
              <Label htmlFor="companyValues" className="text-sm">Core values *</Label>
              <Input
                id="companyValues"
                {...register("companyValues", { required: "Required" })}
                placeholder="e.g., Innovation, Integrity, Customer-focus"
                className={`h-10 rounded-lg ${errors.companyValues ? "border-destructive" : ""}`}
              />
              <p className="text-xs text-muted-foreground">Separate multiple values with commas</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone" className="text-sm">Communication tone *</Label>
              <Input
                id="tone"
                {...register("tone", { required: "Required" })}
                placeholder="e.g., Professional yet approachable"
                className={`h-10 rounded-lg ${errors.tone ? "border-destructive" : ""}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalInfo" className="text-sm">Additional context</Label>
              <Textarea
                id="additionalInfo"
                {...register("additionalInfo")}
                placeholder="Any specific requirements, skills to assess, or context about the role..."
                rows={3}
                className="rounded-lg resize-none"
              />
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">Reference materials</h2>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
            >
              <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">Click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOC, images (max 10MB)</p>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                {selectedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="shrink-0 h-8 w-8 p-0"
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
          <div className="pt-4 border-t border-border/50">
            <Button
              type="submit"
              className="w-full h-11 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate task
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
