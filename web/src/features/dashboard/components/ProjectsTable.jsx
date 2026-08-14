import { useMemo, useState } from "react";
import * as ReactTable from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, GripVertical } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const columns = [
  {
    id: "drag",
    header: "",
    cell: () => (
      <div className="flex items-center justify-center">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    size: 40,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    enableHiding: true,
  },
  {
    accessorKey: "is_published",
    header: "Published",
    cell: ({ row }) => (
      <Badge variant={row.original.is_published ? "default" : "secondary"}>
        {row.original.is_published ? "Published" : "Draft"}
      </Badge>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) => format(new Date(row.original.updated_at), "MMM dd, yyyy HH:mm"),
    enableSorting: false,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div onClick={(event) => event.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" onClick={(event) => event.stopPropagation()}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => row.original.onDelete?.(row.original)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    enableSorting: false,
  },
];

export default function ProjectTable({ data, onRowClick, onDelete, pageSize = 8 }) {
  const [columnVisibility, setColumnVisibility] = useState({
    slug: false,
  });

  const tableData = useMemo(
    () =>
      data.map((item) => ({
        ...item,

        onDelete,
      })),
    [data, onDelete],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = ReactTable.useReactTable({
    data: tableData,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: ReactTable.getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  const emptyRowCount = Math.max(0, pageSize - rows.length);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="min-h-0 flex-1 overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="sticky top-0 z-10 bg-card">
                    {header.isPlaceholder
                      ? null
                      : ReactTable.flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {rows.length > 0 ? (
              <>
                {rows.map((row) => (
                  <TableRow
                    key={row.original.uuid}
                    className="h-13 cursor-pointer hover:bg-muted/50"
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {ReactTable.flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {Array.from({
                  length: emptyRowCount,
                }).map((_, index) => (
                  <TableRow key={`empty-${index}`} className="pointer-events-none">
                    <TableCell colSpan={columns.length} className="h-13" />
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <p className="font-medium">No projects found</p>

                    <p className="text-sm text-muted-foreground">
                      Try changing your search or filter.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
