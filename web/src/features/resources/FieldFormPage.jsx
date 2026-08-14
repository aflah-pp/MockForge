import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Database } from "lucide-react";

import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import FieldForm from "@/features/resources/components/FieldForm";
import { mockResources } from "@/features/resources/data/resourceMock";

export default function FieldFormPage() {
  const { projectSlug, resourceSlug, fieldSlug } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(fieldSlug);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const resource = useMemo(
    () =>
      mockResources.find((item) => item.project_slug === projectSlug && item.slug === resourceSlug),
    [projectSlug, resourceSlug],
  );

  const field = useMemo(
    () => resource?.fields?.find((item) => item.slug === fieldSlug) ?? null,
    [resource, fieldSlug],
  );

  const pageTitle = isEdit ? "Edit Field" : "Create Field";

  const pageDescription = isEdit
    ? `Update the configuration for ${field?.name ?? "this field"}.`
    : `Add a new field to ${resource?.name ?? "this resource"}.`;

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setError("");

    try {
      if (isEdit) {
        // eslint-disable-next-line no-console
        console.log("PATCH field:", fieldSlug, data);
      } else {
        // eslint-disable-next-line no-console
        console.log("CREATE field:", data);
      }

      await new Promise((resolve) => setTimeout(resolve, 600));

      navigate(`/project/${projectSlug}/resources/${resourceSlug}`);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!resource) {
    return (
      <AppLayout>
        <main className="h-[calc(100vh-6rem)] overflow-auto">
          <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/project/${projectSlug}`}>
                <ArrowLeft className="mr-2 size-4" />
                Back to Project
              </Link>
            </Button>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Resource not found</CardTitle>
                <CardDescription>The requested resource does not exist.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (isEdit && !field) {
    return (
      <AppLayout>
        <main className="h-[calc(100vh-6rem)] overflow-auto">
          <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/project/${projectSlug}/resources/${resourceSlug}`}>
                <ArrowLeft className="mr-2 size-4" />
                Back to Resource
              </Link>
            </Button>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Field not found</CardTitle>
                <CardDescription>
                  The requested field does not exist in this resource.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="h-[calc(100vh-6rem)] overflow-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/project/${projectSlug}/resources/${resourceSlug}`}>
                <ArrowLeft className="mr-2 size-4" />
                Back to Resource
              </Link>
            </Button>
          </div>

          <div className="mb-6 flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
              <Database className="size-5 text-muted-foreground" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{pageTitle}</h1>

              <p className="mt-1 text-sm text-muted-foreground sm:text-base">{pageDescription}</p>

              <p className="mt-2 font-mono text-xs text-muted-foreground">
                /{projectSlug}/{resourceSlug}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Field Configuration</CardTitle>

              <CardDescription>
                Configure how MockForge generates values for this field.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <FieldForm
                mode={isEdit ? "edit" : "create"}
                initialData={field}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
