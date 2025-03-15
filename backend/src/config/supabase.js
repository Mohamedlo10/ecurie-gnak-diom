import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vvkgkijzjazoehellugh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2a2draWp6amF6b2VoZWxsdWdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTI5NjEyMCwiZXhwIjoyMDU2ODcyMTIwfQ.Al5qGeKs-_0fjxs9DB1IVoK2NAlOVhavFYw40K2wqTQ';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
