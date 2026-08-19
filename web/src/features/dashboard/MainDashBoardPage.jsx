import { useMemo } from "react";
import { Activity, ArrowUpRight, Box, Database, FileCode2, FolderKanban, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboard } from "@/service/endpoints/dashboard";
import { Link } from "react-router-dom";

function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function MainDashBoardPage() {
  const {
    data: dashboardData,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const stats = useMemo(() => {
    if (!dashboardData) {
      return [];
    }

    const { stats } = dashboardData;

    return [
      {
        title: "Projects",
        value: stats.projects,
        description: `${stats.published_projects} published`,
        icon: FolderKanban,
      },
      {
        title: "Resources",
        value: stats.resources,
        description: `${stats.published_resources} published`,
        icon: Database,
      },
      {
        title: "Fields",
        value: stats.fields,
        description: "Across all resources",
        icon: FileCode2,
      },
      {
        title: "API Requests",
        value: stats.api_requests.toLocaleString(),
        description: "Mock API requests",
        icon: Activity,
      },
    ];
  }, [dashboardData]);

  const maxFields = useMemo(() => {
    if (!dashboardData?.resource_distribution?.length) {
      return 1;
    }

    return Math.max(...dashboardData.resource_distribution.map((project) => project.fields), 1);
  }, [dashboardData]);

  if (loading) {
    return (
      <AppLayout>
        <main className="min-h-full w-full">
          <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="space-y-2">
              <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
              <div className="h-5 w-96 max-w-full animate-pulse rounded-md bg-muted" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                    <div className="size-4 animate-pulse rounded bg-muted" />
                  </CardHeader>

                  <CardContent>
                    <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                    <div className="mt-2 h-3 w-28 animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <Card>
                <CardHeader>
                  <div className="h-6 w-40 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
                </CardHeader>

                <CardContent>
                  <div className="h-32 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-6 w-44 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-4 w-56 animate-pulse rounded bg-muted" />
                </CardHeader>

                <CardContent>
                  <div className="h-32 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (isError) {
    return (
      <AppLayout>
        <main className="min-h-full w-full">
          <div className="mx-auto flex min-h-[70vh] w-full max-w-[1600px] items-center justify-center px-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Unable to load dashboard</CardTitle>

                <CardDescription>
                  {error?.response?.data?.detail ||
                    error?.message ||
                    "Failed to load dashboard data."}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Button onClick={() => refetch()}>Try again</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { user, stats: dashboardStats, recent_projects, resource_distribution } = dashboardData;

  return (
    <AppLayout>
      <main className="min-h-full w-full">
        <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>

              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Welcome back, {user.username}. Here's what's happening with your Mokvio projects.
              </p>
            </div>

            <Link to="/project/create">
              <Button>
                <Plus className="mr-2 size-4" />
                Create Project
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>

                    <Icon className="size-4 text-muted-foreground" />
                  </CardHeader>

                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>

                    <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle>Recent Projects</CardTitle>

                    <CardDescription>Your most recently updated projects.</CardDescription>
                  </div>

                  <Link to="/project/list">
                    <Button variant="outline" size="sm">
                      View all
                      <ArrowUpRight className="ml-2 size-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {recent_projects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                    <FolderKanban className="mb-3 size-8 text-muted-foreground" />

                    <p className="font-medium">No projects yet</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Create your first Mokvio project to get started.
                    </p>

                    <Link to="/project/create">
                      <Button className="mt-4">
                        <Plus className="mr-2 size-4" />
                        Create Project
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y">
                    {recent_projects.map((project) => (
                      <Link
                        key={project.uuid}
                        to={`/project/${project.slug}`}
                        className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40 transition-colors group-hover:bg-background">
                          <FolderKanban className="size-5 text-muted-foreground" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold group-hover:underline">
                              {project.name}
                            </p>

                            <Badge
                              variant={project.is_published ? "default" : "secondary"}
                              className="shrink-0 text-[11px]"
                            >
                              {project.is_published ? "Published" : "Draft"}
                            </Badge>
                          </div>

                          <p className="mt-1 truncate text-[11px] text-muted-foreground">
                            /{project.slug}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                            <span>
                              {project.resources}{" "}
                              {project.resources === 1 ? "resource" : "resources"}
                            </span>

                            <span className="text-border">•</span>

                            <span>
                              {project.fields} {project.fields === 1 ? "field" : "fields"}
                            </span>

                            <span className="text-border">•</span>

                            <span>{formatDate(project.updated_at)}</span>
                          </div>
                        </div>

                        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Distribution</CardTitle>

                <CardDescription>Resources and fields across your projects.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                {resource_distribution.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No project data available.
                  </div>
                ) : (
                  resource_distribution.map((project) => {
                    const percentage =
                      project.fields === 0 ? 0 : (project.fields / maxFields) * 100;

                    return (
                      <div key={project.slug} className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{project.name}</p>

                            <p className="text-xs text-muted-foreground">
                              {project.resources}{" "}
                              {project.resources === 1 ? "resource" : "resources"}
                            </p>
                          </div>

                          <span className="text-sm font-medium">{project.fields}</span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {project.fields} {project.fields === 1 ? "field" : "fields"}
                        </p>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Published Projects</CardTitle>

                <CardDescription>Projects currently available publicly.</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                    <Box className="size-6" />
                  </div>

                  <div>
                    <p className="text-2xl font-bold">{dashboardStats.published_projects}</p>

                    <p className="text-xs text-muted-foreground">
                      of {dashboardStats.projects} projects
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Draft Projects</CardTitle>

                <CardDescription>Projects still under development.</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                    <FolderKanban className="size-6" />
                  </div>

                  <div>
                    <p className="text-2xl font-bold">{dashboardStats.draft_projects}</p>

                    <p className="text-xs text-muted-foreground">waiting for publication</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schema Size</CardTitle>

                <CardDescription>Total fields defined in Mokvio.</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                    <FileCode2 className="size-6" />
                  </div>

                  <div>
                    <p className="text-2xl font-bold">{dashboardStats.fields}</p>

                    <p className="text-xs text-muted-foreground">field definitions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mock API Overview</CardTitle>

              <CardDescription>
                High-level information about your generated API ecosystem.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Projects</p>

                  <p className="mt-1 text-xl font-semibold">{dashboardStats.projects}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Resources</p>

                  <p className="mt-1 text-xl font-semibold">{dashboardStats.resources}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Fields</p>

                  <p className="mt-1 text-xl font-semibold">{dashboardStats.fields}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Requests</p>

                  <p className="mt-1 text-xl font-semibold">
                    {dashboardStats.api_requests.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}

export default MainDashBoardPage;
