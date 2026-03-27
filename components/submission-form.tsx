"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Send, CheckCircle2 } from "lucide-react"

interface SubmissionFormProps {
  taskId: string
}

export function SubmissionForm({ taskId }: SubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    content: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/tasks/${taskId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit response")
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <h3 className="mt-4 text-lg font-medium">Submission Received!</h3>
          <p className="text-muted-foreground mt-2">
            Thank you for your submission. The reviewer will be notified and will
            evaluate your work.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="candidateName">Full Name</Label>
          <Input
            id="candidateName"
            placeholder="John Doe"
            value={formData.candidateName}
            onChange={(e) =>
              setFormData({ ...formData, candidateName: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="candidateEmail">Email Address</Label>
          <Input
            id="candidateEmail"
            type="email"
            placeholder="john@example.com"
            value={formData.candidateEmail}
            onChange={(e) =>
              setFormData({ ...formData, candidateEmail: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Your Submission</Label>
        <Textarea
          id="content"
          placeholder="Provide your complete solution, explanation, and any relevant links or code snippets..."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={12}
          required
        />
        <p className="text-sm text-muted-foreground">
          You can include code snippets, links to repositories, or any other
          relevant materials in your submission.
        </p>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Submit Response
          </>
        )}
      </Button>
    </form>
  )
}
