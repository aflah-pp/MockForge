import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Database, Plus, Settings2 } from "lucide-react";
import AppLayout from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProject, publishProject, unpublishProject } from "@/service/endpoints/projects";
import { getResources } from "@/service/endpoints/resources";
import ProjectResourcesTable from "@/features/projects/components/ProjectResourceTable";

function formatDate(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
  } = useQuery({
    queryKey: ["projects", slug],
    queryFn: () => getProject(slug),
    enabled: Boolean(slug),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const {
    data: resources = [],
    isLoading: isResourcesLoading,
    isError: isResourcesError,
  } = useQuery({
    queryKey: ["projects", slug, "resources"],
    queryFn: () => getResources(slug),
    enabled: Boolean(slug),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const publishMutation = useMutation({
    mutationFn: () =>
      project?.is_published ? unpublishProject(project.slug) : publishProject(project.slug),

    onSuccess: (updatedProject) => {
      queryClient.setQueryData(["projects", slug], updatedProject);

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });

  const handleCreateResource = () => {
    if (!project) {
      return;
    }

    navigate(`/project/${project.slug}/resources/create`);
  };

  if (isProjectLoading) {
    return (
      <AppLayout>
        <main className="h-[calc(100vh-5rem)] w-full overflow-hidden">
          <div className="mx-auto flex h-full w-full max-w-[1600px] items-center justify-center px-4">
            <div className="text-center">
              <p className="font-medium">Loading project...</p>

              <p className="mt-1 text-sm text-muted-foreground">Fetching project details.</p>
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (isProjectError || !project) {
    return (
      <AppLayout>
        <main className="h-[calc(100vh-5rem)] w-full overflow-hidden">
          <div className="mx-auto flex h-full w-full max-w-[1600px] items-center justify-center px-4">
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

  const safeResources = Array.isArray(resources) ? resources : [];

  const publishedResources = safeResources.filter((resource) => resource?.is_published).length;

  const isPublishing = publishMutation.isPending;

  return (
    <AppLayout>
      <main className="h-[calc(100vh-5rem)] w-full overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="shrink-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <Button variant="outline" size="icon" asChild className="mt-0.5 shrink-0">
                  <Link to="/project" aria-label="Back to projects">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                      {project.name || "Unnamed Project"}
                    </h1>

                    <Badge variant={project.is_published ? "default" : "secondary"}>
                      {project.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>

                  <p className="mt-1 truncate font-mono text-sm text-muted-foreground">
                    /{project.slug}
                  </p>
                </div>
              </div>

              <div className="flex w-full gap-2 sm:w-auto">
                <Button
                  variant={project.is_published ? "outline" : "default"}
                  className="flex-1 sm:flex-none"
                  disabled={isPublishing}
                  onClick={() => publishMutation.mutate()}
                >
                  <Settings2 className="mr-2 h-4 w-4" />

                  {isPublishing ? "Updating..." : project.is_published ? "Unpublish" : "Publish"}
                </Button>

                <Button className="flex-1 sm:flex-none" onClick={handleCreateResource}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Resource
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-6 pb-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Project Status</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <Badge variant={project.is_published ? "default" : "secondary"}>
                      {project.is_published ? "Published" : "Draft"}
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Resources</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />

                      <span className="text-2xl font-bold">
                        {isResourcesLoading ? "—" : safeResources.length}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Published Resources</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <span className="text-2xl font-bold">
                      {isResourcesLoading ? "—" : publishedResources}
                    </span>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Created</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <span className="text-sm font-medium">{formatDate(project.created_at)}</span>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>Project Details</CardTitle>

                      <CardDescription>Basic information about this project.</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Name</p>

                      <p className="mt-1 font-medium">{project.name || "—"}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Slug</p>

                      <p className="mt-1 font-mono text-sm">{project.slug || "—"}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Created At</p>

                      <p className="mt-1 text-sm">{formatDateTime(project.created_at)}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Updated At</p>

                      <p className="mt-1 text-sm">{formatDateTime(project.updated_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isResourcesError ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="font-medium">Unable to load resources</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Please try refreshing the page.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <ProjectResourcesTable project={project} resources={safeResources} />
              )}
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
