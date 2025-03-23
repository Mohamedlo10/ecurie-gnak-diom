"use client";

import { getSujetByidEtudiant, getSujetByidProf } from "@/app/api/sujet/query";
import { Button } from "@/components/ui/button";
import PdfViewer from "@/components/ui/PdfViewer";
import { Sujet, User } from "@/interface/type";
import { getSupabaseUser } from "@/lib/authMnager";
import Drawer from "@mui/material/Drawer";
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};

export default function Page() {
	const [isLoading, setIsLoading] = useState(true);
	const [selectedSujet, setselectedSujet] = useState<Sujet | any>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	let [color, setColor] = useState("#ffffff");
	const [currentPage, setCurrentPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [user, setUser] = useState<User>(getSupabaseUser());
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [sujets, setsujets] = useState<Sujet[]>([]);

	const handleNavigation = (idcours: string) => {
		router.push(`/dashboard/mescours/profile?id=${idcours}`);
	};

	const handleNavigation2 = (idsujet: string) => {
		router.push(`/dashboard/mescours/sujets?id=${idsujet}`);
	};

	async function fetchData() {
		setIsLoading(true);
		try {
			if (user.role == "professeur") {
				const data: any = await getSujetByidProf(user.idutilisateur);
				console.log(data);

				if (data && data.length > 0) {
					console.log(data);
					setsujets(data);
					setTotal(data.length);
				}
			} else if (user.role == "etudiant") {
				const data: any = await getSujetByidEtudiant(user.idutilisateur);
				console.log(data);

				if (data && data.length > 0) {
					console.log(data);
					setsujets(data);
					setTotal(data.length);
				}
			}
		} catch (error) {
			console.error("Error fetching data details:", error);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	const router = useRouter();

	const handleUserClick = (user: any) => {
		setselectedSujet(user);

		setIsDrawerOpen(true);
	};

	const closeDrawer = () => {
		setIsDrawerOpen(false);
		setselectedSujet(null);
	};

	if (isLoading) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
				<div className="sweet-loading">
					<BeatLoader
						color={color}
						loading={isLoading}
						cssOverride={override}
						size={15}
						aria-label="Loading Spinner"
						data-testid="loader"
					/>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="hidden h-[80vh] overflow-y-auto flex-1 px-10 flex-col p-2 md:flex">
				<div className="flex items-center justify-between ">
					<div>
						<h2 className="text-4xl font-extrabold tracking-tight py-2 text-zinc-400">
							Sujets
						</h2>
						<p className=" p-1 text-zinc-600 font-bold">
							{sujets.length} sujets
						</p>
					</div>
				</div>
				<DataTable
					data={sujets}
					columns={columns}
					onRowClick={handleUserClick}
					currentPage={currentPage}
					total={total}
					setCurrentPage={setCurrentPage}
				/>
			</div>

			<Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
				{selectedSujet && (
					<div className="p-4 mt-2 flex w-[30vw]">
						{
							<div className="flex flex-1 flex-col h-full overflow-y-hidden items-center justify-center">
								<div className="flex w-full max-w-xl flex-col items-center justify-center bg-slate-50 p-8 text-left">
									<div className="flex flex-row gap-2 w-full mb-4">
										<div className="flex flex-col w-full items-center gap-2 ">
											<div className="mb-2 text-base font-bold leading-none">
												Sujet
											</div>
											<PdfViewer pdfUrl={selectedSujet.urlsujet} />

											<div className="grid gap-1">
												<p className="text-base font-bold leading-none text-red-700">
													Cliquez pour voir
												</p>
											</div>
										</div>
									</div>

									<div className="pt-8 px-2 lg:px-2 xl:px-2 w-full grid items-center gap-0 justify-center grid-cols-2">
										<div className="flex flex-col w-full col-span-2 gap-2 ">
											<div className="text-base grid grid-cols-1 gap-auto items-center justify-center font-bold  w-full mt-4">
												<div className="line-clamp-2 flex flex-row gap-2  font-bold text-base text-muted-foreground">
													Sujet:{" "}
												</div>
												<div className="text-base text-red-700 flex items-start w-full justify-start">
													{selectedSujet?.nomsujet}
												</div>
											</div>
											<div className="text-base grid grid-cols-1 gap-auto items-center justify-center font-bold w-full mt-4">
												<div className="line-clamp-2 flex flex-row gap-12  font-bold text-base text-muted-foreground">
													Cours:{" "}
												</div>
												<div className="text-base text-red-700 flex items-start w-full justify-start">
													{selectedSujet?.nomcours || "N/A"}
												</div>
											</div>
											<div className="text-base grid grid-cols-1 gap-auto items-center justify-center font-bold  w-full mt-4">
												<div className="line-clamp-2 flex flex-row gap-2  font-bold text-base text-muted-foreground">
													Date de creation:{" "}
												</div>
												<div className="text-base text-red-700 flex items-start w-full justify-start">
													{selectedSujet?.created_at &&
														new Date(
															selectedSujet.created_at as string
														).toLocaleDateString("fr-FR", {
															day: "2-digit",
															month: "long",
															year: "numeric",
														}) +
															" à " +
															new Date(
																selectedSujet.created_at as string
															).toLocaleTimeString("fr-FR", {
																hour: "2-digit",
																minute: "2-digit",
																second: "2-digit",
															})}
												</div>
											</div>
											<div className="text-base grid grid-cols-1 gap-auto items-center justify-center font-bold  w-full mt-4">
												<div className="line-clamp-2 flex flex-row gap-2  font-bold text-base text-muted-foreground">
													Date limite de soumission:{" "}
												</div>

												<div className="text-base text-red-700 flex items-start w-full justify-start">
													{selectedSujet?.datesoumission &&
														new Date(
															selectedSujet.datesoumission as string
														).toLocaleDateString("fr-FR", {
															day: "2-digit",
															month: "long",
															year: "numeric",
														}) +
															" à " +
															new Date(
																selectedSujet.datesoumission as string
															).toLocaleTimeString("fr-FR", {
																hour: "2-digit",
																minute: "2-digit",
																second: "2-digit",
															})}
												</div>
											</div>
										</div>
									</div>
									<div className="ml-auto pt-6 w-full items-center justify-center flex font-medium">
										<div className="w-full flex justify-center gap-2 items-center px-10">
											<Button
												type="button"
												className="w-fit h-10 cursor-pointer text-sm font-bold bg-black"
												onClick={() =>
													handleNavigation(selectedSujet?.idcours)
												}>
												Voir le cours
											</Button>
											<Button
												type="button"
												className="w-fit h-10 cursor-pointer text-sm font-bold bg-black"
												onClick={() =>
													handleNavigation2(selectedSujet?.idsujet)
												}>
												Voir le sujet
											</Button>
										</div>
									</div>
								</div>
							</div>
						}
					</div>
				)}
			</Drawer>
		</>
	);
}
