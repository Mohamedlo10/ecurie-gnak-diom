"use client";
import { User } from "@/interface/type";

import { CSSProperties, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};

function Navbar() {
	const [user, setUser] = useState<User>(getSupabaseUser());
	let [color, setColor] = useState("#ffffff");
	const [isLoading, setIsLoading] = useState(false);
	function getSupabaseUser() {
		const sessionData = localStorage.getItem("user_session");
		return sessionData ? JSON.parse(sessionData) : null;
	}
	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			try {
			} catch (error) {
				console.error("Error fetching user details:", error);
			} finally {
				setIsLoading(false);
			}
		}
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
		<div className=" flex-col flex h-full border-b px-4 lg:h-22 lg:px-6">
			<header className="flex items-center gap-4   bg-white px-10 h-full ">
				<div className="w-full">
					<form>
						<div className="relative ">
							{/*   <Search className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full appearance-none h-12 bg-background bg-white shadow-sm pl-12  md:w-2/3 lg:w-1/2"
            /> */}
						</div>
					</form>
				</div>
				<div className="grid grid-cols-8 items-center  gap-8 w-60">
					<div className="col-span-8 flex flex-row gap-4 justify-center items-center rounded-xl">
						<img
							src="/logo.jpg"
							alt="Image"
							width={800}
							height={800}
							className="h-14 w-14 object-cover rounded-full"
						/>
						<div className="items-start font-extrabold text-red-700 flex flex-col  justify-center h-full  ">
							<div>{user?.role == "etudiant" ? "Etudiant" : "Professeur"}</div>

							<div className="text-black">
								{user?.prenom} {user?.nom}
							</div>
						</div>
					</div>
				</div>
			</header>
		</div>
	);
}

export default Navbar;
