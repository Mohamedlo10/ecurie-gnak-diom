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
  nomcours?:string,
  urlsujet:string,
  created_at:string,
  datesoumission:string
}

export type Copie = {
  idcopie: string;
  idutilisateur: string;
  idsujet: string;
  noteia?: number | null;
  nomsujet?:string,
  notefinal?: number | null;
  commentaire?: string | null;
  urlcopie: string;
  created_at?: string;
};


export type Correction = {
  idcorrection: string;
  urlcorrection: string;
  idsujet: string;
  created_at?: string;
};


export type NoteSujet = {
  idsujet: string;
  nomsujet: string;
  moyenne: string | null;
  note_min: string | null;
  note_max: string | null;
  ecart_type: string | null;
  nombre_eleves_ayant_moyenne: string;
  nombre_eleves_sans_moyenne: string;
};

export type NbEtudiantsParSujet = {
  idsujet: string;
  nomsujet: string;
  nombre_etudiants: string;
};

export type MoyenneEtudiant = {
  idutilisateur: string;
  nom: string;
  prenom: string;
  moyenne_generale: string;
};

export type MoyenneParCours = {
  idutilisateur: string;
  nom: string;
  prenom: string;
  idcours: string;
  nomcours: string;
  moyenne_cours: string;
};

export type SujetsTraitesParEtudiant = {
  idutilisateur: string;
  nom: string;
  prenom: string;
  nombre_sujets_traites: string;
};

export type NbInscritsCours = {
  idcours: string;
  nomcours: string;
  nombre_etudiants_inscrits: string;
};

export type Statistique = {
  notesSujets: NoteSujet[];
  nbEtudiantsParSujet: NbEtudiantsParSujet[];
  moyennesEtudiants: MoyenneEtudiant[];
  moyennesParCours: MoyenneParCours[];
  sujetsTraitesParEtudiant: SujetsTraitesParEtudiant[];
  nbInscritsCours: NbInscritsCours[];
};
