import supabase from "../config/db.js";

const CoursModel = {
    async createCours({ nomcours, idutilisateur }) {
        const { data, error } = await supabase
            .from("cours")
            .insert([{ nomcours, idutilisateur }]);

        if (error) throw error;
        return data;
    },

    async getAllCours() {
        const { data, error } = await supabase.from("cours").select("*");
        if (error) throw error;
        return data;
    },

    async getCoursById(id) {
        const { data, error } = await supabase
            .from("cours")
            .select("*")
            .eq("idcours", id)
            .single();
        if (error) throw error;
        return data;
    },

    async updateCours(id, updateData) {
        const { data, error } = await supabase
            .from("cours")
            .update(updateData)
            .eq("idcours", id);
        if (error) throw error;
        return data;
    },

    async deleteCours(id) {
        const { data, error } = await supabase
            .from("cours")
            .delete()
            .eq("idcours", id);
        if (error) throw error;
        return data;
    }
};

export default CoursModel;
