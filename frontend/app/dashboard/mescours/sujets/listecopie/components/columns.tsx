import { Copie } from "@/interface/type";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Copie>[] = [
	{
		accessorKey: "prenom",
		header: ({ column }) => (
			<DataTableColumnHeader className="ml-5" column={column} title="Prenom" />
		),
		cell: ({ row }) => (
			<span className="ml-5">{row.getValue("prenom") as string}</span>
		),
	},

	{
		accessorKey: "nom",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Nom" />
		),
		cell: ({ row }) => <span>{row.getValue("nom") as string}</span>,
	},
	{
		accessorKey: "noteia",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Note IA" />
		),
		cell: ({ row }) => (
			<span className="ml-2">
				{(row.getValue("noteia") as string) || "N/A"}
			</span>
		),
	},
	{
		accessorKey: "notefinal",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Note Final" />
		),
		cell: ({ row }) => (
			<span className="ml-2">
				{(row.getValue("notefinal") as string) || "N/A"}
			</span>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];
