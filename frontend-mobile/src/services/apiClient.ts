import axios from 'axios';
import { supabase } from '../lib/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Centralized Axios instance for API requests.
 * configured with Supabase headers and base URL.
 */
const apiClient = axios.create({
    baseURL: `${supabaseUrl}/rest/v1`,
    headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Prefer': 'return=representation' // Useful for getting data back on POST/PATCH
    }
});

// Request Interceptor to add Authorization header if session exists
apiClient.interceptors.request.use(async (config) => {
    try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.access_token) {
            config.headers.Authorization = `Bearer ${data.session.access_token}`;
        }
    } catch (error) {
        console.error('Error getting session for apiClient:', error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor for global error handling
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common HTTP errors
        if (error.response) {
            console.error(`API Error ${error.response.status}:`, error.response.data);
            
            // Map common status codes to user-friendly messages if needed
            const message = error.response.data?.message || error.message;
            error.userMessage = message; 

            if (error.response.status === 401) {
                // Potential logout logic here
            }
        } else if (error.request) {
            console.error('API Error: No response received', error.request);
            error.userMessage = 'No se pudo conectar con el servidor.';
        } else {
            console.error('API Error:', error.message);
            error.userMessage = 'Ocurrió un error inesperado.';
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;
