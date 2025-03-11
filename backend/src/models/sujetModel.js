import supabase from "../config/db.js";  // Connexion à Supabase

const SujetModel = {
    async createSujet({ nom, idclasse, urlsujet }) {
        const { data, error } = await supabase
            .from("sujet")
            .insert([{ nom, idclasse, urlsujet }]);

        if (error) throw error;
        return data;
    },

    async getAllSujets() {
        const { data, error } = await supabase.from("sujet").select("*");
        if (error) throw error;
        return data;
    },

    async getSujetById(id) {
        const { data, error } = await supabase
            .from("sujet")
            .select("*")
            .eq("idsujet", id)
            .single();
        if (error) throw error;
        return data;
    },

    async updateSujet(id, updateData) {
        const { data, error } = await supabase
            .from("sujet")
            .update(updateData)
            .eq("idsujet", id);
        if (error) throw error;
        return data;
    },

    async deleteSujet(id) {
        const { data, error } = await supabase
            .from("sujet")
            .delete()
            .eq("idsujet", id);
        if (error) throw error;
        return data;
    }
};

export default SujetModel;
