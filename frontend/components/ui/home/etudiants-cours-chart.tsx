"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartStyle,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { NbInscritsCours } from "@/interface/type";
import { useRouter } from "next/navigation";
import { CSSProperties } from "react";
import { Button } from "../button";

const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};
export const description = "An interactive pie chart";

export function EtudiantsCoursComponent({
	nbInscritsCours,
}: {
	nbInscritsCours: NbInscritsCours[];
}) {
	const id = "pie-interactive";
	const router = useRouter();
	const colors = [
		"#CD5C5C", // Rouge brique
		"#FF7F0E", // Orange
		"#7F7F7F", // Gris
		"#A0522D", // Brun terre
		"#000000", //NOIR
		"#1F77B4", // Bleu vif
		"#2CA02C", // Vert
		"#BCBD22", // Jaune-vert
		"#17BECF", // Cyan
		"#E377C2", // Rose
		"#8C564B", // Brun
		"#D62728", // Rouge
		"#9467BD", // Violet
		"#AEC7E8", // Bleu clair
		"#FFBB78", // Orange clair
		"#98DF8A", // Vert clair
		"#DBDB8D", // Jaune-vert clair
		"#9EDAE5", // Cyan clair
		"#F7B6D2", // Rose clair
		"#C7C7C7", // Gris clair
		"#C49C94", // Brun clair
		"#FF9896", // Rouge clair
		"#C5B0D5", // Violet clair
		"#4DBEEE", // Bleu ciel
		"#FFA07A", // Saumon clair
		"#90EE90", // Vert clair
		"#FAFAD2", // Jaune clair
		"#E0FFFF", // Cyan clair
		"#FF69B4", // Rose vif
		"#D3D3D3", // Gris clair
		"#9370DB", // Violet moyen
	];

	const chartData = nbInscritsCours.map((cours, index) => ({
		id: cours.idcours,
		month: cours.nomcours,
		desktop: Number(cours.nombre_etudiants_inscrits),
		fill: colors[index % colors.length],
	}));

	const chartConfig = Object.fromEntries(
		nbInscritsCours.map((cours, index) => [
			cours.idcours,
			{
				label: cours.nomcours,
				color: colors[index % colors.length],
			},
		])
	);

	const [activeId, setActiveId] = React.useState(
		chartData.length > 0 ? chartData[0].id : ""
	);

	const activeIndex = React.useMemo(
		() => chartData.findIndex((item) => item.id === activeId),
		[activeId, chartData]
	);

	const courseOptions = React.useMemo(
		() => chartData.map((item) => ({ id: item.id, name: item.month })),
		[chartData]
	);

	return (
		<Card data-chart={id} className="flex flex-col h-full">
			<ChartStyle id={id} config={chartConfig} />
			<CardHeader className="flex-row items-start space-y-0 pb-0">
				<div className="grid gap-1">
					<CardTitle className="xl:text-lg text-sm">Cours</CardTitle>
					<CardTitle className="text-red-600 font-bold text-4xl xl:text-5xl">
						{nbInscritsCours.length}
					</CardTitle>
				</div>
				<div className="grid gap-1 ml-auto">
					<CardTitle className=" text-base">
						Nombre d'eleves par cours
					</CardTitle>
				</div>
				<Select value={activeId} onValueChange={setActiveId}>
					<SelectTrigger
						className="ml-auto flex items-center justify-center h-10 xl:w-[100px] w-[70px] rounded-lg"
						aria-label="Select a value">
						<SelectValue placeholder="Select course" />
					</SelectTrigger>
					<SelectContent align="center" className="rounded-xl">
						{courseOptions.map((course) => {
							const config = chartConfig[course.id as keyof typeof chartConfig];

							if (!config) {
								return null;
							}

							return (
								<SelectItem
									key={course.id}
									value={course.id}
									className="rounded-lg [&_span]:flex">
									<div className="flex justify-start items-start gap-2 text-xs">
										<span
											className="flex h-3 w-3 shrink-0 rounded-sm"
											style={{
												backgroundColor: config.color,
											}}
										/>
										{config?.label}
									</div>
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className="flex flex-1 justify-center pb-0">
				<ChartContainer
					id={id}
					config={chartConfig}
					className="p-2 aspect-square w-full max-w-[340px]">
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									hideLabel
									className="bg-white p-2 shadow-md rounded-md"
								/>
							}
						/>
						<Pie
							data={chartData}
							dataKey="desktop"
							nameKey="month"
							innerRadius={88}
							strokeWidth={40}
							activeIndex={activeIndex > -1 ? activeIndex : 0}
							activeShape={({
								outerRadius = 0,
								...props
							}: PieSectorDataItem) => (
								<g>
									<Sector {...props} outerRadius={outerRadius + 10} />
									<Sector
										{...props}
										outerRadius={outerRadius + 25}
										innerRadius={outerRadius + 12}
									/>
								</g>
							)}>
							<Label
								content={({ viewBox }) => {
									if (
										viewBox &&
										"cx" in viewBox &&
										"cy" in viewBox &&
										activeIndex > -1
									) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle">
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-4xl  font-bold">
													{chartData[activeIndex]?.desktop.toLocaleString() ||
														"0"}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 19}
													className="text-black ">
													{"Eleves"}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 35}
													className="text-black ">
													{chartData[activeIndex]?.month || ""}
												</tspan>
											</text>
										);
									}
									return null;
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-end gap-2 ">
				<Button
					type="button"
					onClick={() => router.push("dashboard/mescours")}
					className="w-fit h-10 text-[9px] xl:text-sm font-bold">
					Voir mes cours
				</Button>
			</CardFooter>
		</Card>
	);
}
export default EtudiantsCoursComponent;
