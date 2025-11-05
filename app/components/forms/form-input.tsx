"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormInput({
  name,
  label,
  type = "text",
  placeholder,
  required,
  disabled,
  className = "",
}: FormInputProps) {
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
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name)}
        className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
