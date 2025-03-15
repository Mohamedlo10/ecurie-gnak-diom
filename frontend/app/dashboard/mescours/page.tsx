"use client";

import { Button } from "@/components/ui/button";

import Drawer from '@mui/material/Drawer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus } from "lucide-react";
import { useRouter } from 'next/navigation';

import { ChangeEvent, CSSProperties, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer } from 'react-toastify';
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { getSupabaseUser } from "@/lib/authMnager";
import { Cours, User } from "@/interface/type";
import { getCoursByidEtudiant, getCoursByidProf } from "@/app/api/cours/query";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red", 
};
// Composant principal de la page des utilisateurs
export default function Page() {
  const [cours, setCours] = useState<Cours | any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddingClient, setIsAddingClient] = useState(false);
  let [color, setColor] = useState("#ffffff");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [client, setClient] = useState({
    prenom: "",
    nom: "",
    Tel: "",
    Pays: "",
    ville: "",
    img_url: "",
    id_client:"",
  });
  const router = useRouter();

    const handleNavigation = (idUser:string) => {
      // Par exemple, naviguer vers la page de profil en passant l'ID de l'utilisateur en paramètre
      router.push(`/dashboard/utilisateurs/Clients/profile?id=${idUser}`);
    };
  

    async function fetchData() {
      setIsLoading(true)
        const user = getSupabaseUser()
        try {
          if(user.role=="etudiant"){
            const data: any = await getCoursByidEtudiant(user.id)
            if (data) {
              console.log(data)
              setCours(data)         
            } 
          }
            else  if(user?.role=="professeur"){
              const data: any = await getCoursByidProf(user.id)
              if (data) {
                console.log(data)
                setCours(data)         
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
    setClient({ ...client, [name]: value });
  };

  




   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
   
  
    try {
    // const response = await creerClient(client)

        setClient({
          prenom: "",
          nom: "",
          Tel: "",
          Pays: "",
          ville: "",
          img_url: "",
          id_client:""
        });

        setIsDrawerOpen(false);
        setSelectedUser(null);
        setIsAddingClient(false);
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
  

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setIsAddingClient(false);
    setIsDrawerOpen(true);
  };

  const handleAddClientClick = () => {
    setSelectedUser(null);
    setIsAddingClient(true);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedUser(null);
    setIsAddingClient(false);
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
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-400">Cours</h2>
            <p className="text-muted-foreground text-black text-zinc-600 font-bold">Liste des Cours</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              className="w-fit h-10 font-bold bg-red-600"
              onClick={handleAddClientClick}
            >
              <Plus /> Ajouter un Cours
            </Button>
          </div>
        </div>

        {/* Tableau des données */}
        <DataTable 
        data={cours}
        columns={columns}
        onRowClick={handleUserClick}
        currentPage={currentPage} 
        total={total} 
        setCurrentPage={setCurrentPage} 
      />

      
       
      </div>

      {/* Drawer pour afficher les informations de l'utilisateur ou le formulaire d'ajout */}
      <Drawer anchor='right' open={isDrawerOpen} onClose={closeDrawer}>
        <div className="p-4 w-[32vw]">
          {isAddingClient ? (
            // Formulaire d'ajout de client
            <div className="flex w-full max-w-xl flex-col items-center border bg-white p-10 text-left">
              <h2 className="mb-8 text-2xl font-bold">Ajouter un Nouveau Client</h2>
              <form className="w-full" onSubmit={handleSubmit}>
             
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Prénom</label>
                  <input
                      type="text"
                      name="prenom"
                      value={client.prenom}
                      onChange={handleInputChange}
                      placeholder="Prénom"
                      className="border p-2 rounded w-full"
                      required
                    />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={client.nom}
                    onChange={handleInputChange}
                    placeholder="Nom"
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Téléphone</label>
                  <input
                    type="tel"
                    name="Tel"
                    value={client.Tel}
                    onChange={handleInputChange}
                    placeholder="Téléphone"
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Pays</label>
                  <input
                    type="text"
                    name="Pays"
                    value={client.Pays}
                    onChange={handleInputChange}
                    placeholder="Pays"
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Ville</label>
                  <input
                    type="text"
                    name="ville"
                    value={client.ville}
                    onChange={handleInputChange}
                    placeholder="Ville"
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>
                <div className="ml-auto pt-8 w-full items-center justify-center flex font-medium">
                  <Button type="submit"  className="w-fit h-10 font-bold">Ajouter le Client</Button>
                </div>
              </form>
              <ToastContainer />
            </div>
          ) : (
            // Affichage des informations de l'utilisateur
            selectedUser && (
              <div className="flex w-full max-w-xl flex-col items-center border bg-white p-10 text-left">
                <h2 className="mb-8 text-2xl font-bold">
                  Client {selectedUser.prenom} {selectedUser.nom}
                </h2>
                <img
                  src={selectedUser.img_url}
                  alt="User Profile"
                  width={120}
                  height={120}
                  className="mb-10 h-52 w-52 rounded-full object-cover"
                />
                {/* <div className="text-base grid grid-cols-2 font-bold p-4 rounded-md shadow-sm w-full gap-full">
                  <div className="font-normal text-base">ID</div>
                  {selectedUser.id}
                </div> */}
                <div className="text-base grid grid-cols-2 font-bold p-4 rounded-md shadow-sm w-full gap-full">
                  <div className="font-normal text-base">Téléphone</div>
                  {selectedUser.Tel}
                </div>
                <div className="text-base grid grid-cols-2 font-bold p-4 rounded-md shadow-sm w-full gap-full">
                  <div className="font-normal text-base">Pays</div>
                  {selectedUser.Pays || '-'}
                </div>
                <div className="text-base grid grid-cols-2 font-bold p-4 rounded-md shadow-sm w-full gap-full">
                  <div className="font-normal text-base">Ville</div>
                  {selectedUser.ville}
                </div>
                <div className="text-base grid grid-cols-2 font-bold p-4 rounded-md shadow-sm w-full gap-full">
                  <div className="font-normal text-base">Commandes effectuées</div>
                  {selectedUser.total_commandes}
                </div>
                <div className="text-base grid grid-cols-2 font-bold p-4 rounded-md shadow-sm w-full gap-full">
                  <div className="font-normal text-base">Date d'inscription</div>
                  <div>
                    {format(new Date(selectedUser.created_at), 'dd MMMM yyyy', { locale: fr })}
                    {` à ${format(new Date(selectedUser.created_at), 'HH:mm')}`}
                  </div>
                </div>
                {/* <div className="text-base grid grid-cols-2 p-3 items-center rounded-md shadow-sm w-full gap-full">
                          <div className="font-normal text-base">Actif</div>
                          {selectedUser.actif ? (<div className="bg-green-600 p-1 w-12 items-center justify-center flex text-white rounded-sm">Oui</div>) : (<div className="bg-red-600 p-1 w-12 items-center justify-center flex text-white rounded-sm">Non</div>)}
                </div> */}
                <div className="ml-auto pt-12 w-full items-center justify-center flex font-medium">
                <Button onClick={() => handleNavigation(selectedUser.id_client)} className="w-fit h-10 font-bold">Voir Détails</Button>   </div>

              </div>
            )
          )}
        </div>
      </Drawer>
    </>
  );
}

