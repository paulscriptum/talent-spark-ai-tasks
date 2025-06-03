import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TaskSection } from '../types';

interface EditSectionFormProps {
  section: TaskSection;
  onSave: (sectionId: string, content: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const EditSectionForm: React.FC<EditSectionFormProps> = ({ section, onSave, onCancel, isSaving }) => {
  const form = useForm<{ content: string }>({
    defaultValues: {
      content: section.content,
    },
  });

  const onSubmit = (data: { content: string }) => {
    onSave(section.id, data.content);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[150px] form-input"
                  autoFocus
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditSectionForm; 