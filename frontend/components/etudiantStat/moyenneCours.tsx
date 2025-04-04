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

import { MoyennesParCours } from "@/interface/type";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export const description = "An interactive pie chart";

export function MoyenneCoursEtudiant({
  moyennesParCours,
}: {
  moyennesParCours: MoyennesParCours[];
}) {
  const id = "pie-interactive";
  const router = useRouter();

  return (
    <Card data-chart={id} className="flex flex-col px-1 h-full">
      <CardHeader>
        <CardTitle>Mes moyennes par cours</CardTitle>
        <CardDescription>Vous</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="h-14">
              <TableHead className="w-[200px]">Cours</TableHead>

              <TableHead className="text-right">Moyenne </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {moyennesParCours.map((element: MoyennesParCours) => (
              <TableRow>
                <TableCell className="font-medium">
                  {element.nomcours}
                </TableCell>
                <TableCell className="text-right">
                  {element.moyenne.slice(0, 6)}
                </TableCell>{" "}
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>Details des cours</TableCaption>
        </Table>
      </CardContent>

      <CardFooter className="flex-col items-end gap-2 ">
        <Button
          type="button"
          onClick={() => router.push("dashboard/mescours")}
          className="w-fit h-10 text-[9px] xl:text-sm font-bold"
        >
          Voir mes cours
        </Button>
      </CardFooter>
    </Card>
  );
}
export default MoyenneCoursEtudiant;
