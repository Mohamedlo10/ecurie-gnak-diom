"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { ChangeEvent } from 'react';

import { getEtudiantsByIdCours } from "@/app/api/cours/query";
import { insererEtudiantDansCours } from "@/app/api/suivre/query";
import { Button } from "@/components/ui/button";
import { Etudiant, User } from "@/interface/type";
import { getSupabaseUser } from "@/lib/authMnager";
import Drawer from '@mui/material/Drawer';
import { Plus } from "lucide-react";
import { useRouter } from 'next/navigation';
import { CSSProperties, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

type EtudiantsInfoProps = {
  coursId: string | null | undefined;
};

const EtudiantsInfo: React.FC<EtudiantsInfoProps> = ({ coursId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEtudiant, setSelectedEtudiant] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  let [color, setColor] = useState("#ffffff");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState<User>();
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [isAddingEtudiant, setIsAddingEtudiant] = useState(false);
  const [emailEtudiant, setemailEtudiant] = useState({
    email:""
  });
  const handleInputChange = (e : ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setemailEtudiant({ ...emailEtudiant, [name]: value });
  };

  async function fetchData() {
    const user = getSupabaseUser()
      setUser(user)
    if(coursId)
    {
    setIsLoading(true)
      try {

        const data: any = await getEtudiantsByIdCours(coursId)
        console.log(data)

        if (data && data.length > 0) {
          console.log(data)
          setEtudiants(data)
          setTotal(data.length); 
         
        }
        
      } catch (error) {
        console.error("Error fetching room details:", error)
      } finally {
        setIsLoading(false)
      }
    }
  
  }

  useEffect(() => {
   
    fetchData()
  }, [])

const router = useRouter();

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true)
 if(user?.role=="etudiant"){
    console.log("non autoriser")
    setIsLoading(false)
    return -1;
 }
console.log("autoriser")

if(coursId && user?.role=="professeur")
{
  try {
    const response = await insererEtudiantDansCours(coursId,emailEtudiant?.email)

      setemailEtudiant({
          email:""
        });

        setIsDrawerOpen(false);
        setIsAddingEtudiant(false);
        fetchData();
        setIsLoading(false)
      /*   toast.success(`Client ajouté avec succès: ${newClient.prenom}`);
        console.log(`Client ajouté avec succès: ${newClient.prenom}`);
  
      } else {
        console.error("Erreur lors de l'ajout du client");
        toast.error("Erreur lors de l'ajout du client");
      } */
    } catch (error) {
      setIsLoading(false)
      console.error("Erreur lors de l'ajout du client:", error);
    }
  }; 
}
 

const handleNavigation = (idUser:string) => {
  // Par exemple, naviguer vers la page de profil en passant l'ID de l'utilisateur en paramètre
  router.push(`/dashboard/utilisateurs/Clients/profile?id=${idUser}`);
};

  const handleUserClick = (user: any) => {
    setSelectedEtudiant(user);

    setIsAddingEtudiant(false);
    setIsDrawerOpen(true);
  };

  const handleAddCoursClick = () => {
    setIsAddingEtudiant(true);
    setSelectedEtudiant(null);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedEtudiant(null);
    setIsAddingEtudiant(false);
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
    {user?.role=="professeur" &&(<div className="w-full flex justify-end items-end px-10">
    <Button
              type="button"
              disabled={user?.role!="professeur"}
              className="w-fit h-10 cursor-pointer text-sm font-bold bg-red-700"
              onClick={handleAddCoursClick}
            >
              <Plus /> Ajouter un Etudiant
            </Button>

    </div>)}

      <div className="hidden max-h-[48vh] overflow-y-auto flex-1 px-10 flex-col p-2 md:flex">
        {/* Tableau des données */}
        <DataTable 
        data={etudiants}
        columns={columns}
        onRowClick={handleUserClick}
        currentPage={currentPage} 
        total={total} 
        setCurrentPage={setCurrentPage} 
      />

      
       
      </div>

      <Drawer anchor='right' open={isDrawerOpen} onClose={closeDrawer}>
        <div className="p-4 mt-24 flex w-[30vw]">
            { !isAddingEtudiant ? (
             <div className="flex flex-1 flex-col h-full overflow-y-auto items-center justify-center">
             <div className="flex w-full max-w-xl flex-col items-center justify-center bg-slate-50 p-8 text-left">
     
                     <div className="flex flex-row gap-2 w-full mb-4">
                         <div className="flex flex-col w-full items-center gap-2 ">
                                     <div className="mb-2 text-base font-bold leading-none">
                                       Etudiant
                                     </div>
                                         <Avatar className="hidden h-28 w-28  sm:flex">
                                         <AvatarImage src="/utilisateur.png" className="rounded-full object-cover w-full h-full" alt="Avatar" />
                                         <AvatarFallback>client</AvatarFallback>
                                         </Avatar>
                                         <div className="grid gap-1">
                                         <p className="text-base font-bold leading-none text-red-700">
                                         
                                         {selectedEtudiant?.prenom} {selectedEtudiant?.nom}
                                         </p>
                                         </div>
                         
                         </div>
                     </div>
                    
                     
                     <div className="pt-8 px-2 lg:px-2 xl:px-2 w-full grid items-center gap-0 justify-center grid-cols-2">
                       <div className="flex flex-col w-full col-span-2 gap-2 ">
                       <div className="text-base grid grid-cols-2 gap-auto items-center justify-center font-bold w-full mt-4">
                           <div className="line-clamp-2 flex flex-row gap-12 p-1 font-bold text-base text-muted-foreground">INE: </div>
                           <div className="text-base text-red-700 flex items-end w-full justify-end">
                           {selectedEtudiant?.ine}
                           </div>
                         </div>
                         <div className="text-base grid grid-cols-2 gap-auto items-center justify-center font-bold  w-full mt-4">
                           <div className="line-clamp-2 flex flex-row gap-2 p-1 font-bold text-base text-muted-foreground">Mail </div>
                           <div className="text-base text-red-700 flex items-end w-full justify-end">
                           {selectedEtudiant?.email}
                           </div>
                         </div>
                       </div>
                       

    
                        
                       
                         
                         </div>
                         <div className="ml-auto pt-24 w-full items-center justify-center flex font-medium">
                              -
                         </div>
                   </div>
             </div>
            ):(
              <div className="flex w-full max-w-xl flex-col items-center border bg-white p-10 text-left">
              <h2 className="mb-8 text-2xl font-bold">Ajouter un Nouveau Cours</h2>
              <form className="w-full" onSubmit={handleSubmit}>
              <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email de l'etudiant</label>
              <input
                  type="text"
                  name="email"
                  value={emailEtudiant.email}
                  onChange={handleInputChange}
                  placeholder="Nom du cours"
                  className="border p-2 rounded w-full"
                  required
                />
            </div>
            <div className="ml-auto pt-8 w-full items-center justify-center flex font-medium">
                  <Button type="submit"  className="w-fit h-10 font-bold">Ajouter le cours</Button>
                </div>
              </form>
            </div>
            )}
        </div>
      </Drawer>
  </>
  );


}


export default EtudiantsInfo

  

   