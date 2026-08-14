import {
  Activity,
  ArrowUpRight,
  Box,
  Database,
  FileCode2,
  FolderKanban,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import AppLayout from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dashboardData } from "@/features/dashboard/data/initialData";

const stats = [
  {
    title: "Projects",
    value: dashboardData.stats.projects,
    description: `${dashboardData.stats.published_projects} published`,
    icon: FolderKanban,
  },
  {
    title: "Resources",
    value: dashboardData.stats.resources,
    description: `${dashboardData.stats.published_resources} published`,
    icon: Database,
  },
  {
    title: "Fields",
    value: dashboardData.stats.fields,
    description: "Across all resources",
    icon: FileCode2,
  },
  {
    title: "API Requests",
    value: dashboardData.stats.api_requests.toLocaleString(),
    description: "Mock API requests",
    icon: Activity,
  },
];

function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function MainDashBoardPage() {
  return (
    <AppLayout>
      <main className="min-h-full w-full">
        <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>

              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Welcome back, {dashboardData.user.username}. Here's what's happening with your
                MockForge projects.
              </p>
            </div>

            <Button>
              <Plus className="mr-2 size-4" />
              Create Project
            </Button>
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Projects</CardTitle>

                    <CardDescription>Your most recently updated projects.</CardDescription>
                  </div>

                  <Button variant="outline" size="sm">
                    View all
                    <ArrowUpRight className="ml-2 size-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="divide-y">
                  {dashboardData.recentProjects.map((project) => (
                    <div
                      key={project.uuid}
                      className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
                        <FolderKanban className="size-5 text-muted-foreground" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium">{project.name}</p>

                          <Badge variant={project.is_published ? "default" : "secondary"}>
                            {project.is_published ? "Published" : "Draft"}
                          </Badge>
                        </div>

                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          /{project.slug}
                        </p>

                        <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                          <span>{project.resources} resources</span>
                          <span>{project.fields} fields</span>
                          <span>{formatDate(project.updated_at)}</span>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Open project</DropdownMenuItem>
                          <DropdownMenuItem>Manage resources</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Distribution</CardTitle>

                <CardDescription>Resources and fields across your projects.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                {dashboardData.resourceDistribution.map((project) => {
                  const maxFields = 100;
                  const percentage = Math.min((project.fields / maxFields) * 100, 100);

                  return (
                    <div key={project.slug} className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{project.name}</p>

                          <p className="text-xs text-muted-foreground">
                            {project.resources} resources
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

                      <p className="text-xs text-muted-foreground">fields</p>
                    </div>
                  );
                })}
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
                    <p className="text-2xl font-bold">{dashboardData.stats.published_projects}</p>

                    <p className="text-xs text-muted-foreground">
                      of {dashboardData.stats.projects} projects
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
                    <p className="text-2xl font-bold">{dashboardData.stats.draft_projects}</p>

                    <p className="text-xs text-muted-foreground">waiting for publication</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schema Size</CardTitle>

                <CardDescription>Total fields defined in MockForge.</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                    <FileCode2 className="size-6" />
                  </div>

                  <div>
                    <p className="text-2xl font-bold">{dashboardData.stats.fields}</p>

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

                  <p className="mt-1 text-xl font-semibold">{dashboardData.stats.projects}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Resources</p>

                  <p className="mt-1 text-xl font-semibold">{dashboardData.stats.resources}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Fields</p>

                  <p className="mt-1 text-xl font-semibold">{dashboardData.stats.fields}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Requests</p>

                  <p className="mt-1 text-xl font-semibold">
                    {dashboardData.stats.api_requests.toLocaleString()}
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
