import { useNavigate } from "react-router-dom";
import { Database, ExternalLink, MoreHorizontal, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProjectResourcesTable({ project }) {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate(`/project/${project.slug}/resources/create`);
  };

  const handleOpen = (resource) => {
    navigate(`/project/${project.slug}/resources/${resource.slug}`);
  };

  const handleOpenApi = (resource) => {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}${project.slug}/${resource.slug}/`;

    window.open(apiUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Resources</CardTitle>

            <CardDescription>API resources belonging to this project.</CardDescription>
          </div>

          <Button size="sm" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Resource
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {project.resources.length > 0 ? (
                project.resources.map((resource) => (
                  <TableRow
                    key={resource.uuid}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleOpen(resource)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted/40">
                          <Database className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium">{resource.name}</p>

                          <p className="truncate text-xs text-muted-foreground">Resource</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-mono text-sm text-muted-foreground">
                        /{resource.slug}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge variant={resource.is_published ? "default" : "secondary"}>
                        {resource.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div onClick={(event) => event.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpen(resource)}>
                              Open Resource
                            </DropdownMenuItem>

                            {resource.is_published && (
                              <DropdownMenuItem onClick={() => handleOpenApi(resource)}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open API
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Database className="h-8 w-8 text-muted-foreground" />

                      <p className="font-medium">No resources yet</p>

                      <p className="text-sm text-muted-foreground">
                        Create your first resource for this project.
                      </p>

                      <Button size="sm" onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Resource
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
