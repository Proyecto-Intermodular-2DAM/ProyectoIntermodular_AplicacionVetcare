import axios from 'axios';
import { supabase } from './supabaseClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const apiClient = axios.create({
    baseURL: `${supabaseUrl}/rest/v1`,
    headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Prefer': 'return=representation'
    }
});

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

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error(`API Error ${error.response.status}:`, error.response.data);
            error.userMessage = error.response.data?.message || error.message;
        } else if (error.request) {
            error.userMessage = 'No se pudo conectar con el servidor.';
        } else {
            error.userMessage = 'Ocurrió un error inesperado.';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
