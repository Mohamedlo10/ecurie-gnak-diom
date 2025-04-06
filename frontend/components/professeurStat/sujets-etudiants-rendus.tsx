"use client";

import { Card, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { NbEtudiantsParSujet } from "@/interface/type";
import { useRouter } from "next/navigation";
import { CSSProperties } from "react";
import { Button } from "../ui/button";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
export const description = "An interactive pie chart";

export function EtudiantsRenduSujetComponent({
  nbEtudiantsParSujet,
}: {
  nbEtudiantsParSujet: NbEtudiantsParSujet[];
}) {
  const id = "pie-interactive";
  const router = useRouter();

  return (
    <Card data-chart={id} className="flex flex-col h-full">
      <Table>
        <TableHeader>
          <TableRow className="h-14">
            <TableHead className="w-[300px]">Sujet</TableHead>
            <TableHead className="text-right">Copies rendus</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nbEtudiantsParSujet.map((element: NbEtudiantsParSujet) => (
            <TableRow>
              <TableCell className="font-medium">{element.nomsujet}</TableCell>
              <TableCell className="text-right">
                {element.nombre_etudiants}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>Copies rendus par sujet</TableCaption>
      </Table>
      <CardFooter className="flex-col items-end gap-2 ">
        <Button
          type="button"
          onClick={() => router.push("dashboard/messujets")}
          className="w-fit h-10 text-[9px] xl:text-sm font-bold"
        >
          Voir mes sujets
        </Button>
      </CardFooter>
    </Card>
  );
}
export default EtudiantsRenduSujetComponent;
