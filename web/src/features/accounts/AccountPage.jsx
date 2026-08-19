import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/app-layout";
import AccountCard from "@/features/accounts/components/AccountCard";
import useAuthStore from "@/service/store/authStore";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <AppLayout>
      <main className="h-[calc(100vh-5rem)] w-full overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-5xl flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="shrink-0">
            <div className="flex items-start gap-4">
              <Button variant="outline" size="icon" asChild className="shrink-0">
                <Link to="/dashboard" aria-label="Back to dashboard">
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Account</h1>

                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                  View and manage your Mokvio account.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-6">
            <AccountCard user={user} />
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
