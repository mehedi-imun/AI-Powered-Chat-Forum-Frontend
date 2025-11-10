"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  verifyEmailAction,
  resendVerificationEmailAction,
} from "@/app/actions/auth.actions";
import { useAppDispatch } from "@/lib/hooks/use-app-dispatch";
import { setCredentials, UserRole } from "@/lib/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const verifyEmail = async (verificationToken: string) => {
    const result = await verifyEmailAction(verificationToken);

    if (result.success && result.user && result.token) {
      setStatus("success");
      setMessage("Email verified successfully! Redirecting...");

      // Map the user data to match Redux User type
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

      // Update Redux state
      dispatch(setCredentials({ user: mappedUser, accessToken: result.token }));

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        if (result.user?.role.toLowerCase() === "admin") {
          router.push("/admin");
        } else {
          router.push("/threads");
        }
      }, 2000);
    } else {
      setStatus("error");
      setMessage(result.error || "Email verification failed");
    }
  };

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else if (!email) {
      setStatus("error");
      setMessage("Invalid verification link");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, email]);

  const handleResendEmail = async () => {
    if (!email) return;

    setIsResending(true);
    const result = await resendVerificationEmailAction(email);

    if (result.success) {
      setMessage(result.message || "Verification email sent!");
    } else {
      setMessage(result.error || "Failed to resend email");
    }

    setIsResending(false);
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {status === "loading" && "Verifying Email..."}
          {status === "success" && "Email Verified!"}
          {status === "error" && !token && "Check Your Email"}
          {status === "error" && token && "Verification Failed"}
        </CardTitle>
        <CardDescription className="text-center">
          {status === "loading" && "Please wait while we verify your email"}
          {status === "success" && "You will be redirected shortly"}
          {status === "error" && !token && "We sent you a verification email"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              Verifying your email address...
            </p>
          </div>
        )}

        {status === "success" && (
          <Alert className="bg-green-50 text-green-900 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <>
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>

            {email && !token && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center py-4">
                  <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-center text-muted-foreground">
                    We&apos;ve sent a verification link to{" "}
                    <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-center text-muted-foreground mt-2">
                    Please check your inbox and click the link to verify your
                    account.
                  </p>
                </div>

                <Button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  variant="outline"
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </div>
            )}

            {token && (
              <div className="space-y-4">
                <Button
                  onClick={() => router.push("/login")}
                  variant="outline"
                  className="w-full"
                >
                  Back to Login
                </Button>

                {email && (
                  <Button
                    onClick={handleResendEmail}
                    disabled={isResending}
                    variant="outline"
                    className="w-full"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardContent className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
