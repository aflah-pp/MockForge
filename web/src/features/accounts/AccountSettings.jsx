import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import AppLayout from "@/components/layout/app-layout";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AccountForm from "@/features/accounts/components/AccountForm";

const mockUser = {
  uuid: "user-001",
  username: "aflah",
  email: "aflah@example.com",
  first_name: "Muhammed",
  last_name: "Aflah",
  avatar: "",
};

export default function AccountSettingsPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      setError("");

      try {
        await new Promise((resolve) => setTimeout(resolve, 400));

        setUser(mockUser);
      } catch {
        setError("Failed to load account information.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const updatedUser = {
        ...user,
        username: formData.get("username"),
        email: formData.get("email"),
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        avatar: formData.get("avatar"),
      };

      setUser(updatedUser);
      setSuccess("Your account has been updated successfully.");

      setTimeout(() => {
        nav("/");
      }, 1500);
    } catch {
      setError("Failed to update your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <main className="flex h-[calc(100vh-5rem)] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="h-[calc(100vh-5rem)] w-full overflow-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <Button variant="outline" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Account</h1>

              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Manage your profile and account information.
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>

              <CardDescription>
                Update the information associated with your MockForge account.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                  {success}
                </div>
              )}

              <AccountForm initialData={user} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
