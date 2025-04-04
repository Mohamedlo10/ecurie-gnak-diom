"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BestNotes } from "@/interface/type";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export const description = "An interactive pie chart";

export function BestNotesEtudiant({ bestNotes }: { bestNotes: BestNotes[] }) {
  const id = "pie-interactive";
  const router = useRouter();

  return (
    <Card data-chart={id} className="flex flex-col px-1 h-full">
      <CardHeader>
        <CardTitle>Mes Meilleurs notes</CardTitle>
        <CardDescription>Vous</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="h-14">
              <TableHead className="w-[200px]">Sujet</TableHead>

              <TableHead className="text-right">Note </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bestNotes.map((element: BestNotes) => (
              <TableRow>
                <TableCell className="font-medium">
                  {element.nomsujet}
                </TableCell>
                <TableCell className="text-right">
                  {element.notefinal}
                </TableCell>{" "}
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>Details des epreuves</TableCaption>
        </Table>
      </CardContent>

      <CardFooter className="flex-col items-end gap-2 ">
        <Button
          type="button"
          onClick={() => router.push("dashboard/mescopies")}
          className="w-fit h-10 text-[9px] xl:text-sm font-bold"
        >
          Voir mes notes
        </Button>
      </CardFooter>
    </Card>
  );
}
export default BestNotesEtudiant;
