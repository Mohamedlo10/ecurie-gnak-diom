import supabase from "../config/db.js";

const PlagiatCopieModel = {
    async createPlagiatCopie({ idplagiat, idcopie, pourcentageplagiat }) {
        const { data, error } = await supabase
            .from("plagiatcopie")
            .insert([{ idplagiat, idcopie, pourcentageplagiat }]);

        if (error) throw error;
        return data;
    },

    async getAllPlagiatCopies() {
        const { data, error } = await supabase.from("plagiatcopie").select("*");
        if (error) throw error;
        return data;
    },

    async getPlagiatCopieById(id) {
        const { data, error } = await supabase
            .from("plagiatcopie")
            .select("*")
            .eq("id", id)
            .single();
        if (error) throw error;
        return data;
    },

    async deletePlagiatCopie(id) {
        const { data, error } = await supabase
            .from("plagiatcopie")
            .delete()
            .eq("id", id);
        if (error) throw error;
        return data;
    }
};

export default PlagiatCopieModel;
