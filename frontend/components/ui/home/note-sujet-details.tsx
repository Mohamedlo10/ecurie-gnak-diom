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

import { NoteSujet } from "@/interface/type";
import { useRouter } from "next/navigation";
import { CSSProperties } from "react";
import { Button } from "../button";

const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};
export const description = "An interactive pie chart";

export function SujetDetailsComponent({
	noteSujets,
}: {
	noteSujets: NoteSujet[];
}) {
	const id = "pie-interactive";
	const router = useRouter();

	return (
		<Card data-chart={id} className="flex flex-col h-full">
			<Table>
				<TableHeader>
					<TableRow className="h-14">
						<TableHead className="w-[200px]">Sujet</TableHead>
						<TableHead className="w-[90px]">Note min</TableHead>
						<TableHead className="w-[90px]">Note max</TableHead>
						<TableHead className="">Moyenne</TableHead>
						{/* <TableHead className="">Ecart type</TableHead> */}
						<TableHead className="">Inf 10</TableHead>

						<TableHead className="text-right">Sup 10</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{noteSujets.map((element: NoteSujet) => (
						<TableRow>
							<TableCell className="font-medium">{element.nomsujet}</TableCell>
							<TableCell className="font-medium ml-3">
								{element.note_min}
							</TableCell>
							<TableCell className="font-medium ml-3">
								{element.note_max}
							</TableCell>
							<TableCell className="font-medium">
								{element.moyenne ? element.moyenne.slice(0, 6) : ""}
							</TableCell>{" "}
							{/* <TableCell className="font-medium">
								{element.ecart_type}
							</TableCell> */}
							<TableCell className="font-medium">
								{element.nombre_eleves_sans_moyenne}
							</TableCell>
							<TableCell className="text-right">
								{element.nombre_eleves_ayant_moyenne}
							</TableCell>
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
export default SujetDetailsComponent;
