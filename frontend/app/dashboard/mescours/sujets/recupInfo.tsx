"use client";
import { getSujetByid } from "@/app/api/sujet/query";
import { Button } from "@/components/ui/button";
import { Sujet, User } from "@/interface/type";
import { getSupabaseUser } from "@/lib/authMnager";
import { useRouter, useSearchParams } from "next/navigation";
import { CSSProperties, useEffect, useRef, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import CorrectionInfo from "./correction/correctionInfo";
import ListeCopie from "./listecopie/listecopie";
import PersonalInfo from "./personalInfo";

const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};

const RecupInfo = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [sujet, setSujet] = useState<Sujet>();
	const [isLoading, setIsLoading] = useState(true);
	let [color, setColor] = useState("#ffffff");
	const [userImage, setuserImage] = useState<string>("/avatars/01.png");
	const router = useRouter();
	const searchParams = useSearchParams();
	const sujetId = searchParams.get("id");
	const [user, setUser] = useState<User>(getSupabaseUser());
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleRetour = () => {
		// Logique pour retourner
		console.log("Retour");
		router.back();
	};

	const getInitials = (name: string, name2: string) => {
		const initial1 = name
			?.split(" ")
			.map((word: string) => word[0])
			.join("");
		const initial2 = name2
			?.split(" ")
			.map((word: string) => word[0])
			.join("");
		const initials = initial1 + initial2;
		return initials?.toUpperCase();
	};

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			if (sujetId) {
				try {
					const data: any = await getSujetByid(sujetId);
					if (data != null) {
						console.log(data);
						setSujet(data);
					}
					/*   const data2: any = await userInfo()
          if (data2 != null) {
            console.log(data2?.user_metadata.poste?.access_groups.utilisateurs)
            if(data2?.user_metadata.poste?.access_groups.utilisateurs)
              {
                console.log("autoriser...")
              }
              else
              {
                router.push(`/dashboard`);
              }
            } */
				} catch (error) {
					console.error("Error fetching user details:", error);
				} finally {
					setIsLoading(false);
				}
			}
		}
		fetchData();
		setIsLoading(false);
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
		<div className="flex flex-col w-full flex-auto min-w-0">
			{/* Header */}
			<div className="p-4 w-full">
				<button
					className="rounded-xl cursor-pointer hover:bg-zinc-200 p-1"
					onClick={handleRetour}>
					{/* Remplacer mat-icon par une icône équivalente */}
					<svg
						className="m-1 h-6 w-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
				<div className="flex flex-row w-full  rounded-xl  items-center justify-center max-w-screen-xl mx-auto px-6 sm:px-8 text-lg md:text-3xl font-semibold  tracking-tight leading-7 md:leading-snug truncate py-2">
					{/* Avatar and name */}
					Sujet : {sujet?.nomsujet}
				</div>
			</div>

			{/* Main */}
			<div className="flex-auto bg-white -mt-px">
				<div className="w-full max-w-screen-xl mx-auto">
					{/* Tabs */}
					<div className="tabs flex flex-row gap-28 p-2 pt-2 items-center justify-center">
						<Button
							className={` hover:text-white hover:bg-black hover:opacity-100 transition-shadow font-bold tab ${
								activeTab === 0
									? "active bg-black text-white"
									: " opacity-70 bg-white text-black"
							}`}
							onClick={() => setActiveTab(0)}>
							Informations
						</Button>
						{user.role == "professeur" && (
							<>
								<Button
									className={` hover:text-white hover:bg-black hover:opacity-100 transition-shadow font-bold tab ${
										activeTab === 1
											? "active bg-black text-white"
											: " opacity-70 bg-white text-black"
									}`}
									onClick={() => setActiveTab(1)}>
									Correction
								</Button>
								<Button
									className={` hover:text-white hover:bg-black hover:opacity-100 transition-shadow font-bold tab ${
										activeTab === 2
											? "active bg-black text-white"
											: " opacity-70 bg-white text-black"
									}`}
									onClick={() => setActiveTab(2)}>
									Liste des copies
								</Button>
							</>
						)}
					</div>

					{/* Tab content */}
					<div className="tab-content">
						{activeTab === 0 && (
							<div>
								<PersonalInfo sujet={sujet} />
							</div>
						)}
						{activeTab === 1 && (
							<div>
								{" "}
								<CorrectionInfo sujetId={sujet?.idsujet} />{" "}
							</div>
						)}
						{activeTab === 2 && (
							<div>
								{" "}
								<ListeCopie sujetId={sujet?.idsujet} />{" "}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecupInfo;
