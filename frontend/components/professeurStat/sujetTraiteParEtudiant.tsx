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

import { SujetsTraitesParEtudiant } from "@/interface/type";
import { useRouter } from "next/navigation";

export const description = "An interactive pie chart";

export function SujetTraiterParEtudiant({
	sujetsTraitesParEtudiant,
}: {
	sujetsTraitesParEtudiant: SujetsTraitesParEtudiant[];
}) {
	const id = "pie-interactive";
	const router = useRouter();

	return (
		<Card data-chart={id} className="flex flex-col h-full">
			<Table className="mb-4">
				<TableHeader>
					<TableRow className="h-14">
						<TableHead className="w-[200px]">Prenom</TableHead>
						<TableHead className="w-[140px]">Nom</TableHead>
						<TableHead className="text-right">
							Nombre de sujets traites
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sujetsTraitesParEtudiant.map((element: SujetsTraitesParEtudiant) => (
						<TableRow>
							<TableCell className="font-medium">{element.prenom}</TableCell>
							<TableCell className="font-medium ml-3">{element.nom}</TableCell>
							<TableCell className="text-right">
								{element.nombre_sujets_traites}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableCaption>Nombres de sujets traites par etudiants</TableCaption>
			</Table>
		</Card>
	);
}
export default SujetTraiterParEtudiant;
