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
  id:string,
  nom: string,
  prenom:string,
  email:string,
  role: string
}
