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

import { MoyenneParCours } from "@/interface/type";
import { useRouter } from "next/navigation";
import { Button } from "../button";

export const description = "An interactive pie chart";

export function EtudiantMoyenneCours({
	moyenneParCours,
}: {
	moyenneParCours: MoyenneParCours[];
}) {
	const id = "pie-interactive";
	const router = useRouter();

	return (
		<Card data-chart={id} className="flex flex-col h-full">
			<Table>
				<TableHeader>
					<TableRow className="h-14">
						<TableHead className="w-[200px]">Prenom</TableHead>
						<TableHead className="w-[90px]">Nom</TableHead>
						<TableHead className="w-[270px]">Cours</TableHead>
						<TableHead className="text-right">Moyenne</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{moyenneParCours.map((element: MoyenneParCours) => (
						<TableRow>
							<TableCell className="font-medium">{element.prenom}</TableCell>
							<TableCell className="font-medium ml-3">{element.nom}</TableCell>
							<TableCell className="font-medium ml-3">
								{element.nomcours}
							</TableCell>
							<TableCell className="text-right">
								{element.moyenne_cours ? element.moyenne_cours.slice(0, 6) : ""}
							</TableCell>{" "}
						</TableRow>
					))}
				</TableBody>
				<TableCaption>Details des epreuves</TableCaption>
			</Table>
			<CardFooter className="flex-col items-end gap-2 ">
				<Button
					type="button"
					onClick={() => router.push("dashboard/messujets")}
					className="w-fit h-10 text-[9px] xl:text-sm font-bold">
					Voir mes sujets
				</Button>
			</CardFooter>
		</Card>
	);
}
export default EtudiantMoyenneCours;
