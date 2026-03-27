"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MoreHorizontal, Edit, Trash2, Globe, Archive, Loader2 } from "lucide-react"
import type { Task } from "@/lib/types"

interface TaskActionsProps {
  task: Task
}

export function TaskActions({ task }: TaskActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleStatusChange = async (status: string) => {
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to update task status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.push("/projects")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" disabled={isUpdating}>
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a href={`/projects/${task.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Task
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {task.status === "draft" && (
            <DropdownMenuItem onClick={() => handleStatusChange("published")}>
              <Globe className="mr-2 h-4 w-4" />
              Publish
            </DropdownMenuItem>
          )}
          {task.status === "published" && (
            <DropdownMenuItem onClick={() => handleStatusChange("draft")}>
              <Edit className="mr-2 h-4 w-4" />
              Unpublish
            </DropdownMenuItem>
          )}
          {task.status !== "archived" && (
            <DropdownMenuItem onClick={() => handleStatusChange("archived")}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
