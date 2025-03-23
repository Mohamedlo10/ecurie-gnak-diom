"use client";

import { Button } from "@/components/ui/button";

import Drawer from "@mui/material/Drawer";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
	creerCours,
	getCoursByidEtudiant,
	getCoursByidProf,
} from "@/app/api/cours/query";
import { Cours, User } from "@/interface/type";
import { getSupabaseUser } from "@/lib/authMnager";
import { ChangeEvent, CSSProperties, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer } from "react-toastify";

const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
	opacity: 50,
};
// Composant principal de la page des utilisateurs
export default function Page() {
	const [cours, setCours] = useState<Cours | any>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedCours, setSelectedCours] = useState<any | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isAddingCours, setIsAddingCours] = useState(false);
	let [color, setColor] = useState("#ffffff");
	const [currentPage, setCurrentPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [cour, setcour] = useState({
		nomcours: "",
	});
	const router = useRouter();
	const [user, setUser] = useState<User>(getSupabaseUser());
	const [searchTerm, setSearchTerm] = useState("");
	const handleNavigation = (idcours: string) => {
		// Par exemple, naviguer vers la page de profil en passant l'ID de l'utilisateur en paramètre
		router.push(`/dashboard/mescours/profile?id=${idcours}`);
	};

	const filteredcours = cours.filter((cour: Cours) =>
		cour.nomcours.toLowerCase().includes(searchTerm.toLowerCase())
	);

	async function fetchData() {
		setIsLoading(true);
		try {
			if (user.role == "etudiant") {
				const data: any = await getCoursByidEtudiant(user.idutilisateur);
				if (data) {
					console.log(data);
					setCours(data);
				}
			} else if (user?.role == "professeur") {
				const data: any = await getCoursByidProf(user.idutilisateur);
				if (data) {
					console.log(data);
					setCours(data);
				}
			}
		} catch (error) {
			console.error("Error fetching user details:", error);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setcour({ ...cour, [name]: value });
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

		if (user?.idutilisateur) {
			try {
				const response = await creerCours(cour.nomcours, user?.idutilisateur);

				setcour({
					nomcours: "",
				});

				setIsDrawerOpen(false);
				setIsAddingCours(false);
				fetchData();
				setIsLoading(false);
				/*   toast.success(`Client ajouté avec succès: ${newClient.prenom}`);
          console.log(`Client ajouté avec succès: ${newClient.prenom}`);
    
        } else {
          console.error("Erreur lors de l'ajout du client");
          toast.error("Erreur lors de l'ajout du client");
        } */
			} catch (error) {
				console.error("Erreur lors de l'ajout du client:", error);
			}
		}
	};

	const handleAddCoursClick = () => {
		setIsAddingCours(true);
		setIsDrawerOpen(true);
	};

	const closeDrawer = () => {
		setIsDrawerOpen(false);
		setIsAddingCours(false);
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
			<div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
				<div className="flex items-center justify-between ">
					<div>
						<h2 className="text-4xl font-extrabold tracking-tight text-zinc-400">
							Cours
						</h2>
						<p className=" text-zinc-600 font-bold">Liste des Cours</p>
					</div>
					<div
						className={`flex items-center space-x-2 ${
							user?.role == "etudiant" ? "opacity-0" : "opacity-100"
						}`}>
						<Button
							type="button"
							disabled={user?.role == "etudiant"}
							className="w-fit h-10 cursor-pointer font-bold bg-red-600"
							onClick={handleAddCoursClick}>
							<Plus /> Ajouter un Cours
						</Button>
					</div>
				</div>
				<div className="flex items-center w-full max-w-md rounded-lg bg-gray-100 px-4 py-2 shadow-sm">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 text-gray-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 111.36-1.36L21 21z"
						/>
					</svg>
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Tapez pour rechercher..."
						className="ml-3 w-full border-none bg-transparent font-quick text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0"
					/>
				</div>

				{filteredcours.length > 0 ? (
					<div className="pl-12 pt-8 h-[53vh] overflow-y-auto grid grid-cols-5">
						{filteredcours.map((cour: Cours) => (
							<div
								key={cour.idcours}
								onClick={() => handleNavigation(cour.idcours)}
								className="h-fit border-1 rounded-2xl shadow-sm hover:bg-zinc-200 cursor-pointer w-[14vw] ">
								<div className="">
									<div className="flex px-3 flex-col items-center justify-center py-4">
										<div className="">
											<img
												src="/logo.jpg"
												alt="Image"
												width={800}
												height={800}
												className="h-14 w-14 object-cover rounded-full"
											/>
										</div>
										<div className="flex flex-col items-center justify-center  py-2">
											<div className="font-extrabold text-base w-full text-center truncate whitespace-nowrap max-w-[200px]">
												{cour.nomcours.length > 20
													? `${cour.nomcours.slice(0, 20)}...`
													: cour.nomcours}
											</div>

											{user?.role == "etudiant" ? (
												<>
													<div className="font-bold text-sm  text-zinc-400">
														Professeur
													</div>
													<div className="font-bold text-sm">
														{cour.prenom} {cour.nom}
													</div>
												</>
											) : (
												<div className="font-bold text-sm  text-zinc-400">
													Moi
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="h-[53vh] w-full flex items-center justify-center text-xl text-zinc-500 font-bold">
						Pas de cours
					</div>
				)}

				<div className=" flex items-center justify-end text-sm text-zinc-500 font-bold">
					Nombre de cours : {filteredcours.length}
				</div>
			</div>

			<Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
				<div className="p-4 flex items-center h-[100vh] w-[32vw]">
					{isAddingCours && (
						// Formulaire d'ajout de cour
						<div className="flex w-full max-w-xl flex-col items-center border bg-white p-10 text-left">
							<h2 className="mb-8 text-2xl font-bold">
								Ajouter un Nouveau Cours
							</h2>
							<form className="w-full" onSubmit={handleSubmit}>
								<div className="mb-4">
									<label className="block text-sm font-medium mb-2">
										Nom du cours
									</label>
									<input
										type="text"
										name="nomcours"
										value={cour.nomcours}
										onChange={handleInputChange}
										placeholder="Nom du cours"
										className="border p-2 rounded w-full"
										required
									/>
								</div>

								<div className="ml-auto pt-8 w-full items-center justify-center flex font-medium">
									<Button type="submit" className="w-fit h-10 font-bold">
										Ajouter le cours
									</Button>
								</div>
							</form>
							<ToastContainer />
						</div>
					)}
				</div>
			</Drawer>
		</>
	);
}
