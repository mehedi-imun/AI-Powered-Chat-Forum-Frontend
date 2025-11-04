# Reusable Form System (Phase 4)

## Overview

A complete, type-safe form system built with **React Hook Form**, **Zod**, and **ShadcnUI** components. All form components are reusable, accessible, and include automatic error handling.

## Components

### 1. FormWrapper

The main wrapper component that provides React Hook Form context.

```tsx
import { FormWrapper } from "@/components/forms";

<FormWrapper form={form} onSubmit={onSubmit} className="space-y-4">
  {/* Form fields */}
</FormWrapper>
```

**Props:**
- `form`: UseFormReturn from React Hook Form
- `onSubmit`: Submit handler function
- `children`: Form fields
- `className`: Optional CSS classes

### 2. FormInput

Reusable text input with validation.

```tsx
import { FormInput } from "@/components/forms";

<FormInput
  name="email"
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  required
/>
```

**Props:**
- `name`: Field name (must match schema)
- `label`: Display label
- `type`: Input type (text, email, password, etc.)
- `placeholder`: Placeholder text
- `required`: Show asterisk if true
- `disabled`: Disable input
- `className`: Optional CSS classes

### 3. FormTextarea

Reusable textarea with validation.

```tsx
import { FormTextarea } from "@/components/forms";

<FormTextarea
  name="content"
  label="Content"
  placeholder="Enter your content..."
  rows={6}
  required
/>
```

**Props:**
- `name`: Field name
- `label`: Display label
- `placeholder`: Placeholder text
- `rows`: Number of rows (default: 4)
- `required`: Show asterisk if true
- `disabled`: Disable textarea
- `className`: Optional CSS classes

### 4. FormSelect

Reusable select dropdown with validation.

```tsx
import { FormSelect } from "@/components/forms";

<FormSelect
  name="category"
  label="Category"
  placeholder="Select a category"
  options={[
    { label: "General", value: "general" },
    { label: "Tech", value: "tech" },
  ]}
  required
/>
```

**Props:**
- `name`: Field name
- `label`: Display label
- `placeholder`: Placeholder text
- `options`: Array of { label, value } objects
- `required`: Show asterisk if true
- `disabled`: Disable select
- `className`: Optional CSS classes

### 5. FormCheckbox

Reusable checkbox with validation.

```tsx
import { FormCheckbox } from "@/components/forms";

<FormCheckbox
  name="agreeToTerms"
  label="I agree to the terms"
  description="By checking this, you agree to our Terms of Service."
  required
/>
```

**Props:**
- `name`: Field name
- `label`: Display label
- `description`: Optional helper text
- `required`: Show asterisk if true
- `disabled`: Disable checkbox
- `className`: Optional CSS classes

## Usage Example

### 1. Create a Zod Schema

```tsx
// lib/schemas/thread.schema.ts
import { z } from "zod";

export const createThreadSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  tags: z.string().optional(),
});

export type CreateThreadFormData = z.infer<typeof createThreadSchema>;
```

### 2. Setup Form in Component

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormWrapper, FormInput, FormTextarea, FormSelect } from "@/components/forms";
import { createThreadSchema, CreateThreadFormData } from "@/lib/schemas/thread.schema";

export default function CreateThreadPage() {
  const form = useForm<CreateThreadFormData>({
    resolver: zodResolver(createThreadSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: "",
    },
  });

  const onSubmit = async (data: CreateThreadFormData) => {
    console.log("Form data:", data);
    // API call here
  };

  return (
    <FormWrapper form={form} onSubmit={onSubmit} className="space-y-6">
      <FormInput
        name="title"
        label="Thread Title"
        placeholder="Enter title"
        required
      />
      
      <FormSelect
        name="category"
        label="Category"
        options={[
          { label: "General", value: "general" },
          { label: "Tech", value: "tech" },
        ]}
        required
      />
      
      <FormTextarea
        name="content"
        label="Content"
        rows={8}
        required
      />
      
      <FormInput
        name="tags"
        label="Tags"
        placeholder="Comma-separated"
      />
      
      <Button type="submit">Create Thread</Button>
    </FormWrapper>
  );
}
```

## Features

✅ **Type-Safe**: Full TypeScript support with inferred types from Zod schemas  
✅ **Validation**: Automatic validation with Zod  
✅ **Error Display**: Errors automatically shown below fields  
✅ **Accessible**: Built on ShadcnUI (Radix UI) components  
✅ **Reusable**: DRY - no repeated form code  
✅ **Consistent**: Same styling and behavior across all forms  
✅ **Developer-Friendly**: Simple API, easy to use  

## Examples

See working examples at:
- `/forms-example` - Basic form showcase
- `/create-thread-example` - Real-world thread creation form

## File Structure

```
components/forms/
├── form-wrapper.tsx      # FormProvider wrapper
├── form-input.tsx        # Text input
├── form-textarea.tsx     # Textarea
├── form-select.tsx       # Select dropdown
├── form-checkbox.tsx     # Checkbox
└── index.ts              # Barrel export

lib/schemas/
├── auth.schema.ts        # Auth validation schemas
├── thread.schema.ts      # Thread validation schemas
└── user.schema.ts        # User validation schemas
```

## Benefits

1. **Less Boilerplate**: No need to repeat input/label/error code
2. **Consistency**: All forms look and behave the same
3. **Type Safety**: Catch errors at compile time
4. **Validation**: Zod handles all validation logic
5. **Maintainability**: Update one component, all forms benefit

## Next Steps

- Add more specialized components (DatePicker, MultiSelect, etc.)
- Add field arrays support for dynamic forms
- Add wizard/stepper form support
- Add file upload component
