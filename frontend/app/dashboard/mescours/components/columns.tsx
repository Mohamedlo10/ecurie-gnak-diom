import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Cours } from "@/interface/type";

export const columns: ColumnDef<Cours>[] = [
  {
    accessorKey: "nomcours",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom cours" />
    ),
    cell: ({ row }) => (
      <span>{row.getValue("nomcours") as string}</span>
    ),
  },
  {
    accessorKey: "prenom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prénom" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[200px] px-2 truncate font-medium">
        {row.getValue("prenom") as string}
      </span>
    ),
  },
  {
    accessorKey: "nom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate font-medium">
        {row.getValue("nom") as string}
      </span>
    ),
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="email" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate font-medium">
        {row.getValue("email") as string}
      </span>
    ),
  },


  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
