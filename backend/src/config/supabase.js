import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.supabaseUrl, process.env.upabaseKey);

export default supabase;
