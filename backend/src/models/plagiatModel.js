 
import supabase from "../config/db.js";

const PlagiatModel = {
    async createPlagiat({ idplagiat, pourcentageplagiat }) {
        const { data, error } = await supabase
            .from("plagiat")
            .insert([{ idplagiat, pourcentageplagiat }]);

        if (error) throw error;
        return data;
    },

    async getAllPlagiats() {
        const { data, error } = await supabase.from("plagiat").select("*");
        if (error) throw error;
        return data;
    },

    async getPlagiatById(id) {
        const { data, error } = await supabase
            .from("plagiat")
            .select("*")
            .eq("idplagiat", id)
            .single();
        if (error) throw error;
        return data;
    },

    async updatePlagiat(id, updateData) {
        const { data, error } = await supabase
            .from("plagiat")
            .update(updateData)
            .eq("idplagiat", id);
        if (error) throw error;
        return data;
    },

    async deletePlagiat(id) {
        const { data, error } = await supabase
            .from("plagiat")
            .delete()
            .eq("idplagiat", id);
        if (error) throw error;
        return data;
    }
};

export default PlagiatModel;
