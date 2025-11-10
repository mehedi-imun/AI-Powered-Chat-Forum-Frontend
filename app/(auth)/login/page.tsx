"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth.actions";
import { useAppDispatch } from "@/lib/hooks/use-app-dispatch";
import { setCredentials, UserRole } from "@/lib/redux/slices/authSlice";
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogIn } from "lucide-react";
export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //  Autofill helper
  const handleAutofill = (type: "admin" | "user") => {
    if (type === "admin") {
      setValue("email", "mehediimun@gmail.com");
      setValue("password", "123456");
    } else {
      setValue("email", "mehediimun.ph@gmail.com");
      setValue("password", "123456");
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await loginAction(formData);
    if (result.success && result.user && result.token) {
      let userRole = UserRole.MEMBER;
      if (result.user.role.toLowerCase() === "admin") {
        userRole = UserRole.ADMIN;
      } else if (result.user.role.toLowerCase() === "moderator") {
        userRole = UserRole.MODERATOR;
      }

      const mappedUser = {
        _id: result.user._id,
        username: result.user.username,
        email: result.user.email,
        role: userRole,
        displayName: result.user.displayName,
        avatar: result.user.avatar,
      };

      dispatch(setCredentials({ user: mappedUser, accessToken: result.token }));

      if (!result.user.emailVerified) {
        router.push(
          `/verify-email?email=${encodeURIComponent(result.user.email)}`
        );
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get("redirect");
      if (redirectTo) {
        router.push(redirectTo);
      } else if (result.user.role.toLowerCase() === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      setError(result.error || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center my-10 mx-5">
      <Card className="w-full max-w-lg p-6">
        {/* Header */}
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>

        {/* Login Form */}
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="border-t my-6" />

          {/* Credentials Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
            {/* Admin */}
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Admin</h3>
              <p className="text-sm text-muted-foreground">
                mehediimun@gmail.com
              </p>
              <p className="text-sm text-muted-foreground mb-2">123456</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleAutofill("admin")}
              >
                Autofill Admin
              </Button>
            </div>

            {/* User */}
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">User</h3>
              <p className="text-sm text-muted-foreground">
                mehediimun.ph@gmail.com
              </p>
              <p className="text-sm text-muted-foreground mb-2">123456</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleAutofill("user")}
              >
                Autofill User
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-col space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
