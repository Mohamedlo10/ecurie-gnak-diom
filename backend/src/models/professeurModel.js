import supabase from "../config/db.js";

const ProfesseurModel = {
    async createProfesseur({ idutilisateur }) {
        const { data, error } = await supabase
            .from("professeur")
            .insert([{ idutilisateur }]);

        if (error) throw error;
        return data;
    },

    async getAllProfesseurs() {
        const { data, error } = await supabase.from("professeur").select("*");
        if (error) throw error;
        return data;
    },

    async getProfesseurById(id) {
        const { data, error } = await supabase
            .from("professeur")
            .select("*")
            .eq("idutilisateur", id)
            .single();
        if (error) throw error;
        return data;
    },

    async deleteProfesseur(id) {
        const { data, error } = await supabase
            .from("professeur")
            .delete()
            .eq("idutilisateur", id);
        if (error) throw error;
        return data;
    }
};

export default ProfesseurModel;
