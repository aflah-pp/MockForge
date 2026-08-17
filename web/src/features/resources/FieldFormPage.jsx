import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Database } from "lucide-react";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FieldForm from "@/features/resources/components/FieldForm";
import { getResource } from "@/service/endpoints/resources";
import { createField, getField, updateField } from "@/service/endpoints/fields";

export default function FieldFormPage() {
  const { projectSlug, resourceSlug, fieldSlug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEdit = Boolean(fieldSlug);

  const resourceQuery = useQuery({
    queryKey: ["resources", projectSlug, resourceSlug],
    queryFn: () => getResource(projectSlug, resourceSlug),
    enabled: Boolean(projectSlug && resourceSlug),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const fieldQuery = useQuery({
    queryKey: ["fields", projectSlug, resourceSlug, fieldSlug],
    queryFn: () => getField(projectSlug, resourceSlug, fieldSlug),
    enabled: Boolean(projectSlug && resourceSlug && fieldSlug),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => createField(projectSlug, resourceSlug, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fields", projectSlug, resourceSlug],
      });

      queryClient.invalidateQueries({
        queryKey: ["resources", projectSlug, resourceSlug],
      });

      navigate(`/project/${projectSlug}/resources/${resourceSlug}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => updateField(projectSlug, resourceSlug, fieldSlug, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fields", projectSlug, resourceSlug],
      });

      queryClient.invalidateQueries({
        queryKey: ["fields", projectSlug, resourceSlug, fieldSlug],
      });

      queryClient.invalidateQueries({
        queryKey: ["resources", projectSlug, resourceSlug],
      });

      navigate(`/project/${projectSlug}/resources/${resourceSlug}`);
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error || updateMutation.error;
  const resource = resourceQuery.data;
  const field = fieldQuery.data;
  const isLoading = resourceQuery.isLoading || (isEdit && fieldQuery.isLoading);
  const resourceError = resourceQuery.error;
  const fieldError = fieldQuery.error;

  const handleSubmit = (data) => {
    if (isEdit) {
      updateMutation.mutate(data);
      return;
    }

    createMutation.mutate(data);
  };

  const getErrorMessage = (error, fallback) => {
    return (
      error?.response?.data?.detail ||
      error?.response?.data?.name?.[0] ||
      error?.response?.data?.generator_key?.[0] ||
      error?.response?.data?.generator_options?.[0] ||
      fallback
    );
  };

  if (isLoading) {
    return (
      <AppLayout>
        <main className="h-[calc(100vh-6rem)] overflow-auto">
          <div className="mx-auto flex min-h-full w-full max-w-5xl items-center justify-center px-4">
            <div className="text-center">
              <p className="font-medium">{isEdit ? "Loading field..." : "Loading resource..."}</p>

              <p className="mt-1 text-sm text-muted-foreground">Fetching configuration.</p>
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (resourceQuery.isError || !resource) {
    return (
      <AppLayout>
        <main className="h-[calc(100vh-6rem)] overflow-auto">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/project/${projectSlug}`}>
                <ArrowLeft className="mr-2 size-4" />
              </Link>
            </Button>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Resource not found</CardTitle>

                <CardDescription>
                  {getErrorMessage(
                    resourceError,
                    "The requested resource does not exist or you do not have access to it.",
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (isEdit && (fieldQuery.isError || !field)) {
    return (
      <AppLayout>
        <main className="h-[calc(100vh-6rem)] overflow-auto">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
            <Button variant="outline" size="sm" asChild>
              <Link
                to={`/project/${projectSlug}/resources/${resourceSlug}`}
                className="inline-flex items-center gap-2 whitespace-nowrap"
              >
                <ArrowLeft className="size-4 shrink-0" />
              </Link>
            </Button>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Field not found</CardTitle>

                <CardDescription>
                  {getErrorMessage(
                    fieldError,
                    "The requested field does not exist in this resource.",
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
      </AppLayout>
    );
  }

  const pageTitle = isEdit ? "Edit Field" : "Create Field";

  const pageDescription = isEdit
    ? `Update the configuration for ${field.name}.`
    : `Add a new field to ${resource.name}.`;

  return (
    <AppLayout>
      <main className="h-[calc(100vh-6rem)] overflow-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link
                to={`/project/${projectSlug}/resources/${resourceSlug}`}
                className="inline-flex items-center gap-2 whitespace-nowrap"
              >
                <ArrowLeft className="size-4 shrink-0" />
                <span>Back to Resource</span>
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
              {mutationError && (
                <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {getErrorMessage(
                    mutationError,
                    isEdit ? "Failed to update field." : "Failed to create field.",
                  )}
                </div>
              )}

              <FieldForm
                mode={isEdit ? "edit" : "create"}
                initialData={isEdit ? field : null}
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
