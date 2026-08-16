import { useState } from "react";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChangePasswordForm from "./components/ChangePasswordForm";
import useAuthStore from "@/service/store/authStore";
import { changePassword } from "@/service/endpoints/auth";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      setError("");

      await changePassword({
        old_password: values.old_password,
        new_password: values.new_password,
        new_password_confirm: values.new_password_confirm,
      });

      clearAuth();

      navigate("/login", {
        replace: true,
        state: {
          passwordChanged: true,
        },
      });
    } catch (err) {
      const responseData = err?.response?.data;

      if (responseData?.detail) {
        setError(
          Array.isArray(responseData.detail)
            ? responseData.detail.join(" ")
            : String(responseData.detail),
        );

        return;
      }

      const firstError = Object.values(responseData || {})[0];

      if (firstError) {
        setError(Array.isArray(firstError) ? firstError.join(" ") : String(firstError));

        return;
      }

      setError("Unable to change your password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <main className="h-[calc(100vh-5rem)] w-full overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-3xl flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="shrink-0">
            <div className="flex items-start gap-4">
              <Button variant="outline" size="icon" asChild className="shrink-0">
                <Link to="/account" aria-label="Back to account">
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>

              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Change Password</h1>

                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                  Update your password to keep your account secure.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-md border bg-muted">
                    <KeyRound className="size-4" />
                  </div>

                  <CardTitle>Update password</CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                {error && (
                  <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <ChangePasswordForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
