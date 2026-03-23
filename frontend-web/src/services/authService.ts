import { supabase } from './supabaseClient';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import apiClient from './apiClient';

export interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    user_image: string;
    dni: string;
    auth_id: string;
    role: string;
}

class AuthService {
    private userProfile: UserProfile | null = null;

    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    }

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        this.userProfile = null;
    }

    async getCurrentUser(): Promise<User | null> {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    }

    async getUserProfile(): Promise<UserProfile | null> {
        if (this.userProfile) return this.userProfile;
        
        const user = await this.getCurrentUser();
        if (!user) return null;

        try {
            const response = await apiClient.get<UserProfile[]>(`/users`, {
                params: {
                    auth_id: `eq.${user.id}`
                },
                headers: {
                    'Accept': 'application/vnd.pgrst.object+json'
                }
            });
            this.userProfile = response.data as any;
            return this.userProfile;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    onAuthStateChange(callback: (user: User | null) => void) {
        return supabase.auth.onAuthStateChange((_event, session) => {
            callback(session?.user ?? null);
        });
    }
}

export const authService = new AuthService();
