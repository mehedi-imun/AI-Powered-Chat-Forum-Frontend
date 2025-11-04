"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createThreadAction } from "@/app/actions/thread.actions";
import {
  createThreadSchema,
  type CreateThreadFormData,
} from "@/lib/schemas/thread.schema";
import { FormWrapper } from "@/components/forms/form-wrapper";
import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CreateThreadPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

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
    setError(null);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    if (data.tags) {
      formData.append("tags", data.tags);
    }

    try {
      const result = await createThreadAction(formData);

      if (!result?.success) {
        setError(result?.error || "Failed to create thread");
        return;
      }

      // Server action will redirect automatically
    } catch {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/threads">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Thread</h1>
          <p className="text-gray-600 mt-2">
            Start a new discussion in the community
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thread Details</CardTitle>
          <CardDescription>
            Fill in the details below to create your thread
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormWrapper form={form} onSubmit={onSubmit} className="space-y-6">
            <FormInput
              name="title"
              label="Title"
              placeholder="Enter a descriptive title for your thread"
              required
            />

            <FormTextarea
              name="content"
              label="Content"
              placeholder="Write your thread content here. Be clear and descriptive."
              rows={10}
              required
            />

            <FormInput
              name="tags"
              label="Tags"
              placeholder="javascript, react, nextjs (comma-separated)"
            />

            <FormInput
              name="category"
              label="Category"
              placeholder="Select a category"
              required
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {form.formState.errors.root && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex items-center gap-2"
              >
                {form.formState.isSubmitting ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Create Thread
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </FormWrapper>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Tips for Creating Threads</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 space-y-2 text-sm">
          <ul className="list-disc list-inside space-y-1">
            <li>Use a clear, descriptive title that summarizes your topic</li>
            <li>Provide enough context in the content for others to understand</li>
            <li>Add relevant tags to help others find your thread</li>
            <li>Be respectful and follow community guidelines</li>
            <li>Use proper formatting for code snippets if applicable</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
