import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mdtvrtyjnscfdocskjxb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdHZydHlqbnNjZmRvY3NranhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzUxMTEsImV4cCI6MjA3NjExMTExMX0.sT29xLlpMtoBoKU0Z0jlONqT-8Z78w6DAerUzhFQCiY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);