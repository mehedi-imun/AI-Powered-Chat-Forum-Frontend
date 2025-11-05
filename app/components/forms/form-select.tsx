"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface FormSelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: FormSelectOption[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormSelect({
  name,
  label,
  placeholder = "Select an option",
  options,
  required,
  disabled,
  className = "",
}: FormSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              className={error ? "border-red-500 focus:ring-red-500" : ""}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
