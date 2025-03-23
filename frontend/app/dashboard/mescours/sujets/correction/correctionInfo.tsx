"use client";
import React from "react";

import {
	genererCorrection,
	getCorrrectionByidSujet,
} from "@/app/api/correction/query";
import { supprimerSujet } from "@/app/api/sujet/query";
import { Button } from "@/components/ui/button";
import PdfViewer from "@/components/ui/PdfViewer";
import { Correction, User } from "@/interface/type";
import { getSupabaseUser } from "@/lib/authMnager";
import { GitPullRequestArrow } from "lucide-react";
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { toast } from "react-toastify";

const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};

type CorrectionInfoProps = {
	sujetId: string | null | undefined;
};

const CorrectionInfo: React.FC<CorrectionInfoProps> = ({ sujetId }) => {
	const [isLoading, setIsLoading] = useState(true);
	let [color, setColor] = useState("#ffffff");
	const [correction, setcorrection] = useState<Correction>();
	const router = useRouter();
	const [user, setUser] = useState<User>(getSupabaseUser());
	const [searchTerm, setSearchTerm] = useState("");
	const [file, setFile] = useState<File | null>(null);

	async function fetchData() {
		setIsLoading(true);
		if (user.role == "professeur") {
			try {
				if (sujetId) {
					const data: any = await getCorrrectionByidSujet(sujetId);
					if (data) {
						console.log(data);
						setcorrection(data);
					}
				}
			} catch (error) {
				console.error(
					"Erreur lors de la recuperation de la correction details:",
					error
				);
			} finally {
				setIsLoading(false);
			}
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	const deleteSujet = async (idSujet: string) => {
		setIsLoading(true);

		try {
			const response = await supprimerSujet(idSujet);
			console.log("Suppression reussi");
			fetchData();
			setIsLoading(false);
		} catch (error) {
			console.error("Erreur lors de la Suppression du cour:", error);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		if (user?.role == "etudiant") {
			console.log("non autoriser");
			setIsLoading(false);
			return -1;
		}
		console.log("autoriser");

		if (file) {
			try {
				/* const response = await creerSujet(
					sujet.nomsujet,
					sujet,
					file,
					sujet.datesoumission
				); */

				fetchData();
				setIsLoading(false);
				/* 				toast.success(`sujet ajouté avec succès: ${response.nomsujet}`);
				console.log(`sujet ajouté avec succès: ${response.nomsujet}`); */
				alert("sujet add");
			} catch (error) {
				console.error("Erreur lors de l'ajout du sujet:", error);
				toast.error(`Erreur lors de l'ajout du sujet ${error}`);
				setIsLoading(false);
			}
		}
	};

	const handleGenerateCorrection = async () => {
		if (sujetId) {
			try {
				setIsLoading(true);
				const response = await genererCorrection(sujetId);

				fetchData();
				setIsLoading(false);
				/* 				toast.success(`sujet ajouté avec succès: ${response.nomsujet}`);
        console.log(`sujet ajouté avec succès: ${response.nomsujet}`); */
				alert("Correction genere");
			} catch (error) {
				console.error("Erreur lors de la generation de la correction:", error);
				toast.error(`Erreur lors de la generation de la correction ${error}`);
				setIsLoading(false);
			}
		}
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
			<div className="hidden h-[63vh] w-full overflow-y-auto items-center justify-center px-10 flex-col p-2 md:flex">
				{/* Tableau des données */}
				{correction ? (
					<div
						className={`flex items-center justify-center mt-6 w-full h-full`}>
						<div className="flex flex-col w-2/3 h-full ">
							<div className="h-96">
								<PdfViewer pdfUrl={correction.urlcorrection} />
								<div className="flex-row flex gap-3 ">
									<div className="text-gray-500 text-sm sm:text-base">
										correction generer le
									</div>
									<div className=" text-sm sm:text-base font-bold">
										{" "}
										{new Date(
											correction?.created_at as string
										).toLocaleDateString("fr-FR", {
											day: "2-digit",
											month: "long",
											year: "numeric",
										}) +
											" à " +
											new Date(
												correction?.created_at as string
											).toLocaleTimeString("fr-FR", {
												hour: "2-digit",
												minute: "2-digit",
												second: "2-digit",
											})}
									</div>
								</div>
								<div className="flex-row flex gap-1 w-full items-center justify-center "></div>
							</div>
						</div>
					</div>
				) : (
					<>
						<div className="w-full h-fit py-6 text-2xl font-bold text-zinc-400 flex items-center justify-center px-10">
							Aucun Correction disponible
						</div>
						{user?.role == "professeur" && (
							<div className="flex items-center justify-center px-10">
								<Button
									type="button"
									disabled={user?.role != "professeur"}
									className="w-fit h-10 cursor-pointer text-sm font-bold bg-red-700"
									onClick={handleGenerateCorrection}>
									<GitPullRequestArrow /> Demander une correction
								</Button>
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
};

export default CorrectionInfo;
