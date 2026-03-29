"use client";

import { useState, useRef, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/lib/taskService";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { TaskResponse, TaskSection, FileAttachment } from "@/types";
import { ArrowLeft, Clock, Check, FileText, PenLine, AlertCircle, Info, Copy, Bot, Upload, X } from "lucide-react";
import EditSectionForm from "@/components/EditSectionForm";
import EditDescriptionForm from "@/components/EditDescriptionForm";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [newResponse, setNewResponse] = useState({ candidateName: "", responseContent: "" });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("details");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: task, isLoading } = useQuery({
    queryKey: ["task", id],
    queryFn: () => taskService.getTaskById(id),
    enabled: !!id,
  });

  const submitResponseMutation = useMutation({
    mutationFn: async (response: Omit<TaskResponse, "id" | "submittedAt" | "aiAnalysis">) => {
      const attachments = await convertFilesToAttachments(selectedFiles);
      return taskService.submitResponse(id, { ...response, attachments });
    },
    onSuccess: () => {
      toast.success("Response submitted and analyzed!");
      setNewResponse({ candidateName: "", responseContent: "" });
      setSelectedFiles([]);
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
    onError: () => toast.error("Failed to submit response. Please try again."),
  });

  const updateSectionMutation = useMutation({
    mutationFn: ({ sectionId, content }: { sectionId: string; content: string }) =>
      taskService.updateTaskSection(id, sectionId, content),
    onSuccess: () => {
      toast.success("Section updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["task", id] });
      setEditingSection(null);
    },
    onError: () => toast.error("Failed to update section."),
  });

  const updateDescriptionMutation = useMutation({
    mutationFn: (description: string) => taskService.updateTaskDescription(id, description),
    onSuccess: () => {
      toast.success("Description updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["task", id] });
      setEditingDescription(false);
    },
    onError: () => toast.error("Failed to update description."),
  });

  const generateSectionMutation = useMutation({
    mutationFn: (sectionId: string) => taskService.generateSectionContentWithAI(id, sectionId),
    onSuccess: (updatedSection) => {
      if (updatedSection) {
        toast.success(`AI generated content for ${updatedSection.type}`);
        queryClient.invalidateQueries({ queryKey: ["task", id] });
        setEditingSection(updatedSection.id);
      }
    },
    onError: (e: Error) => toast.error(`Failed to generate: ${e.message}`),
  });

  const convertFilesToAttachments = async (files: File[]): Promise<FileAttachment[]> => {
    const attachments: FileAttachment[] = [];
    for (const file of files) {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      attachments.push({ id: `file-${Date.now()}-${Math.random()}`, name: file.name, size: file.size, type: file.type, dataUrl });
    }
    return attachments;
  };

  const handleCopyLink = () => {
    const shareLink = `${window.location.origin}/tasks/${id}/submit`;
    navigator.clipboard.writeText(shareLink).then(() => {
      setLinkCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setLinkCopied(false), 3000);
    });
  };

  const renderSectionContent = (section: TaskSection) => {
    const isEditing = editingSection === section.id;

    const getIcon = () => {
      switch (section.type) {
        case "requirements": return <Check className="text-primary h-5 w-5" />;
        case "deliverables": return <FileText className="text-primary h-5 w-5" />;
        case "evaluation": return <AlertCircle className="text-primary h-5 w-5" />;
        case "time": return <Clock className="text-primary h-5 w-5" />;
        case "note": return <Info className="text-primary h-5 w-5" />;
        default: return null;
      }
    };

    const getClass = () => {
      switch (section.type) {
        case "requirements": return "task-requirements-block";
        case "deliverables": return "task-deliverables-block";
        case "evaluation": return "task-evaluation-block";
        case "time": return "task-time-block";
        case "note": return "task-note-block";
        default: return "task-content-block";
      }
    };

    if (isEditing) {
      return (
        <EditSectionForm
          section={section}
          onSave={(sectionId, content) => updateSectionMutation.mutate({ sectionId, content })}
          onCancel={() => setEditingSection(null)}
          isSaving={updateSectionMutation.isPending}
        />
      );
    }

    const icon = getIcon();
    return (
      <div className={getClass()}>
        {icon && <div className="flex gap-2 items-center mb-2">{icon}<span className="font-semibold">{section.title}</span></div>}
        {!icon && <div className="font-semibold mb-2">{section.title}</div>}
        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
          <ReactMarkdown>{section.content}</ReactMarkdown>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => setEditingSection(section.id)}>
            <PenLine className="h-3.5 w-3.5 mr-1" />Edit
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <Layout><div className="flex justify-center items-center h-64"><p>Loading task details...</p></div></Layout>;
  }

  if (!task) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Task not found</h2>
          <Button onClick={() => router.push("/projects")}>Back to Projects</Button>
        </div>
      </Layout>
    );
  }

  const shareLink = `${typeof window !== "undefined" ? window.location.origin : ""}/tasks/${id}/submit`;

  const sectionTypes = ["requirements", "deliverables", "evaluation", "time", "note"] as const;

  return (
    <Layout>
      <div className="mb-6">
        <Button variant="outline" size="sm" className="mb-4" onClick={() => router.push("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
            <p className="text-muted-foreground mt-1">
              {task.brandDefinition.companyName} &bull; Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
            </p>
          </div>
          <Badge variant={task.status === "active" ? "default" : "outline"} className="w-fit">
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="details" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Task Details</TabsTrigger>
          <TabsTrigger value="responses">Responses ({task.responses.length})</TabsTrigger>
          <TabsTrigger value="submit">Submit Response</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid gap-6 md:grid-cols-5">
            <div className="space-y-6 md:col-span-3">
              {/* Share link */}
              <Card className="glass-card">
                <CardHeader className="glass-header">
                  <CardTitle className="text-xl">Share with Candidates</CardTitle>
                  <CardDescription>Send this link to candidates to complete the test task</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted/30 rounded-lg border border-border px-4 py-3 text-sm flex-1 overflow-hidden font-mono text-foreground">
                      <div className="truncate">{shareLink}</div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0 btn-hover" onClick={handleCopyLink}>
                      {linkCopied ? <><Check className="h-4 w-4 mr-2" />Copied</> : <><Copy className="h-4 w-4 mr-2" />Copy</>}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="glass-card">
                <CardHeader className="glass-header"><CardTitle>Task Description</CardTitle></CardHeader>
                <CardContent className="p-6">
                  {editingDescription ? (
                    <EditDescriptionForm description={task.description} onSave={(d) => updateDescriptionMutation.mutate(d)} onCancel={() => setEditingDescription(false)} isSaving={updateDescriptionMutation.isPending} />
                  ) : (
                    <div className="task-content-block mb-6">
                      <div className="text-muted-foreground leading-relaxed prose prose-sm max-w-none">
                        <ReactMarkdown>{task.description}</ReactMarkdown>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => setEditingDescription(true)}>
                          <PenLine className="h-3.5 w-3.5 mr-1" />Edit
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sections */}
              {sectionTypes.map((type) => {
                const sections = task.sections?.filter((s) => s.type === type) ?? [];
                const sectionLabel = type.charAt(0).toUpperCase() + type.slice(1);
                if (type === "requirements" || type === "deliverables" || sections.length > 0) {
                  return (
                    <Card key={type} className="glass-card">
                      <CardHeader className="glass-header flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">{sectionLabel}</CardTitle>
                        {sections[0] && (
                          <Button variant="outline" size="sm" className="btn-ai-gradient"
                            onClick={() => generateSectionMutation.mutate(sections[0].id)}
                            disabled={generateSectionMutation.isPending && generateSectionMutation.variables === sections[0].id}
                          >
                            <Bot className="h-3.5 w-3.5 mr-1" />
                            {generateSectionMutation.isPending ? "Generating..." : "Generate with AI"}
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent className="p-6">
                        {sections.length === 0 ? (
                          <div className="text-muted-foreground italic">No {type} defined yet.</div>
                        ) : (
                          sections.map((section) => (
                            <div key={section.id} className="mb-6 last:mb-0">{renderSectionContent(section)}</div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  );
                }
                return null;
              })}
            </div>

            {/* Sidebar info */}
            <div className="space-y-6 md:col-span-2">
              <Card className="glass-card">
                <CardHeader className="glass-header"><CardTitle className="text-lg">Brand Information</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[
                    { label: "Company", value: task.brandDefinition.companyName },
                    { label: "Industry", value: task.brandDefinition.industry },
                    { label: "Role", value: `${task.brandDefinition.role} (${task.brandDefinition.level})` },
                    { label: "Tone", value: task.brandDefinition.tone },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                      <p className="text-sm text-foreground mt-1">{value}</p>
                      <Separator className="mt-3" />
                    </div>
                  ))}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Values</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {task.brandDefinition.companyValues.map((v, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">{v}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="glass-header"><CardTitle className="text-lg">Response Stats</CardTitle></CardHeader>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-foreground">{task.responses.length}</div>
                  <p className="text-sm text-muted-foreground mt-1">Total responses received</p>
                  {task.responses.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Average Score</p>
                      {(() => {
                        const scores = task.responses.map((r) => r.aiAnalysis?.overallScore).filter((s): s is number => typeof s === "number");
                        const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
                        return (
                          <>
                            <Progress value={avg} className="h-2" />
                            <p className="text-right text-sm text-muted-foreground mt-1">{avg}/100</p>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="responses">
          {task.responses.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="text-center p-16 text-muted-foreground">
                <p className="text-lg">No responses yet.</p>
                <p className="text-sm mt-2">Share the candidate link to start receiving responses.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {task.responses.map((response) => (
                <Card key={response.id} className="glass-card">
                  <CardHeader className="glass-header">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{response.candidateName}</CardTitle>
                        <CardDescription>Submitted {formatDistanceToNow(new Date(response.submittedAt), { addSuffix: true })}</CardDescription>
                      </div>
                      {response.aiAnalysis && (
                        <Badge className={`text-sm px-3 py-1 ${response.aiAnalysis.overallScore >= 70 ? "bg-green-100 text-green-800" : response.aiAnalysis.overallScore >= 50 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                          Score: {response.aiAnalysis.overallScore}/100
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Response</h4>
                        <p className="text-sm text-foreground leading-relaxed bg-accent/20 rounded-lg p-4">{response.responseContent}</p>
                      </div>
                      {response.aiAnalysis && (
                        <div className="space-y-4 pt-2">
                          <Separator />
                          <h4 className="font-semibold text-sm">AI Analysis</h4>
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              { label: "Brand Fit", value: response.aiAnalysis.fitToBrand },
                              { label: "Creativity", value: response.aiAnalysis.creativityScore },
                              { label: "Technical", value: response.aiAnalysis.technicalAccuracy },
                            ].map(({ label, value }) => (
                              <div key={label} className="text-center p-3 bg-accent/20 rounded-lg">
                                <div className="text-2xl font-bold text-foreground">{value}</div>
                                <div className="text-xs text-muted-foreground mt-1">{label}</div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-2">Summary</h5>
                            <p className="text-sm text-muted-foreground leading-relaxed">{response.aiAnalysis.summary}</p>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium text-green-700 mb-2">Strengths</h5>
                              <ul className="space-y-1">{response.aiAnalysis.strengths.map((s, i) => <li key={i} className="text-sm text-muted-foreground flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />{s}</li>)}</ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-red-700 mb-2">Areas to Improve</h5>
                              <ul className="space-y-1">{response.aiAnalysis.weaknesses.map((w, i) => <li key={i} className="text-sm text-muted-foreground flex gap-2"><AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />{w}</li>)}</ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="submit">
          <Card className="glass-card max-w-2xl">
            <CardHeader className="glass-header">
              <CardTitle>Submit a Response</CardTitle>
              <CardDescription>Add a candidate response manually for this task</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="candidateName">Candidate Name</Label>
                <Input id="candidateName" value={newResponse.candidateName} onChange={(e) => setNewResponse((p) => ({ ...p, candidateName: e.target.value }))} placeholder="Enter candidate name" className="form-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responseContent">Response Content</Label>
                <Textarea id="responseContent" value={newResponse.responseContent} onChange={(e) => setNewResponse((p) => ({ ...p, responseContent: e.target.value }))} placeholder="Enter candidate response..." rows={8} className="form-input" />
              </div>
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Attached Files</Label>
                  {selectedFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between bg-accent/30 p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{file.name}</span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedFiles((p) => p.filter((_, idx) => idx !== i))}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <input ref={fileInputRef} type="file" multiple onChange={(e) => setSelectedFiles((p) => [...p, ...Array.from(e.target.files || [])])} accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" style={{ display: "none" }} />
              <div className="flex justify-between pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />Attach Files
                </Button>
                <Button
                  onClick={() => submitResponseMutation.mutate(newResponse)}
                  disabled={submitResponseMutation.isPending || !newResponse.candidateName.trim() || !newResponse.responseContent.trim()}
                  className="btn-ai-gradient"
                >
                  {submitResponseMutation.isPending ? "Submitting..." : "Submit & Analyze"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
