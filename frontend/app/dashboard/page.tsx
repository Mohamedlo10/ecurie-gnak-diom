"use client";

import EtudiantsCoursComponent from "@/components/ui/home/etudiants-cours-chart";
import EtudiantMoyenneCours from "@/components/ui/home/moyenne-cours";
import MoyenneGeneraleEtudiant from "@/components/ui/home/moyenneGenerale";
import SujetDetailsComponent from "@/components/ui/home/note-sujet-details";
import EtudiantsRenduSujetComponent from "@/components/ui/home/sujets-etudiants-rendus";
import SujetTraiterParEtudiant from "@/components/ui/home/sujetTraiteParEtudiant";
import { Statistique, User } from "@/interface/type";
import { getSupabaseUser } from "@/lib/authMnager";
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { getStatistique } from "../api/stastique/query";

const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};

export default function DashboardPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<User>(getSupabaseUser());
	let [color, setColor] = useState("#ffffff");
	const [statistique, setstatistique] = useState<Statistique>();

	const router = useRouter();
	async function fetchData() {
		setIsLoading(true);
		if (user.role == "professeur") {
			try {
				if (user.idutilisateur) {
					const data: any = await getStatistique(user.idutilisateur);
					if (data) {
						console.log(data);
						setstatistique(data);
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
		} else if (user.role == "etudiant") {
			try {
				if (user.idutilisateur) {
					/* const data: any = await getStatistique(user.idutilisateur);
					if (data) {
						console.log(data);
						setstatistique(data);
					} */
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
		<div className="chart-wrapper max-h-[85vh]  overflow-y-auto mx-auto flex max-w-8xl flex-col flex-wrap items-start justify-center gap-2 p-6 sm:flex-row sm:p-8">
			{statistique && (
				<div className="w-full h-full grid mx-auto grid-cols-2 px-4 gap-12">
					<EtudiantsCoursComponent
						nbInscritsCours={statistique.nbInscritsCours}
					/>
					<SujetDetailsComponent noteSujets={statistique.notesSujets} />
					<EtudiantMoyenneCours
						moyenneParCours={statistique.moyennesParCours}
					/>
					<EtudiantsRenduSujetComponent
						nbEtudiantsParSujet={statistique.nbEtudiantsParSujet}
					/>
					<MoyenneGeneraleEtudiant
						moyenneEtudiant={statistique.moyennesEtudiants}
					/>
					<SujetTraiterParEtudiant
						sujetsTraitesParEtudiant={statistique.sujetsTraitesParEtudiant}
					/>
				</div>
			)}
		</div>
	);
}
