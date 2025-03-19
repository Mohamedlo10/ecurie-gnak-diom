"use client";
import React, { ChangeEvent } from 'react';

import { creerSujet, getSujetByidCours, supprimerSujet } from '@/app/api/sujet/query';
import { Button } from "@/components/ui/button";
import { Sujet, User } from "@/interface/type";
import { getSupabaseUser } from "@/lib/authMnager";
import Drawer from '@mui/material/Drawer';
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Plus, Trash } from "lucide-react";
import { useRouter } from 'next/navigation';
import { CSSProperties, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer } from 'react-toastify';
import { columns } from "./components/columns";
import { DataTable } from './components/data-table';


const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

type SujetsInfoProps = {
  coursId: string | null | undefined;
};

const SujetsInfo: React.FC<SujetsInfoProps> = ({ coursId }) => {

    const [sujets, setsujets] = useState<Sujet | any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedsujet, setSelectedsujet] = useState<Sujet | any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAddingsujet, setIsAddingsujet] = useState(false);
    let [color, setColor] = useState("#ffffff");
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sujet, setsujet] = useState({
      nomsujet:"",
      datesoumission:""
    });
    const router = useRouter();
    const [user, setUser] = useState<User>();
    const [searchTerm, setSearchTerm] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

      if(event.target.files)
      { 
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
    const handleSujetClick = (sujet: any) => {
      setSelectedsujet(sujet);
      setIsAddingsujet(false);
      setIsDrawerOpen(true);
    };
   
      const handleNavigation = (idsujet:string) => {
        router.push(`/dashboard/sujet?id=${idsujet}`);
      };
    
      const filteredsujets = sujets.filter((sujet:Sujet) =>
        sujet.nomsujet.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const handleRemoveFile = () => {
        setFile(null); 
      };
  
      async function fetchData() {
        setIsLoading(true)
          const user = getSupabaseUser()
          setUser(user)
          try {
            if(coursId){
              const data: any = await getSujetByidCours(coursId)
              if (data) {
                console.log(data)
                setsujets(data)         
              } 
            }     
                } catch (error) {
                  console.error("Error fetching user details:", error)
                } finally {
                  setIsLoading(false)
                }
        
      }
    
    useEffect(() => {
      fetchData()
    }, [])
  
  
    const handleInputChange = (e : ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setsujet({ ...sujet, [name]: value });
    };
  
    

    const deleteSujet = async (idSujet:string) => {
      setIsLoading(true)

        try{
          const response = await supprimerSujet(idSujet)
          console.log("Suppression reussi")
          fetchData();
          setIsLoading(false)

          closeDrawer();
      
        }catch(error)
        {
          console.error("Erreur lors de la Suppression du cour:", error); 
        }
     
    }
  
  
     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true)
     if(user?.role=="etudiant"){
        console.log("non autoriser")
        setIsLoading(false)
        return -1;
     }
    console.log("autoriser")
  
    if(coursId && file)
    {
      try {
        const response = await creerSujet(sujet.nomsujet,coursId,file,sujet.datesoumission)
    
        setsujet({
              nomsujet:"",
              datesoumission:""
            });
            handleRemoveFile();
            setIsDrawerOpen(false);
            setIsAddingsujet(false);
            fetchData();
          setIsLoading(false)
          /*   toast.success(`Client ajouté avec succès: ${newClient.prenom}`);
            console.log(`Client ajouté avec succès: ${newClient.prenom}`);
      
          } else {
            console.error("Erreur lors de l'ajout du client");
            toast.error("Erreur lors de l'ajout du client");
          } */
        } catch (error) {
          console.error("Erreur lors de l'ajout du client:", error);
          setIsLoading(false)

        }
      }; 
    }
     
  
    const handleAddsujetClick = () => {
      setIsAddingsujet(true);
      setIsDrawerOpen(true);
    };
  
    const closeDrawer = () => {
      setIsDrawerOpen(false);
      setIsAddingsujet(false);
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
                onClick={handleAddsujetClick}
              >
                <Plus /> Ajouter un Sujet
              </Button>
  
      </div>)}
  
        <div className="hidden max-h-[48vh] overflow-y-auto flex-1 px-10 flex-col p-2 md:flex">
          {/* Tableau des données */}
          <DataTable 
          data={filteredsujets}
          columns={columns}
          onRowClick={handleSujetClick}
          currentPage={currentPage} 
          total={total} 
          setCurrentPage={setCurrentPage} 
        />
  
        
         
        </div>
  
        <Drawer anchor='right' open={isDrawerOpen} onClose={closeDrawer}>
          <div className="p-4 mt-24 flex w-[30vw]">
              { !isAddingsujet ? (
               <div className="flex flex-1 flex-col h-full overflow-y-auto items-center justify-center">
               <div className="flex w-full max-w-xl flex-col items-center justify-center bg-slate-50 p-8 text-left">
       
                       <div className="flex flex-row gap-2 w-full mb-4">
                           <div className="flex flex-col w-full items-center gap-2 ">
                                       <div className="mb-2 text-base font-bold leading-none">
                                         Sujet
                                       </div>
                                           <Avatar className="hidden h-28 w-28  sm:flex">
                                           <AvatarImage src="/evaluation.png" className="rounded-full object-cover w-full h-full" alt="Avatar" />
                                           <AvatarFallback>sujet</AvatarFallback>
                                           </Avatar>
                                           <div className="grid gap-1">
                                           <p className="text-base font-bold leading-none text-red-700">
                                           
                                           {selectedsujet?.nomsujet} 
                                           </p>
                                           </div>
                           
                           </div>
                       </div>
                      
                       
                       <div className="pt-8 px-2 lg:px-2 xl:px-2 w-full grid items-center gap-0 justify-center grid-cols-2">
                         <div className="flex flex-col w-full col-span-2 gap-2 ">
                         <div className="text-base grid grid-cols-1 gap-auto items-center justify-center font-bold w-full mt-4">
                             <div className="line-clamp-2 flex flex-row gap-12 p-1 font-bold text-base text-muted-foreground">Nom du sujet: </div>
                             <div className="text-base text-red-700 flex items-start w-full justify-start">
                             {selectedsujet?.nomsujet}
                             </div>
                           </div>
                           <div className="text-base grid grid-cols-1 gap-auto items-center justify-center font-bold  w-full mt-4">
                             <div className="line-clamp-2 flex flex-row gap-2 p-1 font-bold text-base text-muted-foreground">Date de creation: </div>
                             <div className="text-base text-red-700 line-clamp-3 flex items-start w-full justify-start">
                             {selectedsujet?.created_at &&
                                new Date(selectedsujet.created_at as string).toLocaleDateString("fr-FR", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                }) +
                                " à " +
                                new Date(selectedsujet.created_at as string).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })}

                             </div>
                           </div>
                           <div className="text-base grid grid-cols-1 gap-auto items-center justify-center font-bold  w-full mt-4">
                             <div className="line-clamp-2 flex flex-row gap-2 p-1 font-bold text-base text-muted-foreground">Date limite de soumission: </div>
                             <div className="text-base text-red-700 line-clamp-3 flex items-start w-full justify-start">
                             {selectedsujet?.datesoumission &&
                                  new Date(selectedsujet.datesoumission as string).toLocaleDateString("fr-FR", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  }) +
                                  " à " +
                                  new Date(selectedsujet.datesoumission as string).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  })}

                             </div>
                           </div>
                         </div>
                         
  
      
                          
                         
                           
                           </div>
                           <div className="ml-auto pt-14 w-full items-center justify-center flex font-medium">
                           {(<div className="w-full flex justify-center items-center px-10">
                              <Button
                                        type="button"
                                        className="w-fit h-10 cursor-pointer text-sm font-bold bg-black"
                                      onClick={() => handleNavigation(selectedsujet?.idsujet)}
                                      >
                                         Voir details
                                      </Button>
                                      </div>
                                      )}
                                    
                           </div>
                     </div>
               </div>
              ):(
                <div className="flex w-full max-w-xl flex-col items-center border bg-white p-10 text-left">
                <h2 className="mb-8 text-2xl font-bold">Ajouter un Nouveau sujet</h2>
                <form className="w-full" onSubmit={handleSubmit}>
               
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Nom du sujet</label>
                    <input
                        type="text"
                        name="nomsujet"
                        value={sujet.nomsujet || ""}
                        onChange={handleInputChange}
                        placeholder="Nom du sujet"
                        className="border p-2 rounded w-full"
                        required
                      />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Date limite de soumission</label>
                    <input
                      type="date"
                      name="datesoumission"
                      value={sujet.datesoumission || ""}
                      onChange={handleInputChange}
                      className="border p-2 rounded w-full"
                      required
                    />
                  </div>
                  <div className="w-full items-center justify-center flex flex-col gap-1">
                  {!file && (
                    <>
                    <label htmlFor="file" className="cursor-pointer">
                      <img
                        src="/logo.jpg"
                        alt="Télécharger un fichier"
                        className="w-24 h-24 rounded-full" 
                      />
                    </label>
                    <input
                      type="file"
                      id="file"
                      className="hidden" 
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                    <div>Appuyer pour upload un fichier</div>
                    </>
                  )}
                    {file && (
                      <div className="mt-2 flex items-center justify-center flex-col text-center">
                        <img
                        src="/confirmation.png"
                        alt="Télécharger un fichier"
                        className="w-24 h-24 rounded-full" 
                      />
                        <p className='font-bold text-sm text-green-500 mt-2'>Fichier sélectionné : {file.name}</p>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="bg-red-500 text-white cursor-pointer rounded px-2 py-2 mt-2"
                        >
                          <Trash/>
                        </button>
                      </div>
                    )}
                  </div>
                  
                
                  <div className="ml-auto pt-8 w-full items-center justify-center flex font-medium">
                    <Button type="submit" disabled={!file || sujet.datesoumission=="" || sujet.nomsujet==""} className="w-fit h-10 font-bold">Ajouter le sujet</Button>
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

export default SujetsInfo

