import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import ProjectTable from "@/features/dashboard/components/ProjectsTable";
import AppLayout from "@/components/layout/app-layout";
import { deleteProject, getProjects } from "@/service/endpoints/projects";

const ITEMS_PER_PAGE = 5;

export default function ProjectsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: projectsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const projects = useMemo(() => {
    if (Array.isArray(projectsResponse)) {
      return projectsResponse;
    }

    if (Array.isArray(projectsResponse?.results)) {
      return projectsResponse.results;
    }

    if (Array.isArray(projectsResponse?.data)) {
      return projectsResponse.data;
    }

    return [];
  }, [projectsResponse]);

  const deleteMutation = useMutation({
    mutationFn: deleteProject,

    onSuccess: (_, slug) => {
      queryClient.setQueryData(["projects"], (currentData) => {
        if (Array.isArray(currentData)) {
          return currentData.filter((project) => project.slug !== slug);
        }

        if (currentData?.results) {
          return {
            ...currentData,
            results: currentData.results.filter((project) => project.slug !== slug),
          };
        }

        return currentData;
      });

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });

  const handleDelete = (project) => {
    if (!project?.slug) {
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete "${project.name}"?`);

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(project.slug);
  };

  const handleRowClick = (project) => {
    navigate(`/project/${project.slug}`);
  };

  const handleCreate = () => {
    navigate("/project/create");
  };

  const filteredProjects = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return projects.filter((project) => {
      const matchesSearch =
        !search ||
        project.name?.toLowerCase().includes(search) ||
        project.slug?.toLowerCase().includes(search);

      const matchesPublished =
        publishedFilter === "all" ||
        (publishedFilter === "published" && project.is_published) ||
        (publishedFilter === "draft" && !project.is_published);

      return matchesSearch && matchesPublished;
    });
  }, [projects, searchTerm, publishedFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchTerm, publishedFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
  }, [currentPage, totalPages]);

  const startItem = filteredProjects.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length);

  return (
    <AppLayout>
      <main className="h-[calc(100vh-5rem)] w-full overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="shrink-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Projects</h1>

                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                  Manage your projects
                </p>
              </div>

              <Button onClick={handleCreate} className="w-full shrink-0 sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </div>
          </div>

          <div className="mt-6 shrink-0">
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search projects..."
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 sm:max-w-sm"
                />

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[
                    { value: "all", label: "All" },
                    { value: "published", label: "Published" },
                    { value: "draft", label: "Drafts" },
                  ].map((filter) => (
                    <Button
                      key={filter.value}
                      type="button"
                      size="sm"
                      variant={publishedFilter === filter.value ? "default" : "outline"}
                      onClick={() => setPublishedFilter(filter.value)}
                      className="shrink-0"
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-hidden">
            {isLoading ? (
              <div className="flex h-full items-center justify-center rounded-xl border bg-card">
                <p className="text-sm text-muted-foreground">Loading projects...</p>
              </div>
            ) : isError ? (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-destructive/30 bg-card px-6 text-center">
                <p className="font-medium text-destructive">Failed to load projects</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {error?.message || "Something went wrong."}
                </p>
              </div>
            ) : (
              <>
                <div className="hidden h-full min-h-0 overflow-auto md:block">
                  <ProjectTable
                    data={paginatedProjects}
                    onRowClick={handleRowClick}
                    onDelete={handleDelete}
                    pageSize={ITEMS_PER_PAGE}
                    isDeleting={deleteMutation.isPending}
                  />
                </div>

                <div className="h-full min-h-0 overflow-y-auto md:hidden">
                  {paginatedProjects.length > 0 ? (
                    <div className="space-y-4 pb-4">
                      {paginatedProjects.map((project) => (
                        <div
                          key={project.uuid}
                          className="rounded-xl border bg-card p-4 shadow-sm transition-colors active:bg-muted/40"
                          onClick={() => handleRowClick(project)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h2 className="truncate font-semibold">{project.name}</h2>

                              <p className="mt-1 truncate text-sm text-muted-foreground">
                                /{project.slug}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                                project.is_published
                                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {project.is_published ? "Published" : "Draft"}
                            </span>
                          </div>

                          <div className="mt-4 border-t pt-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs text-muted-foreground">Last updated</p>

                                <p className="mt-0.5 text-sm">
                                  {project.updated_at
                                    ? new Date(project.updated_at).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : "—"}
                                </p>
                              </div>

                              <div
                                className="flex gap-2"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={deleteMutation.isPending}
                                  onClick={() => handleDelete(project)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed bg-card px-6 py-12 text-center">
                      <p className="font-medium">No projects found</p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Try changing your search or filter.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {!isLoading &&
            !isError &&
            (filteredProjects.length > 0 ? (
              <div className="mt-4 shrink-0">
                <div className="flex min-h-16 flex-col items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm sm:flex-row">
                  <p className="text-center text-sm text-muted-foreground sm:text-left">
                    Showing <span className="font-medium text-foreground">{startItem}</span> to{" "}
                    <span className="font-medium text-foreground">{endItem}</span> of{" "}
                    <span className="font-medium text-foreground">{filteredProjects.length}</span>{" "}
                    projects
                  </p>

                  {totalPages > 1 && (
                    <Pagination className="mx-0 w-auto">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(event) => {
                              event.preventDefault();

                              if (currentPage > 1) {
                                setCurrentPage((page) => page - 1);
                              }
                            }}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>

                        {pageNumbers.map((page, index) =>
                          page === "ellipsis" ? (
                            <PaginationItem key={`ellipsis-${index}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === page}
                                onClick={(event) => {
                                  event.preventDefault();
                                  setCurrentPage(page);
                                }}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ),
                        )}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(event) => {
                              event.preventDefault();

                              if (currentPage < totalPages) {
                                setCurrentPage((page) => page + 1);
                              }
                            }}
                            className={
                              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 h-16" />
            ))}
        </div>
      </main>
    </AppLayout>
  );
}
