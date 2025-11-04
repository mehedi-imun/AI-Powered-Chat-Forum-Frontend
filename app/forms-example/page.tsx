"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormWrapper,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const demoFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters"),
  email: z.string().email("Invalid email address"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(200, "Bio must not exceed 200 characters"),
  role: z.string().min(1, "Please select a role"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type DemoFormData = z.infer<typeof demoFormSchema>;

export default function FormsExamplePage() {
  const form = useForm<DemoFormData>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      role: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: DemoFormData) => {
    console.log("Form submitted:", data);
    alert(`Form submitted successfully!\n\nData: ${JSON.stringify(data, null, 2)}`);
    form.reset();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Reusable Form System Demo</CardTitle>
          <CardDescription>
            Phase 4 implementation - showcasing all form components with Zod validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormWrapper form={form} onSubmit={onSubmit} className="space-y-6">
            <FormInput
              name="username"
              label="Username"
              placeholder="Enter your username"
              required
            />

            <FormInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
            />

            <FormTextarea
              name="bio"
              label="Bio"
              placeholder="Tell us about yourself..."
              rows={5}
              required
            />

            <FormSelect
              name="role"
              label="Role"
              placeholder="Select your role"
              options={[
                { label: "Developer", value: "developer" },
                { label: "Designer", value: "designer" },
                { label: "Manager", value: "manager" },
                { label: "Other", value: "other" },
              ]}
              required
            />

            <FormCheckbox
              name="agreeToTerms"
              label="I agree to the terms and conditions"
              description="By checking this box, you agree to our Terms of Service and Privacy Policy."
              required
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit Form"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={form.formState.isSubmitting}
              >
                Reset
              </Button>
            </div>

            {form.formState.isSubmitSuccessful && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                Form submitted successfully! Check the console for data.
              </div>
            )}
          </FormWrapper>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Form System Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>
                <strong>FormWrapper:</strong> FormProvider wrapper for React Hook Form
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>
                <strong>FormInput:</strong> Reusable input with validation errors
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>
                <strong>FormTextarea:</strong> Reusable textarea with validation
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>
                <strong>FormSelect:</strong> Reusable select dropdown with Controller
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>
                <strong>FormCheckbox:</strong> Reusable checkbox with description
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>
                <strong>Zod Integration:</strong> Type-safe validation with zodResolver
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>
                <strong>Error Handling:</strong> Automatic error display below fields
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>
                <strong>TypeScript:</strong> Fully typed with inferred form data types
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
