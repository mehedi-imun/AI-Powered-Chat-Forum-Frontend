import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

interface AlertMessageProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  className?: string;
}

export function AlertMessage({ type, message, className = "" }: AlertMessageProps) {
  const configs = {
    success: {
      icon: CheckCircle,
      className: "bg-green-50 text-green-900 border-green-200",
    },
    error: {
      icon: AlertCircle,
      className: "border-red-200",
    },
    info: {
      icon: Info,
      className: "bg-blue-50 text-blue-900 border-blue-200",
    },
    warning: {
      icon: AlertTriangle,
      className: "bg-yellow-50 text-yellow-900 border-yellow-200",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <Alert variant={type === "error" ? "destructive" : "default"} className={`${config.className} ${className}`}>
      <Icon className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
