import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import ProjectForm from "@/features/projects/components/ProjectForm";
import { createProject, getProject, renameProject } from "@/service/endpoints/projects";

function getProjectError(error) {
  const data = error?.response?.data;

  if (!data) {
    return "Something went wrong. Please try again.";
  }

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (typeof data.name === "string") {
    return data.name;
  }

  if (Array.isArray(data.name) && data.name.length > 0) {
    return data.name[0];
  }

  if (typeof data === "object") {
    const firstError = Object.values(data).flat()[0];

    if (typeof firstError === "string") {
      return firstError;
    }
  }

  return "Something went wrong. Please try again.";
}

export default function ProjectFormPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEditMode = Boolean(slug);

  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
  } = useQuery({
    queryKey: ["projects", slug],
    queryFn: () => getProject(slug),
    enabled: isEditMode,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (isEditMode) {
        return renameProject(slug, payload);
      }

      return createProject(payload);
    },

    onSuccess: async (updatedProject) => {
      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      if (updatedProject?.slug) {
        queryClient.setQueryData(["projects", updatedProject.slug], updatedProject);
      }

      navigate(`/project/${updatedProject.slug}`);
    },
  });

  useEffect(() => {
    if (!isEditMode) {
      queryClient.removeQueries({
        queryKey: ["projects", undefined],
      });
    }
  }, [isEditMode, queryClient]);

  const handleSubmit = (data) => {
    mutation.mutate(data);
  };

  const error = mutation.isError ? getProjectError(mutation.error) : "";

  if (isEditMode && isProjectLoading) {
    return (
      <AppLayout>
        <main className="h-[calc(100vh-6rem)] w-full overflow-auto">
          <div className="mx-auto flex min-h-full w-full max-w-5xl items-center justify-center px-4">
            <div className="text-center">
              <p className="font-medium">Loading project...</p>

              <p className="mt-1 text-sm text-muted-foreground">Fetching project information.</p>
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (isEditMode && (isProjectError || !project)) {
    return (
      <AppLayout>
        <main className="h-[calc(100vh-6rem)] w-full overflow-auto">
          <div className="mx-auto flex min-h-full w-full max-w-5xl items-center justify-center px-4">
            <div className="text-center">
              <p className="font-medium">Project not found</p>

              <p className="mt-1 text-sm text-muted-foreground">
                {projectError?.response?.data?.detail ||
                  "The project may have been deleted or you do not have access to it."}
              </p>

              <Button className="mt-4" variant="outline" onClick={() => navigate("/project")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="h-[calc(100vh-6rem)] w-full overflow-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <Button variant="outline" size="icon" asChild>
              <Link
                to={isEditMode ? `/project/${slug}` : "/project"}
                aria-label={isEditMode ? "Back to project" : "Back to projects"}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {isEditMode ? "Edit Project" : "Create Project"}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                {isEditMode
                  ? "Update your project information."
                  : "Create a new project for your mock API."}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>

              <CardDescription>
                {isEditMode
                  ? "Update the name of your project."
                  : "Give your project a name to get started."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <ProjectForm
                mode={isEditMode ? "edit" : "create"}
                initialValues={{
                  name: project?.name || "",
                }}
                onSubmit={handleSubmit}
                isSubmitting={mutation.isPending}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
