"use client";
import { modifierCours, suprimerCours } from '@/app/api/cours/query';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/dialogConfirm';
import { Cours, User } from '@/interface/type';
import { getSupabaseUser } from '@/lib/authMnager';
import { Save, Trash2, UserRound, UserRoundPen, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react';

type PersonalInfoProps = {
  cour: Cours | any;
};

const PersonalInfo: React.FC<PersonalInfoProps> = ({ cour }) => {
  const [editMode, seteditMode] = useState(false);
  const activeEdit = () => {
  seteditMode(!editMode)
}  
const router = useRouter();
const [isDialogOpen, setDialogOpen] = useState(false);
const [user, setUser] = useState<User>();
const [currentCour, setcurrentCour] = useState({
  nomcours: cour?.nomcours || "",
});


const handleInputChange = (e : ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setcurrentCour({ ...cour, [name]: value });
};

async function fetchData() {
  const user = getSupabaseUser()
    setUser(user)
    

}

useEffect(() => {
 
  fetchData()
}, [])

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
  const response = await modifierCours(cour.idcours,currentCour.nomcours)
  console.log("Reussi")
  console.log(response)
  window.location.reload();


  } catch (error) {
    console.error("Erreur lors de la modification du cour:", error);
  } 
};

const deleteUser = async () => {
  try{
    const response = await suprimerCours(cour.idcours)
    console.log("Suppression reussi")
    router.back();

  }catch(error)
  {
    console.error("Erreur lors de la Suppression du cour:", error); 
  }
}




  return <div>
            <div className='p-8 mt-6 bg-zinc-50 rounded-md w-full  items-center justify-start flex flex-col gap-1'>  
            <div className="flex flex-col  max-h-[40vh]">

     

        <div>
          <div className="flex items-center my-4">
          <UserRound />
          <div className="ml-2 text-black text-sm sm:text-xl font-bold">Informations</div>
          </div>

          { editMode && cour ?(
            <form className="w-full mb-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-36 rounded-lg">
            {/* <!-- First Bloc --> */}
            <div className="p-4">
              <div className="mb-4">
                <div className="text-gray-500 text-sm sm:text-base">Nom cours</div>
                  <input
                      type="text"
                      name="nomcours"
                      value={currentCour.nomcours}
                      onChange={handleInputChange}
                      placeholder="Cours"
                      className="border p-2 rounded w-full"
                      required
                    />
              </div>
             
            </div>
      
          </div>
          <div className="grid grid-cols-2 gap-12">

                <Button onClick={activeEdit} className='font-bold bg-white hover:text-slate-900 hover:bg-slate-100 text-slate-600  gap-2'>
                  <X />
                    Annuler
                  </Button>
                  <Button type="submit" className='font-bold gap-2 '>
                  <Save />
                    Enregistrer
                  </Button>

          </div> 

            </form>

          
          ):(   
            <div className='mb-6'>      
            <div className="grid grid-cols-2 gap-36 rounded-lg">
            {/* <!-- First Bloc --> */}
            <div className="p-4">
              <div className="mb-4">
                <div className="text-gray-500 text-sm sm:text-base">Prenom du professeur</div>
                <div className="leading-6 mt-1 text-sm sm:text-base font-bold">{cour?.prenom}</div>
              </div>
              <div className="mb-4">
                <div className="text-gray-500 text-sm sm:text-base">Cours</div>
                <div className="leading-6 mt-1 text-sm sm:text-base font-bold">{cour?.nomcours}</div>
              </div>
              <div className=" mb-4">
                <div className="text-gray-500 text-sm sm:text-base">Date de creation</div>
               
                <div className="leading-6 mt-1 text-sm sm:text-base font-bold"> {
                                  new Date(cour?.created_at as string).toLocaleDateString("fr-FR", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  }) +
                                  " à " +
                                  new Date(cour?.created_at as string).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  })}</div>
              </div>
            </div>
            {/* <!-- Second Bloc --> */}
            <div className="p-4">
              <div className="mb-4">
                <div className="text-gray-500 text-sm sm:text-base">Nom du professeur</div>
                <div className="leading-6 mt-1 text-sm sm:text-base font-bold">{cour?.nom}</div>
              </div>
              <div className="mb-4">
                <div className="text-gray-500 text-sm sm:text-base">Mail du professeur</div>
                <div className="leading-6 mt-1 text-sm sm:text-base font-bold">{cour?.email}</div>
              </div>
                         
            </div>

          </div>
          <div className="grid grid-cols-2 gap-12">


 {(user?.role=="professeur")&&(<> <Button onClick={() => setDialogOpen(true)} className='font-bold gap-2 bg-red-700 hover:bg-red-800'>
    <Trash2 />
      Supprimer
  </Button>
  <Button onClick={activeEdit} className='font-bold gap-2'>

  <UserRoundPen />
    Modifier
  </Button>
  </>)}
  <ConfirmDialog
      isOpen={isDialogOpen}
      message={`Etes-vous sûr de vouloir supprimer ${cour?.nomcours} ?`}
      onConfirm={() => {
        deleteUser();
        setDialogOpen(false);
      }}
      onCancel={() => setDialogOpen(false)}
    />


</div>
          </div>)
          }
        </div>

      </div>
                    
            </div>
  </div>;
};

export default PersonalInfo;
