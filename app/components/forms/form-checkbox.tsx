"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";

interface FormCheckboxProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormCheckbox({
  name,
  label,
  description,
  required,
  disabled,
  className = "",
}: FormCheckboxProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex items-start space-x-3">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={error ? "border-red-500" : ""}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor={name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label} {required && <span className="text-red-500">*</span>}
              </Label>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        )}
      />
      {error && <p className="text-sm text-red-500 ml-7">{error}</p>}
    </div>
  );
}
