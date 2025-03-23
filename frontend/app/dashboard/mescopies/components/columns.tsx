import { Copie } from "@/interface/type";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Copie>[] = [
	/* {
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
	}, */
	{
		accessorKey: "nomcours",
		header: ({ column }) => (
			<DataTableColumnHeader className="ml-2" column={column} title="Cours" />
		),
		cell: ({ row }) => (
			<span className="ml-2">
				{(row.getValue("nomcours") as string) || "N/A"}
			</span>
		),
	},
	{
		accessorKey: "nomsujet",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Sujet" />
		),
		cell: ({ row }) => (
			<span className="ml-2">
				{(row.getValue("nomsujet") as string) || "N/A"}
			</span>
		),
	},
	/* {
		accessorKey: "noteia",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Note IA" />
		),
		cell: ({ row }) => (
			<span className="ml-2">
				{(row.getValue("noteia") as string) || "N/A"}
			</span>
		),
	}, */
	{
		accessorKey: "notefinal",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Note" />
		),
		cell: ({ row }) => (
			<span className="ml-2">
				{(row.getValue("notefinal") as string) || "N/A"}
			</span>
		),
	},
	{
		accessorKey: "created_at",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Date de creation" />
		),
		cell: ({ row }) => (
			<span>
				{new Date(row.getValue("created_at") as string).toLocaleDateString(
					"fr-FR",
					{
						day: "2-digit",
						month: "long",
						year: "numeric",
					}
				) +
					" à " +
					new Date(row.getValue("created_at") as string).toLocaleTimeString(
						"fr-FR",
						{
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit",
						}
					)}
			</span>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];
