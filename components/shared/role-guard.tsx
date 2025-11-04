"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useRoleCheck } from "@/lib/hooks/use-role-check";
import { UserRole } from "@/lib/redux/slices/authSlice";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
  redirectTo?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
  redirectTo,
}: RoleGuardProps) {
  const router = useRouter();
  const { hasAnyRole } = useRoleCheck();

  if (!hasAnyRole(allowedRoles)) {
    if (redirectTo) {
      router.push(redirectTo);
      return null;
    }
    return fallback || <div>Access Denied</div>;
  }

  return <>{children}</>;
}
