"use client";
import { userDeConnection } from "@/app/api/utilisateur/query";
import { User } from "@/interface/type";
import { getSupabaseUser } from "@/lib/authMnager";
import {
	CircleSlash,
	DockIcon,
	Home,
	LogOut,
	Notebook,
	Package2,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import ConfirmDialog from "./dialogConfirm";
const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};

export const paths = ["utilisateurs"];

function Sidebar() {
	const router = useRouter();
	const pathname = usePathname();
	const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useState<User>();
	let [color, setColor] = useState("#ffffff");
	const [error, setError] = useState("");
	const toggleSubMenu = () => {
		setIsSubMenuOpen(!isSubMenuOpen);
	};

	const handleNavigation = () => {
		router.push(`/`);
	};

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			try {
				setUser(getSupabaseUser());
			} catch (error) {
				console.error("Error fetching user details:", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, []);

	useEffect(() => {
		if (!pathname.startsWith("/dashboard/utilisateurs")) {
			setIsSubMenuOpen(false);
		}
	}, [pathname]);

	const handleLogOut = async () => {
		setIsLoading(true);
		setError("");

		userDeConnection();
		router.push(`/`);
		setIsLoading(false);
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
		<div className="h-[100vh]">
			<div className="flex h-[8vh] items-center border-b px-4 lg:h-22 lg:px-6">
				<div className="flex items-center gap-4 font-semibold">
					<Package2 className="h-8 w-8 p-2 bg-white text-red-700 rounded-full" />
					<span className="text-white font-bold">ELITE</span>
				</div>
			</div>

			<div className="relative top-8">
				<nav className="grid gap-1 items-start text-sm font-medium px-3 lg:px-6">
					<div className="px-1 font-bold text-gray-100 pb-3">MENU</div>

					<Link
						href="/dashboard"
						className={`flex items-center gap-3 rounded-lg lg:px-3 px-2 py-2 font-bold transition-all ${
							pathname === "/dashboard"
								? "bg-white text-red-700 shadow-lg"
								: "text-white hover:bg-white hover:text-red-700"
						}`}>
						<Home className="h-8 w-4" />
						Dashboard
					</Link>

					<Link
						href="/dashboard/mescours"
						className={`flex items-center gap-3 rounded-lg lg:px-3 px-2 py-2 font-bold transition-all ${
							pathname === "/dashboard/mescours" ||
							pathname === "/dashboard/mescours/profile"
								? "bg-white text-red-700 shadow-lg"
								: "text-white hover:bg-white hover:text-red-700"
						}`}>
						<CircleSlash className="h-8 w-4" />
						Mes cours
					</Link>

					{
						<Link
							href="/dashboard/messujets"
							className={`flex items-center gap-3 rounded-lg lg:px-3 px-2 py-2 font-bold transition-all ${
								pathname === "/dashboard/messujets" ||
								pathname === "/dashboard/messujets/profile" ||
								pathname === "/dashboard/mescours/sujets" ||
								pathname === "/dashboard/messujets/sujets"
									? "bg-white text-red-700 shadow-lg"
									: "text-white hover:bg-white hover:text-red-700"
							}`}>
							<DockIcon className="h-8 w-4" />
							Mes sujets
						</Link>
					}
					{user?.role == "etudiant" && (
						<Link
							href="/dashboard/mescopies"
							className={`flex items-center gap-3 rounded-lg lg:px-3 px-2 py-2 font-bold transition-all ${
								pathname === "/dashboard/mescopies" ||
								pathname === "/dashboard/mescopies/profile" ||
								pathname === "/dashboard/mescopies/sujets"
									? "bg-white text-red-700 shadow-lg"
									: "text-white hover:bg-white hover:text-red-700"
							}`}>
							<Notebook className="h-8 w-4" />
							Mes notes
						</Link>
					)}
				</nav>
			</div>

			<div className="relative top-24">
				<nav className="grid gap-1 items-start px-1 text-sm font-medium lg:px-6">
					<div className="px-1 font-bold text-gray-100 pb-3">OTHERS</div>

					<Link
						href="/dashboard/profile"
						className={`flex items-center gap-3 rounded-lg lg:px-3 px-2 py-2 font-bold transition-all ${
							pathname === "/dashboard/profile"
								? "bg-white text-red-700 shadow-lg"
								: "text-white hover:bg-white hover:text-red-700"
						}`}>
						<Users className="h-8 w-4" />
						Profile
					</Link>

					<button
						onClick={() => setDialogOpen(true)}
						className={`flex items-center gap-3 cursor-pointer rounded-lg lg:px-3 px-2 py-2 font-bold transition-all ${
							pathname === "/"
								? "bg-white text-red-700 shadow-lg"
								: "text-white hover:bg-white hover:text-red-700"
						}`}>
						<LogOut className="h-8 w-4" />
						Deconnexion
					</button>
					<ConfirmDialog
						isOpen={isDialogOpen}
						message={`Etes-vous sûr de vouloir-vous deconnecter ?`}
						onConfirm={() => {
							handleLogOut();
							setDialogOpen(false);
						}}
						onCancel={() => setDialogOpen(false)}
					/>
				</nav>
			</div>
		</div>
	);
}

export default Sidebar;
