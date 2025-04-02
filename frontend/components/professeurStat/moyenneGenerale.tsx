"use client";

import { Card } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { MoyenneEtudiant } from "@/interface/type";
import { useRouter } from "next/navigation";

export const description = "An interactive pie chart";

export function MoyenneGeneraleEtudiant({
	moyenneEtudiant,
}: {
	moyenneEtudiant: MoyenneEtudiant[];
}) {
	const id = "pie-interactive";
	const router = useRouter();

	return (
		<Card data-chart={id} className="flex flex-col h-full">
			<Table className="mb-4">
				<TableHeader>
					<TableRow className="h-14">
						<TableHead className="w-[200px]">Prenom</TableHead>
						<TableHead className="w-[90px]">Nom</TableHead>
						<TableHead className="text-right">Moyenne Generale</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{moyenneEtudiant.map((element: MoyenneEtudiant) => (
						<TableRow>
							<TableCell className="font-medium">{element.prenom}</TableCell>
							<TableCell className="font-medium ml-3">{element.nom}</TableCell>
							<TableCell className="text-right">
								{element.moyenne_generale
									? element.moyenne_generale.slice(0, 6)
									: ""}
							</TableCell>{" "}
						</TableRow>
					))}
				</TableBody>
				<TableCaption>Moyennes generales</TableCaption>
			</Table>
		</Card>
	);
}
export default MoyenneGeneraleEtudiant;
