"use client";

import { useAppSelector } from "./use-app-selector";
import { useAppDispatch } from "./use-app-dispatch";
import { logout as logoutRedux } from "@/lib/redux/slices/authSlice";
import { logoutAction } from "@/app/actions/auth.actions";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, accessToken } = useAppSelector(
    (state) => state.auth
  );

  const logout = async () => {
    // Clear Redux state first
    dispatch(logoutRedux());
    // Then call server action to clear cookies and redirect
    await logoutAction();
  };

  return { user, isAuthenticated, accessToken, logout };
};
