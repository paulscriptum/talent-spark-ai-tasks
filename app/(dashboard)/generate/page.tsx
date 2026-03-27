"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles, Save, Eye } from "lucide-react"

interface GeneratedTask {
  title: string
  description: string
  category: string
  difficulty: string
  estimatedTime: string
  sections: { title: string; content: string; orderIndex: number }[]
}

export default function GeneratePage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [category, setCategory] = useState("development")
  const [difficulty, setDifficulty] = useState("middle")
  const [taskType, setTaskType] = useState("")
  const [generatedTask, setGeneratedTask] = useState<GeneratedTask | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          category,
          difficulty,
          taskType,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate task")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          fullContent += chunk

          // Try to parse the accumulated content for structured data
          const lines = fullContent.split("\n")
          for (const line of lines) {
            if (line.startsWith("data:")) {
              const data = line.slice(5).trim()
              if (data && data !== "[DONE]") {
                try {
                  const parsed = JSON.parse(data)
                  if (parsed.type === "finish" && parsed.object) {
                    setGeneratedTask(parsed.object)
                  }
                } catch {
                  // Continue accumulating
                }
              }
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async (status: "draft" | "published" = "draft") => {
    if (!generatedTask) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...generatedTask,
          status,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save task")
      }

      const task = await response.json()
      router.push(`/projects/${task.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Task</h1>
        <p className="text-muted-foreground">
          Create professional assessment tasks using AI
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Task Configuration</CardTitle>
            <CardDescription>
              Configure the parameters for your task generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="middle">Middle</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taskType">Task Type (Optional)</Label>
              <Input
                id="taskType"
                placeholder="e.g., REST API, Landing Page, Data Analysis"
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Additional Requirements (Optional)</Label>
              <Textarea
                id="prompt"
                placeholder="Describe any specific requirements, technologies, or constraints..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Task
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Task Preview</CardTitle>
            <CardDescription>
              Review and edit your generated task before saving
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedTask ? (
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Title</Label>
                    <p className="font-medium">{generatedTask.title}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p>{generatedTask.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Category</Label>
                      <p className="capitalize">{generatedTask.category}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Difficulty</Label>
                      <p className="capitalize">{generatedTask.difficulty}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Est. Time</Label>
                      <p>{generatedTask.estimatedTime}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  {generatedTask.sections.map((section, index) => (
                    <div key={index} className="border-l-2 border-primary/30 pl-4">
                      <h4 className="font-medium">{section.title}</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
                        {section.content.length > 300
                          ? section.content.substring(0, 300) + "..."
                          : section.content}
                      </p>
                    </div>
                  ))}
                </TabsContent>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleSave("draft")}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save as Draft
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleSave("published")}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Eye className="mr-2 h-4 w-4" />
                    )}
                    Publish
                  </Button>
                </div>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Sparkles className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-4">
                  Configure your parameters and click Generate to create a task
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
