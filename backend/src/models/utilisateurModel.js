import sql from "../config/db.js";

const UtilisateurModel = {
    async createUtilisateur({ nom, prenom, email, motdepasse }) {
        const { data, error } = await sql
            .from("utilisateur")
            .insert([{ nom, prenom, email, motdepasse }]);

        if (error) throw error;
        return data;
    },

    async getAllUtilisateurs() {
        const { data, error } = await sql.from("utilisateur").select("*");
        if (error) throw error;
        return data;
    },

    async getUtilisateurById(id) {
        const { data, error } = await sql
            .from("utilisateur")
            .select("*")
            .eq("idutilisateur", id)
            .single();
        if (error) throw error;
        return data;
    },

    async updateUtilisateur(id, updateData) {
        const { data, error } = await sql
            .from("utilisateur")
            .update(updateData)
            .eq("idutilisateur", id);
        if (error) throw error;
        return data;
    },

    async deleteUtilisateur(id) {
        const { data, error } = await sql
            .from("utilisateur")
            .delete()
            .eq("idutilisateur", id);
        if (error) throw error;
        return data;
    },
    async loginUtilisateur({email,mot_de_passe}) {
        const {data,error} =await sql
        .from("utilisateur")
        .select("*")
        .eq("email",email)
        .single();
        if (error) throw error;

        const utilisateur = data;
        const isMatch = await bcrypt.compare(motdepasse, utilisateur.mot_de_passe);
        
        if (!isMatch) {
            throw new Error("Identifiants invalides");
        }
        delete utilisateur.mot_de_passe;
        return utilisateur;
    }
}; 

export default UtilisateurModel;
 
