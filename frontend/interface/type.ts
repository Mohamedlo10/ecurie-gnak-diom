/*  export type User = {
   id: string;
   firstname: string;
   lastname: string; 
   email: string; 
   phonenumber: string; 
   password: string; 
   address?: string | null; 
   role: 'AdminGeneral' | 'AdminInstitute' | 'Receptionist' | 'Beautician' | 'Client'; 
   institute_id?: string | null; 
   loyaltypoints?: number | null; 
   createdat?: string | null; 
   updatedat?: string | null; 
 }; */

export type User={
  idutilisateur:string,
  nom: string,
  prenom:string,
  email:string,
  role: string,
  created_at:string
}

export type Etudiant = User & {
  ine: string;
};

export type Cours={
  idcours:string,
  nom: string,
  prenom:string,
  email:string,
  nomcours: string,
  created_at:string
}



export type Sujet={
  idsujet: string,
  idcours:string,
  nomsujet:string,
  urlsujet:string,
  created_at:string,
  datesoumission:string
}

export type Copie = {
  idcopie: string;
  idutilisateur: string;
  idsujet: string;
  noteia?: number | null;
  notefinal?: number | null;
  commentaire?: string | null;
  urlcopie: string;
  created_at?: string;
};
