"use client";

import { useAppSelector } from "./use-app-selector";
import { UserRole } from "@/lib/redux/slices/authSlice";

export const useRoleCheck = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const isAdmin = isAuthenticated && user?.role === UserRole.ADMIN;
  const isUser = isAuthenticated && user?.role === UserRole.USER;

  const hasRole = (role: UserRole) => {
    return isAuthenticated && user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]) => {
    return isAuthenticated && user?.role && roles.includes(user.role);
  };

  return {
    isAdmin,
    isUser,
    hasRole,
    hasAnyRole,
  };
};
