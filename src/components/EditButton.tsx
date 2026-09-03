'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'

export function EditButton({
  action,
  initialTitle,
  initialDescription,
  hasDescription = false,
}: {
  action: (formData: FormData) => void
  initialTitle: string
  initialDescription?: string
  hasDescription?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600">
          ✎
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
        </DialogHeader>
        <form
          action={(formData) => {
            action(formData)
            setOpen(false)
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={initialTitle} required />
          </div>
          {hasDescription && (
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" defaultValue={initialDescription} />
            </div>
          )}
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
