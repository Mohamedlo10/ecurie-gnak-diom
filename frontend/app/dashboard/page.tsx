"use client";

import { User } from "@/interface/type";
import { getSupabaseUser } from "@/lib/authMnager";
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};

export default function DashboardPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<User>(getSupabaseUser());
	let [color, setColor] = useState("#ffffff");

	const router = useRouter();
	async function fetchData() {
		setIsLoading(true);
		try {
		} catch (error) {
			console.error("Error fetching user details:", error);
		} finally {
			setIsLoading(false);
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
		<div className="chart-wrapper max-h-[90vh]  overflow-y-auto mx-auto flex max-w-8xl flex-col flex-wrap items-start justify-center gap-2 p-6 sm:flex-row sm:p-8">
			<div className="grid w-full mx-auto gap-2 sm:grid-cols-1 lg:grid-cols-1 ">
				<div className="w-full grid grid-cols-2 gap-2">
					<div className=" grid grid-cols-1 gap-2">
						{/* <BarChartComponent/> */}
						<div className=" grid grid-cols-2 gap-2">
							{/* <ClientPays /> */}

							{/* <GpPays/> */}
						</div>
					</div>
					<div className=" grid grid-cols-1 gap-2">
						<div className=" grid grid-cols-2 gap-2 ">
							<div className="">{/* <CirculaireComponent/> */}</div>
							<div className="">{/* <Commentaire/> */}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
