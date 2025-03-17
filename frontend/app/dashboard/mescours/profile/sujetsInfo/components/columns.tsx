import { Sujet } from "@/interface/type";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Sujet>[] = [
  {
    accessorKey: "nomsujet",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="ml-4" title="nomsujet" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] ml-4 font-bold">{row.getValue("nomsujet") as string}</div>
    ),
  },
  {
    accessorKey: "urlsujet",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="urlsujet" />
    ),
    cell: ({ row }) => <span>{row.getValue("urlsujet") as string}</span>,
  }, 
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

