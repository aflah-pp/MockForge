import { Database, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

export default function ResourceFieldsTable({ fields = [], onEdit, onDelete }) {
  if (!fields.length) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-2 px-6 text-center">
        <Database className="size-8 text-muted-foreground" />

        <p className="font-medium">No fields yet</p>

        <p className="text-sm text-muted-foreground">
          Create a field to define the generated response.
        </p>
      </div>
    );
  }

  const sortedFields = [...fields].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Field</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Generator</TableHead>
            <TableHead className="text-right">Order</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedFields.map((field) => (
            <TableRow key={field.uuid}>
              <TableCell>
                <div className="min-w-32">
                  <p className="font-medium">{field.name}</p>

                  <p className="font-mono text-xs text-muted-foreground">{field.slug}</p>
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="secondary">{field.data_type}</Badge>
              </TableCell>

              <TableCell>
                <span className="font-mono text-xs text-muted-foreground">
                  {field.generator_key}
                </span>
              </TableCell>

              <TableCell className="text-right">{field.display_order}</TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Field actions</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(field)}>
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem variant="destructive" onClick={() => onDelete?.(field)}>
                      <Trash2 className="mr-2 size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
