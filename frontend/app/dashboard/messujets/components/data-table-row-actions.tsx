"use client"

import { Row } from "@tanstack/react-table"

import {
  DropdownMenu
} from "@/components/ui/dropdown-menu"


interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const commande = Etudiant.parse(row.original)

  return (
    <DropdownMenu>
    {/*   <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => console.log(`Edit commande: ${commande.id}`)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log(`Duplicate commande: ${commande.id}`)}>
          Make a copy
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => console.log(`Delete commande: ${commande.id}`)}
        >
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent> */}
    </DropdownMenu>
  )
}
