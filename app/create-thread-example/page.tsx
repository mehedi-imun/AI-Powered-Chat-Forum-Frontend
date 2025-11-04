"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  FormWrapper,
  FormInput,
  FormTextarea,
  FormSelect,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus } from "lucide-react";
import {
  createThreadSchema,
  type CreateThreadFormData,
} from "@/lib/schemas/thread.schema";

const categories = [
  { label: "General Discussion", value: "general" },
  { label: "Technology", value: "technology" },
  { label: "Programming", value: "programming" },
  { label: "Design", value: "design" },
  { label: "Business", value: "business" },
  { label: "Off-Topic", value: "off-topic" },
];

export default function CreateThreadExamplePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateThreadFormData>({
    resolver: zodResolver(createThreadSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      category: "",
    },
  });

  const onSubmit = async (data: CreateThreadFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      console.log("Creating thread:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert(
        `Thread created successfully!\n\nTitle: ${data.title}\nCategory: ${data.category}\nTags: ${data.tags}`
      );

      form.reset();
    } catch {
      setError("Failed to create thread. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Thread
          </CardTitle>
          <CardDescription>
            Example implementation using the reusable form system (Phase 4)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormWrapper form={form} onSubmit={onSubmit} className="space-y-6">
            <FormInput
              name="title"
              label="Thread Title"
              placeholder="Enter a descriptive title for your thread"
              required
              disabled={isLoading}
            />

            <FormSelect
              name="category"
              label="Category"
              placeholder="Select a category"
              options={categories}
              required
              disabled={isLoading}
            />

            <FormTextarea
              name="content"
              label="Content"
              placeholder="Share your thoughts, ask a question, or start a discussion..."
              rows={10}
              required
              disabled={isLoading}
            />

            <FormInput
              name="tags"
              label="Tags"
              placeholder="e.g., javascript, react, nextjs (comma-separated)"
              disabled={isLoading}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Thread
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </FormWrapper>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Implementation Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Schema Definition</h3>
            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-xs overflow-x-auto">
              {`// lib/schemas/thread.schema.ts
export const createThreadSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(20).max(10000),
  tags: z.string().optional(),
  category: z.string().min(1),
});`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Form Setup</h3>
            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-xs overflow-x-auto">
              {`const form = useForm<CreateThreadFormData>({
  resolver: zodResolver(createThreadSchema),
  defaultValues: { ... },
});`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Usage with Components</h3>
            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-xs overflow-x-auto">
              {`<FormWrapper form={form} onSubmit={onSubmit}>
  <FormInput name="title" label="Title" required />
  <FormSelect name="category" options={...} />
  <FormTextarea name="content" rows={10} />
</FormWrapper>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
