"use client";
import React, { ChangeEvent } from 'react';

import { Button } from "@/components/ui/button";
import {  Sujet, User } from "@/interface/type";
import { getSupabaseUser } from "@/lib/authMnager";
import Drawer from '@mui/material/Drawer';
import { Plus } from "lucide-react";
import { useRouter } from 'next/navigation';
import { CSSProperties, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer } from 'react-toastify';
import { getSujetByidCours } from '@/app/api/sujet/query';


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
    const [selectedsujet, setSelectedsujet] = useState<any | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAddingsujet, setIsAddingsujet] = useState(false);
    let [color, setColor] = useState("#ffffff");
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sujet, setsujet] = useState({
      nomsujet:""
    });
    const router = useRouter();
    const [user, setUser] = useState<User>();
    const [searchTerm, setSearchTerm] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        setFile(event.target.files[0]);
      }
    };
  
      const handleNavigation = (idsujet:string) => {
        router.push(`/dashboard/messujet/profile?id=${idsujet}`);
      };
    
      const filteredsujet = sujets.filter((sujet:Sujet) =>
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
                setsujet(data)         
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
  
    

  
  
  
     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true)
     if(user?.role=="etudiant"){
        console.log("non autoriser")
        setIsLoading(false)
        return -1;
     }
    console.log("autoriser")
  
    if(user?.idutilisateur)
    {
      try {
        // const response = await creersujet(cour.nomsujet,user?.idutilisateur)
    
        setsujet({
              nomsujet:""
            });
    
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
        <div className="hidden h-full flex-1 flex-col space-y-8 py-6 px-10  md:flex">
          <div className="flex items-center justify-between ">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-zinc-400">sujet</h2>
              <p className=" text-zinc-600 font-bold">Liste des sujet</p>
            </div>
            <div className={`flex items-center space-x-2 ${user?.role=="etudiant"?"opacity-0":"opacity-100"}`}>
              <Button
                type="button"
                disabled={user?.role=="etudiant"}
                className="w-fit h-10 cursor-pointer font-bold bg-red-600"
                onClick={handleAddsujetClick}
              >
                <Plus /> Ajouter un sujet
              </Button>
            </div>
          </div>
            <div className="flex items-center w-full max-w-md rounded-lg bg-gray-100 px-4 py-2 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth="2"  >
                    <path  strokeLinecap="round"   strokeLinejoin="round"  d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 111.36-1.36L21 21z"/>
                  </svg>
                    <input type="text" value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tapez pour rechercher..."
                    className="ml-3 w-full border-none bg-transparent font-quick text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0"/>
            </div>
  
      {filteredsujet.length>0 ?(<div className="pl-12 pt-8 h-[30vh] overflow-y-auto grid grid-cols-5">
      {filteredsujet.map((sujet:Sujet)=>(
                    
                    <div 
                    key={sujet.idsujet}
                    onClick={() => handleNavigation(sujet.idsujet)} className="h-fit border-1 rounded-2xl shadow-sm hover:bg-zinc-200 cursor-pointer w-[14vw] ">
                                
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
                            {sujet.nomsujet.length > 20 ? `${sujet.nomsujet.slice(0, 20)}...` : sujet.nomsujet}
                          </div>
  
                          
                        {user?.role=="etudiant"? (  <>
                          <div className="font-bold text-sm  text-zinc-400">Nom sujet</div>
                            <div className="font-bold text-sm">{sujet.nomsujet} </div>
                          </>):(
                          <div className="font-bold text-sm  text-zinc-400">Moi</div>
  
                          )}
                          
                          
  
                          </div>
                        </div>               
                        
                    </div>
       
                  </div>
                              
                  ))}
  
      </div>):(
        <div className="h-[30vh] w-full flex items-center justify-center text-xl text-zinc-500 font-bold">Pas de sujet</div>
      )}
        
        <div className=" flex items-center justify-end text-sm text-zinc-500 font-bold">Nombre de sujet : {filteredsujet.length}</div>
         
        </div>
  
        <Drawer anchor='right' open={isDrawerOpen} onClose={closeDrawer}>
          <div className="p-4 flex items-center h-[100vh] w-[32vw]">
            {isAddingsujet &&(
              <div className="flex w-full max-w-xl flex-col items-center border bg-white p-10 text-left">
                <h2 className="mb-8 text-2xl font-bold">Ajouter un Nouveau sujet</h2>
                <form className="w-full" onSubmit={handleSubmit}>
               
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Nom du sujet</label>
                    <input
                        type="text"
                        name="nomsujet"
                        value={sujet.nomsujet}
                        onChange={handleInputChange}
                        placeholder="Nom du sujet"
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
                      onChange={handleFileChange}
                    />
                    <div>Appuyer pour upload un fichier</div>
                    </>
                  )}
                    {file && (
                      <div className="mt-2 text-center">
                        <p className='font-bold text-sm text-green-500'>Fichier sélectionné : {file.name}</p>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="bg-red-500 text-white cursor-pointer rounded px-2 py-2 mt-5"
                        >
                          Supprimer le fichier
                        </button>
                      </div>
                    )}
                  </div>
                  
                
                  <div className="ml-auto pt-8 w-full items-center justify-center flex font-medium">
                    <Button type="submit"  className="w-fit h-10 font-bold">Ajouter le sujet</Button>
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

  

   