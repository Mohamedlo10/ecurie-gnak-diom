"use client";
import { creerCopie, getCopieByidSujetAndIdUser } from "@/app/api/copie/query";
import { supprimerSujet } from "@/app/api/sujet/query";
// import { modifiersujets, suprimersujets } from '@/app/api/sujets/query';
import PdfViewer from "@/components/ui/PdfViewer";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/dialogConfirm";
import { Copie, Sujet, User } from "@/interface/type";
import { getSupabaseUser } from "@/lib/authMnager";
import { Save, Send, Trash, Trash2, UserRoundPen, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, CSSProperties, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

type PersonalInfoProps = {
	sujet: Sujet | any;
};
const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};

const PersonalInfo: React.FC<PersonalInfoProps> = ({ sujet }) => {
	const [editMode, seteditMode] = useState(false);
	const activeEdit = () => {
		seteditMode(!editMode);
	};
	const router = useRouter();
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [user, setUser] = useState<User>(getSupabaseUser());
	const [copie, setCopie] = useState<Copie>();
	let [color, setColor] = useState("#ffffff");
	const [isLoading, setIsLoading] = useState(false);
	const [currentSujet, setcurrentSujet] = useState({
		nomsujet: sujet?.nomsujet || "",
	});
	const [file, setFile] = useState<File | null>(null);
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const selectedFile = event.target.files[0];
			if (selectedFile && selectedFile.type !== "application/pdf") {
				alert("Seuls les fichiers PDF sont autorisés !");
				return;
			}
			if (event.target.files) {
				setFile(event.target.files[0]);
			}
		}
	};

	const handleAddCopie = async () => {
		setIsLoading(true);
		if (user?.idutilisateur && file) {
			try {
				console.log(sujet.idsujet, user.idutilisateur, file);
				const response = await creerCopie(
					sujet.idsujet,
					user.idutilisateur,
					file
				);
				console.log("Copie ajouter avec succes", response);
				setFile(null);
				setIsLoading(false);

				fetchData();
			} catch (error) {
				setIsLoading(false);
				fetchData();
				console.error("Erreur lors de l'ajout de la copie:", error);
			}
		}
	};

	const handleRemoveFile = () => {
		setFile(null);
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setcurrentSujet({ ...sujet, [name]: value });
	};

	async function fetchData() {
		setIsLoading(true);
		if (user.role != "professeur") {
			try {
				const data: any = await getCopieByidSujetAndIdUser(
					sujet.idsujet,
					user.idutilisateur
				);
				if (data) {
					console.log(data);
					setCopie(data);
				}
			} catch (error) {
				console.error("Error fetching copie details:", error);
			} finally {
				setIsLoading(false);
			}
		}
		setIsLoading(false);
	}

	useEffect(() => {
		if (sujet && sujet.idsujet) {
			fetchData();
		} else {
			console.log("En attente de sujet...");
		}
	}, [sujet]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			// const response = await modifiersujets(sujet.idsujets,currentSujet.nomsujet)
			console.log("Reussi");
			// console.log(response)
			window.location.reload();
		} catch (error) {
			console.error("Erreur lors de la modification du sujet:", error);
		}
	};

	const deleteSujet = async () => {
		setIsLoading(true);

		try {
			const response = await supprimerSujet(sujet.idsujet);
			console.log("Suppression reussi");
			router.back();
		} catch (error) {
			console.error("Erreur lors de la Suppression du cour:", error);
		}
	};

	if (isLoading || !sujet) {
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
		<div>
			<div className="p-2 rounded-md w-full  items-start px-7 justify-start flex flex-col gap-1">
				<div className="flex flex-col w-full max-h-[55vh]">
					<div className="flex items-center w-full">
						{sujet?.urlsujet && !editMode && (
							<div className="container w-full mx-auto p-3">
								<div className="grid  grid-cols-2 mb-2 gap-full w-full gap-8">
									<div className="flex gap-2">
										<div className="text-2xl font-bold">Aperçu du Sujet</div>
										<div className="w-26 justify-end items-end grid grid-cols-2 gap-2">
											{user?.role == "professeur" && (
												<div className="flex flex-row gap-3">
													<Button
														onClick={() => setDialogOpen(true)}
														className="font-bold w-12 gap-2 bg-red-700 hover:bg-red-800">
														<Trash2 />
													</Button>
													<Button
														onClick={activeEdit}
														className="font-bold w-12 bg-black hover:bg-zinc-700 gap-2">
														<UserRoundPen />
													</Button>
												</div>
											)}
											<ConfirmDialog
												isOpen={isDialogOpen}
												message={`Etes-vous sûr de vouloir supprimer ${sujet?.nomsujet} ?`}
												onConfirm={() => {
													deleteSujet();
													setDialogOpen(false);
												}}
												onCancel={() => setDialogOpen(false)}
											/>
										</div>
									</div>
								</div>
								<div
									className={`grid  gap-4 w-full ${
										user.role != "professeur"
											? "grid-cols-2 "
											: "grid-cols-1 items-center justify-center"
									}`}>
									<div className="flex flex-row w-full ">
										<div
											className={`max-h-80 ${
												user.role != "professeur" ? " w-2/3 " : "w-full"
											}`}>
											<PdfViewer pdfUrl={sujet.urlsujet} />
											<div className="flex gap-1 my-3 w-[90%] items-center justify-center">
												<a
													href={sujet.urlsujet}
													target="_blank"
													rel="noopener noreferrer"
													className="text-base bg-black w-fit text-white hover:bg-zinc-400 font-bold leading-none cursor-pointer p-2 rounded-4xl">
													Cliquez pour voir
												</a>
											</div>
											<div className="flex flex-row  gap-4 mt-9 rounded-lg">
												<div className="">
													<div className="text-gray-500 text-sm ">
														Date limite de soumission
													</div>
													<div className="leading-6 mt-1 text-sm  font-bold">
														{" "}
														{new Date(
															sujet?.datesoumission as string
														).toLocaleDateString("fr-FR", {
															day: "2-digit",
															month: "long",
															year: "numeric",
														}) +
															" à " +
															new Date(
																sujet?.datesoumission as string
															).toLocaleTimeString("fr-FR", {
																hour: "2-digit",
																minute: "2-digit",
																second: "2-digit",
															})}
													</div>
												</div>

												<div className="">
													<div className="text-gray-500 text-sm ">
														Date de creation
													</div>
													<div className="leading-6 mt-1 text-sm  font-bold">
														{" "}
														{new Date(
															sujet?.created_at as string
														).toLocaleDateString("fr-FR", {
															day: "2-digit",
															month: "long",
															year: "numeric",
														}) +
															" à " +
															new Date(
																sujet?.created_at as string
															).toLocaleTimeString("fr-FR", {
																hour: "2-digit",
																minute: "2-digit",
																second: "2-digit",
															})}
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="w-full items-center  rounded-xl  justify-center flex flex-col gap-1">
										{!file && !copie && user.role != "professeur" && (
											<>
												<label
													htmlFor="file"
													className="cursor-pointer w-full h-full flex-col rounded-xl flex items-center justify-center bg-gray-200 hover:bg-gray-300 border-b">
													<img
														src="/upload.png"
														alt="Télécharger un fichier"
														className="w-24 h-24 rounded-full"
													/>
													Ajouter votre copie
												</label>
												<input
													type="file"
													id="file"
													className="hidden w-full h-full"
													accept="application/pdf"
													onChange={handleFileChange}
												/>
											</>
										)}
										{file && !copie && (
											<div className="mt-2 flex items-center justify-center flex-col text-center">
												<img
													src="/confirmation.png"
													alt="Télécharger un fichier"
													className="w-24 h-24 rounded-full"
												/>
												<p className="font-bold text-sm text-green-500 mt-2">
													Copie sélectionnée : {file.name}
												</p>
												<div className="mt-4 flex flex-row gap-2">
													<button
														type="button"
														onClick={handleRemoveFile}
														className="bg-red-500 text-white hover:bg-red-700 cursor-pointer rounded px-2 py-2 ">
														<Trash />
													</button>
													<button
														type="button"
														onClick={handleAddCopie}
														className="bg-blue-500 text-white hover:bg-blue-700 cursor-pointer rounded px-2 py-2 ">
														<Send />
													</button>
												</div>
											</div>
										)}
										{copie && (
											<div
												className={`flex items-center justify-center w-full h-full`}>
												<div className="flex flex-col w-2/3 h-full ">
													<div className="h-96 flex items-center justify-start flex-col gap-2">
														<PdfViewer pdfUrl={copie.urlcopie} />
														<div className="grid gap-1">
															<a
																href={copie.urlcopie}
																target="_blank"
																rel="noopener noreferrer"
																className="text-base mt-2 bg-black text-white hover:bg-zinc-400 font-bold leading-none cursor-pointer p-2 rounded-4xl">
																Cliquez pour voir
															</a>
														</div>
														<div className="flex-row flex gap-3 ">
															<div className="text-gray-500 text-sm sm:text-base">
																Copie soumis le
															</div>
															<div className=" text-sm sm:text-base font-bold">
																{" "}
																{new Date(
																	copie?.created_at as string
																).toLocaleDateString("fr-FR", {
																	day: "2-digit",
																	month: "long",
																	year: "numeric",
																}) +
																	" à " +
																	new Date(
																		copie?.created_at as string
																	).toLocaleTimeString("fr-FR", {
																		hour: "2-digit",
																		minute: "2-digit",
																		second: "2-digit",
																	})}
															</div>
														</div>
														<div className="flex-row flex gap-1 w-full items-center justify-center ">
															<div
																className={` font-bold   rounded-xl text-white p-2 ${
																	copie.notefinal && copie.notefinal >= 10
																		? "bg-green-600 text-sm sm:text-3xl"
																		: "bg-red-600 text-sm sm:text-base"
																}`}>
																{copie.notefinal ? (
																	copie.notefinal
																) : (
																	<p>Votre note n'est pas encore disponible</p>
																)}
															</div>
														</div>
													</div>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						)}
					</div>

					{editMode && sujet && (
						<form
							className="w: (
							
						)}-full mb-6"
							onSubmit={handleSubmit}>
							<div className="grid grid-cols-2 gap-36 rounded-lg">
								{/* <!-- First Bloc --> */}
								<div className="p-4">
									<div className="mb-4">
										<div className="text-gray-500 text-sm sm:text-base">
											Nom sujet
										</div>
										<input
											type="text"
											name="nomsujet"
											value={currentSujet.nomsujet}
											onChange={handleInputChange}
											placeholder="sujets"
											className="border p-2 rounded w-full"
											required
										/>
									</div>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-12 mt-16">
								<Button
									onClick={activeEdit}
									className="font-bold bg-white hover:text-slate-900 hover:bg-slate-100 text-slate-600  gap-2">
									<X />
								</Button>
								<Button type="submit" className="font-bold gap-2 ">
									<Save />
								</Button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default PersonalInfo;
