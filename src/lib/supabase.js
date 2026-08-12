import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mqrkgtogkkdezicozoqv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcmtndG9na2tkZXppY296b3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MjA3MzUsImV4cCI6MjEwMjA5NjczNX0.B3C-nHWCjPZKTCB1eYzd6sj6DmEx8qbIJ_joyU7eZc8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
