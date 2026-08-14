import { useState } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import AppLayout from "@/components/layout/app-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import DangerActionCard from "@/features/accounts/components/DangerActionCard";

export default function DangerSettingsPage() {
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleDeactivateAccount = async () => {
    setIsDeactivating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
                <Link to="/" aria-label="Back to settings">
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

              <DangerActionCard isSubmitting={isDeactivating} onConfirm={handleDeactivateAccount} />
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
