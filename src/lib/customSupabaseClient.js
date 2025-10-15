import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zbgmwbwogtayfiottepa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZ213YndvZ3RheWZpb3R0ZXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzQ4MTIsImV4cCI6MjA3NjExMDgxMn0.iKaQadH065-MLp2IMe-z5Y1itB5Fy7QlQOSmiB-fCdU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);