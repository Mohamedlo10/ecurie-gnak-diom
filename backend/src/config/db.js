import postgres from 'postgres';

const connectionString = "postgresql://postgres.vvkgkijzjazoehellugh:AliouneDiallo@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"; 
const sql = postgres(connectionString); 

export default sql;
