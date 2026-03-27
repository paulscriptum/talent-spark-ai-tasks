"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Mail, FileText, Download, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { TaskResponse } from "@/lib/types"

interface ResponsesListProps {
  responses: TaskResponse[]
  taskId: string
}

export function ResponsesList({ responses, taskId }: ResponsesListProps) {
  const [selectedResponse, setSelectedResponse] = useState<TaskResponse | null>(null)

  const statusColors = {
    submitted: "bg-blue-100 text-blue-800",
    reviewed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }

  if (responses.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No responses yet</h3>
          <p className="text-muted-foreground">
            Share the public link to receive candidate submissions.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {responses.map((response) => (
          <Card key={response.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {response.candidate_name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {response.candidate_email}
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className={statusColors[response.status as keyof typeof statusColors]}
                >
                  {response.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {response.content}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Submitted {formatDistanceToNow(new Date(response.created_at), { addSuffix: true })}
                </span>
                <div className="flex gap-2">
                  {response.file_attachments && response.file_attachments.length > 0 && (
                    <Badge variant="outline">
                      {response.file_attachments.length} file(s)
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedResponse(response)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedResponse} onOpenChange={() => setSelectedResponse(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Response from {selectedResponse?.candidate_name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                <p>{selectedResponse?.candidate_email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Submission</h4>
                <div className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg mt-2">
                  {selectedResponse?.content}
                </div>
              </div>
              {selectedResponse?.file_attachments && selectedResponse.file_attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {selectedResponse.file_attachments.map((file) => (
                      <a
                        key={file.id}
                        href={file.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="flex-1 text-sm">{file.file_name}</span>
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {selectedResponse?.evaluation && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">AI Evaluation</h4>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-2">
                      Score: {selectedResponse.score}/100
                    </div>
                    <div className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(selectedResponse.evaluation, null, 2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
