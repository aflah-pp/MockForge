import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";

import AccountForm from "@/features/accounts/components/AccountForm";

import useAuthStore from "@/service/store/authStore";
import { updateCurrentUser } from "@/service/endpoints/auth";

export default function AccountSettingsPage() {
  const navigate = useNavigate();

  const { user, setUser } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      const updatedUser = await updateCurrentUser(formData);

      setUser(updatedUser);

      navigate("/account", {
        replace: true,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to update account:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <main className="h-[calc(100vh-5rem)] w-full overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-5xl flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="shrink-0">
            <div className="flex items-start gap-4">
              <Button variant="outline" size="icon" asChild className="shrink-0">
                <Link to="/account" aria-label="Back to account">
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Edit Account</h1>

                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                  Update your Mokvio account information.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-6">
            <AccountForm initialData={user} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
