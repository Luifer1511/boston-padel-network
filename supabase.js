import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jelvuekkojykrwqtcmsy.supabase.co';
const supabaseAnonKey = 'eyJhYmciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplbHZ1ZWtrb2p5a3J3cXRjbXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMzQ0MzUsImV4cCI6MjA1NTYxMDQzNX0.EXAMPLE_KEY'; // Ensure this matches your copied anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);