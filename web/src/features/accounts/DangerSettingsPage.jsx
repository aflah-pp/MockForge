import { useState } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/app-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import DangerActionCard from "@/features/accounts/components/DangerActionCard";
import { deactivateAccount } from "@/service/endpoints/auth";
import useAuthStore from "@/service/store/authStore";

export default function DangerSettingsPage() {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [error, setError] = useState("");

  const handleDeactivateAccount = async () => {
    setIsDeactivating(true);
    setError("");

    try {
      await deactivateAccount();

      clearAuth();

      navigate("/login", {
        replace: true,
        state: {
          deactivated: true,
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
      } else {
        setError("Unable to deactivate your account. Please try again.");
      }
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <AppLayout>
      <main className="h-[calc(100vh-5rem)] w-full overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-5xl flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="shrink-0">
            <div className="flex items-start gap-4">
              <Button variant="outline" size="icon" asChild className="shrink-0">
                <Link to="/account" aria-label="Back to settings">
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Danger Zone</h1>

                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                  Manage sensitive actions for your MockForge account.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-6">
            <div className="space-y-6">
              <Alert variant="destructive">
                <AlertTriangle />

                <AlertTitle>Proceed with caution</AlertTitle>

                <AlertDescription>
                  Deactivating your account will prevent you from signing in until the account is
                  activated again.
                </AlertDescription>
              </Alert>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle />

                  <AlertTitle>Deactivation failed</AlertTitle>

                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <DangerActionCard isSubmitting={isDeactivating} onConfirm={handleDeactivateAccount} />
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
