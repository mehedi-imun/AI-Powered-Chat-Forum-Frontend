import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  icon?: ReactNode;
  helper?: string;
  children: ReactNode;
}

export function FormField({
  label,
  id,
  error,
  required,
  icon,
  helper,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={icon ? "flex items-center gap-2" : ""}>
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {helper && !error && <p className="text-xs text-gray-500">{helper}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  id: string;
  name: string;
  type?: "text" | "email" | "password" | "url" | "tel" | "number";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  helper?: string;
  minLength?: number;
  maxLength?: number;
}

export function TextField({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required,
  disabled,
  icon,
  helper,
  minLength,
  maxLength,
}: TextFieldProps) {
  return (
    <FormField
      label={label}
      id={id}
      error={error}
      required={required}
      icon={icon}
      helper={helper}
    >
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
      />
    </FormField>
  );
}

interface TextAreaFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  helper?: string;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
}

export function TextAreaField({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  required,
  disabled,
  icon,
  helper,
  rows = 4,
  maxLength,
  showCharCount,
}: TextAreaFieldProps) {
  const charCount =
    showCharCount && maxLength
      ? `${value.length}/${maxLength} characters`
      : undefined;

  return (
    <FormField
      label={label}
      id={id}
      error={error}
      required={required}
      icon={icon}
      helper={charCount || helper}
    >
      <Textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
      />
    </FormField>
  );
}
