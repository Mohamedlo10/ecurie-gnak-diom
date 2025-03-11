import supabase from "../config/db.js";

const EtudiantModel = {
    async createEtudiant({ idutilisateur, line }) {
        const { data, error } = await supabase
            .from("etudiant")
            .insert([{ idutilisateur, line }]);

        if (error) throw error;
        return data;
    },

    async getAllEtudiants() {
        const { data, error } = await supabase.from("etudiant").select("*");
        if (error) throw error;
        return data;
    },

    async getEtudiantById(id) {
        const { data, error } = await supabase
            .from("etudiant")
            .select("*")
            .eq("idutilisateur", id)
            .single();
        if (error) throw error;
        return data;
    },

    async deleteEtudiant(id) {
        const { data, error } = await supabase
            .from("etudiant")
            .delete()
            .eq("idutilisateur", id);
        if (error) throw error;
        return data;
    }
};

export default EtudiantModel;
