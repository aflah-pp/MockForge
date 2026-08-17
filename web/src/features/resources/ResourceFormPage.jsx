import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createResource, getResource, renameResource } from "@/service/endpoints/resources";

export default function ResourceFormPage() {
  const { projectSlug, resourceSlug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const isEditing = Boolean(resourceSlug);

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const {
    data: resource,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["resources", projectSlug, resourceSlug],
    queryFn: () => getResource(projectSlug, resourceSlug),
    enabled: isEditing && Boolean(projectSlug && resourceSlug),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (resource) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(resource.name || "");
    }
  }, [resource]);

  useEffect(() => {
    if (fetchError) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(fetchError?.response?.data?.detail || "Failed to load resource.");
    }
  }, [fetchError]);

  const mutation = useMutation({
    mutationFn: (payload) => {
      if (isEditing) {
        return renameResource(projectSlug, resourceSlug, payload);
      }

      return createResource(projectSlug, payload);
    },

    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["resources", projectSlug],
      });

      await queryClient.invalidateQueries({
        queryKey: ["projects", projectSlug],
      });

      const nextSlug = data?.slug || resourceSlug;

      navigate(`/project/${projectSlug}/resources/${nextSlug}`);
    },

    onError: (mutationError) => {
      const responseData = mutationError?.response?.data;

      setError(responseData?.detail || responseData?.name?.[0] || "Failed to save resource.");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Resource name is required.");
      return;
    }

    if (trimmedName.length > 50) {
      setError("Resource name must be 50 characters or less.");
      return;
    }

    setError("");

    mutation.mutate({
      name: trimmedName,
    });
  };

  if (isEditing && isLoading) {
    return (
      <AppLayout>
        <main className="h-[calc(100vh-6rem)] w-full overflow-auto">
          <div className="mx-auto flex min-h-full w-full max-w-3xl items-center justify-center px-4">
            <div className="text-center">
              <p className="font-medium">Loading resource...</p>

              <p className="mt-1 text-sm text-muted-foreground">Fetching resource information.</p>
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (isEditing && (isError || !resource)) {
    return (
      <AppLayout>
        <main className="h-[calc(100vh-6rem)] w-full overflow-auto">
          <div className="mx-auto flex min-h-full w-full max-w-3xl items-center justify-center px-4">
            <div className="text-center">
              <p className="font-medium">Resource not found</p>

              <p className="mt-1 text-sm text-muted-foreground">
                {fetchError?.response?.data?.detail ||
                  "The resource may have been deleted or you do not have access to it."}
              </p>

              <Button className="mt-4" variant="outline" asChild>
                <Link to={`/project/${projectSlug}`}>
                  <ArrowLeft className="mr-2 size-4" />
                  Back to Project
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  const isSubmitting = mutation.isPending;

  return (
    <AppLayout>
      <main className="h-[calc(100vh-6rem)] overflow-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/project/${projectSlug}`}>
                <ArrowLeft className="mr-2 size-4" />
                Back to Project
              </Link>
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {isEditing ? "Edit Resource" : "Create Resource"}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              {isEditing
                ? "Update your resource information."
                : "Create a new resource for your mock API."}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resource Information</CardTitle>

              <CardDescription>
                {isEditing
                  ? "Changing the name will regenerate the resource URL slug."
                  : "Give your resource a name. The URL slug will be generated automatically."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Resource Name</Label>

                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setError("");
                    }}
                    placeholder="Products"
                    autoComplete="off"
                    disabled={isSubmitting}
                    maxLength={50}
                  />

                  <p className="text-xs text-muted-foreground">
                    Examples: Products, Customers, Orders, Drivers.
                  </p>
                </div>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? isEditing
                        ? "Updating..."
                        : "Creating..."
                      : isEditing
                        ? "Update Resource"
                        : "Create Resource"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
