"use client";

import { ReactNode } from "react";
import { FormProvider, UseFormReturn, FieldValues } from "react-hook-form";

interface FormWrapperProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: ReactNode;
  className?: string;
}

export function FormWrapper<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className = "",
}: FormWrapperProps<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
}
