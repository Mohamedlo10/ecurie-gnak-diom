import { Etudiant } from "@/interface/type";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Etudiant>[] = [
  {
    accessorKey: "ine",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="INE" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] font-bold">{row.getValue("ine") as string}</div>
    ),
  },
 
  {
    accessorKey: "prenom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prenom" />
    ),
    cell: ({ row }) => <span>{row.getValue("prenom") as string}</span>,
  }, 
  {
    accessorKey: "nom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }) => <span>{row.getValue("nom") as string}</span>,
  }, {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mail" />
    ),
    cell: ({ row }) => <span>{row.getValue("email") as string}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

