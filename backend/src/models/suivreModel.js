import supabase from "../config/db.js";

const SuivreModel = {
    async createSuivre({ idcours, idutilisateur }) {
        const { data, error } = await supabase
            .from("suivre")
            .insert([{ idcours, idutilisateur }]);

        if (error) throw error;
        return data;
    },

    async getAllSuivres() {
        const { data, error } = await supabase.from("suivre").select("*");
        if (error) throw error;
        return data;
    },

    async getSuivreById(id) {
        const { data, error } = await supabase
            .from("suivre")
            .select("*")
            .eq("id", id)
            .single();
        if (error) throw error;
        return data;
    },

    async deleteSuivre(id) {
        const { data, error } = await supabase
            .from("suivre")
            .delete()
            .eq("id", id);
        if (error) throw error;
        return data;
    }
};

export default SuivreModel;
