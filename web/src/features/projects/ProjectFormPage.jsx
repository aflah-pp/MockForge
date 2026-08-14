import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectForm from "@/features/projects/components/ProjectForm";

export default function ProjectFormPage() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/v1/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData?.detail || responseData?.name?.[0] || "Failed to create project.",
        );
      }

      navigate(`/project/${responseData.slug}`);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <main className="h-[calc(100vh-6rem)] w-full overflow-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <Button variant="outline" size="icon" asChild>
              <Link to="/project">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create Project</h1>

              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Create a new project for your mock API.
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>

              <CardDescription>Give your project a name to get started.</CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <ProjectForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
