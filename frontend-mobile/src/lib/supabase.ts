import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail-safe initialization to prevent whole app from crashing
let supabaseClient;

try {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Empit/Missing environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)');
    }
    
    // Validate URL format
    new URL(supabaseUrl);
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} catch (e: any) {
    console.error('CRITICAL: Supabase initialization failed:', e.message);
    // Create a dummy client that throws on use rather than at boot
    supabaseClient = {
        auth: {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            getSession: () => Promise.resolve({ data: { session: null }, error: e }),
            getUser: () => Promise.resolve({ data: { user: null }, error: e }),
            signInWithPassword: () => Promise.reject(e),
            signUp: () => Promise.reject(e),
            signOut: () => Promise.reject(e),
            updateUser: () => Promise.reject(e),
            resetPasswordForEmail: () => Promise.reject(e),
        }
    } as any;
}

export const supabase = supabaseClient;
