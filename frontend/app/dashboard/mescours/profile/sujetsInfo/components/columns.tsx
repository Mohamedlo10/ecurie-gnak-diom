import { Sujet } from "@/interface/type";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Sujet>[] = [
  {
    accessorKey: "nomsujet",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="ml-28" title="nomsujet" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] ml-24 font-bold">{row.getValue("nomsujet") as string}</div>
    ),
  },
 /*  {
    accessorKey: "urlsujet",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="urlsujet" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("urlsujet") as string;
      const truncatedValue = value.length > 95 ? value.slice(0, 95) + "..." : value;
  
      return <span title={value}>{truncatedValue}</span>; // Ajout du `title` pour afficher le texte complet en survol
    },
  }, */
  
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de creation" />
    ),
    cell: ({ row }) => (
      <span>
       {
        new Date(row.getValue("created_at") as string).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }) +
        " à " +
        new Date(row.getValue("created_at") as string).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </span>
    ),
  },
  {
    accessorKey: "dateSoumission",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date limite de soumission" />
    ),
    cell: ({ row }) => (
      <span>
       {
        new Date(row.getValue("dateSoumission") as string).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }) +
        " à " +
        new Date(row.getValue("dateSoumission") as string).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

