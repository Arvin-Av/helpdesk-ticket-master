// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ppaipikjdnhvhimaxhsk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYWlwaWtqZG5odmhpbWF4aHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTk4OTIsImV4cCI6MjA2MTA5NTg5Mn0.1BwHjKwdISvZX1hANtAQC2uussj9xNL1BMWxIbIjKvI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);