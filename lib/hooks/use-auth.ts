"use client";

import { useAppSelector } from "./use-app-selector";
import { useAppDispatch } from "./use-app-dispatch";
import { logout as logoutAction } from "@/lib/redux/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, accessToken } = useAppSelector(
    (state) => state.auth
  );

  const logout = () => {
    dispatch(logoutAction());
  };

  return { user, isAuthenticated, accessToken, logout };
};
