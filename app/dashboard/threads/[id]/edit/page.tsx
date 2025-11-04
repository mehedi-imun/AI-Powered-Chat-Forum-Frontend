"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import {
  updateThreadAction,
  deleteThreadAction,
} from "@/app/actions/thread.actions";
import {
  updateThreadSchema,
  type UpdateThreadFormData,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EditThreadPage() {
  const router = useRouter();
  const params = useParams();
  const threadId = params.id as string;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<UpdateThreadFormData>({
    resolver: zodResolver(updateThreadSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (data: UpdateThreadFormData) => {
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);

    try {
      const result = await updateThreadAction(threadId, formData);

      if (!result?.success) {
        setError(result?.error || "Failed to update thread");
        return;
      }

      setSuccess("Thread updated successfully!");
      setTimeout(() => {
        router.push("/dashboard/threads");
      }, 1500);
    } catch {
      setError("An unexpected error occurred");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteThreadAction(threadId);

      if (!result?.success) {
        setError(result?.error || "Failed to delete thread");
        setIsDeleting(false);
        return;
      }

      // Server action will redirect automatically
    } catch {
      setError("An unexpected error occurred");
      setIsDeleting(false);
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
          <h1 className="text-3xl font-bold">Edit Thread</h1>
          <p className="text-gray-600 mt-2">
            Update your thread details or delete it
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thread Details</CardTitle>
          <CardDescription>
            Make changes to your thread below
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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {form.formState.errors.root && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex items-center gap-2"
                >
                  {form.formState.isSubmitting ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
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

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex items-center gap-2"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Thread
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your thread and all associated replies.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? "Deleting..." : "Delete Thread"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </FormWrapper>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-900">Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-800 space-y-2 text-sm">
          <ul className="list-disc list-inside space-y-1">
            <li>Changes will be visible to all users immediately</li>
            <li>Deleting a thread cannot be undone</li>
            <li>All replies to this thread will also be deleted</li>
            <li>Make sure your edits follow community guidelines</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
