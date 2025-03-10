import sql from '../config/db.js';

const SujetModel = {
    async getAll() {
        const { data, error } = await sql.from("sujet").select("*");
        if (error) throw error;
        return data;
    },

    async getById(id) {
        const { data, error } = await sql.from("sujet").select("*").eq("id", id).single();
        if (error) throw error;
        return data;
    },

    async create(sujet) {
        const { data, error } = await sql.from("sujet").insert([sujet]).select().single();
        if (error) throw error;
        return data;
    },

    async update(id, updatedSujet) {
        const { data, error } = await sql.from("sujet").update(updatedSujet).eq("id", id).select().single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await sql.from("sujet").delete().eq("id", id);
        if (error) throw error;
        return { message: "Sujet supprimé avec succès" };
    },
    
    //todo :: pour classe yi
    async createForClasse(idclasse, sujet) {
        sujet.idclasse = idclasse; 
        const { data, error } = await sql.from("sujet").insert([sujet]).select().single();
        if (error) throw error;
        return data;
    },
    
    async deleteByClasse(idclasse,id) {
        const { error } = await sql.from("sujet").delete().eq("idclasse", idclasse).eq("id",id);
        if (error) throw error;
        return { message: ` le sujet${id} de la classe ${idclasse} ont été supprimés.` };
    },
    async getAllByClasse(idclasse) {
        const { data, error } = await sql.from("sujet").select("*").eq("idclasse", idclasse);
        if (error) throw error;
        return data;
    },
    async getOneByClasse(id,idclasse) {
        const { data, error } = await sql.from("sujet").select("*").eq("idclasse", idclasse).eq("id",id).single();
        if (error) throw error;
        return data;
    }
    
};

export default SujetModel;

