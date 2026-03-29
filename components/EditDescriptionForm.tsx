"use client";

import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EditDescriptionFormProps {
  description: string;
  onSave: (description: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export default function EditDescriptionForm({
  description,
  onSave,
  onCancel,
  isSaving,
}: EditDescriptionFormProps) {
  const form = useForm<{ description: string }>({
    defaultValues: { description },
  });

  const onSubmit = (data: { description: string }) => {
    onSave(data.description);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} className="min-h-[150px] form-input" autoFocus />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
