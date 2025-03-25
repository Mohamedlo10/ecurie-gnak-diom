import { Copie } from "@/interface/type";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Copie>[] = [
	{
		accessorKey: "nomsujet",
		header: ({ column }) => (
			<DataTableColumnHeader className="ml-2" column={column} title="Sujet" />
		),
		cell: ({ row }) => (
			<span className="ml-2">
				{(row.getValue("nomsujet") as string) || "N/A"}
			</span>
		),
	},
	{
		accessorKey: "nomcours",
		header: ({ column }) => (
			<DataTableColumnHeader className="ml-5" column={column} title="Cours" />
		),
		cell: ({ row }) => (
			<span className="ml-5">{row.getValue("nomcours") as string}</span>
		),
	},
	{
		accessorKey: "datesoumission",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Date limite de soumission"
			/>
		),
		cell: ({ row }) => (
			<span>
				{new Date(row.getValue("datesoumission") as string).toLocaleDateString(
					"fr-FR",
					{
						day: "2-digit",
						month: "long",
						year: "numeric",
					}
				) +
					" à " +
					new Date(row.getValue("datesoumission") as string).toLocaleTimeString(
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
