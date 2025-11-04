"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FormTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormTextarea({
  name,
  label,
  placeholder,
  rows = 4,
  required,
  disabled,
  className = "",
}: FormTextareaProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        {...register(name)}
        className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
