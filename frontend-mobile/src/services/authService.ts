import { supabase } from '../lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface SignUpData {
    email: string;
    password: string;
    name: string;
    surname: string;
    dni: string;
    phone: string;
}

export interface AuthResponse {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
}

class AuthService {
    private getBaseUrl() {
        let baseUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
        
        // Only strip a truly trailing slash if it's not part of the protocol (e.g. "com.app://")
        if (baseUrl.endsWith('/') && !baseUrl.endsWith('://')) {
            baseUrl = baseUrl.slice(0, -1);
        }
        return baseUrl;
    }

    /**
     * Sign up a new user with email and password
     */
    async signUp(data: SignUpData): Promise<AuthResponse> {
        try {
            const { email, password, name, surname, dni, phone } = data;

            const { data: authData, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${this.getBaseUrl()}/auth/callback`,
                    data: {
                        name,
                        surname,
                        dni,
                        phone,
                    },
                },
            });

            return {
                user: authData.user,
                session: authData.session,
                error,
            };
        } catch (error) {
            return {
                user: null,
                session: null,
                error: error as AuthError,
            };
        }
    }

    /**
     * Sign in an existing user with email and password
     */
    async signIn(email: string, password: string): Promise<AuthResponse> {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            return {
                user: data.user,
                session: data.session,
                error,
            };
        } catch (error) {
            return {
                user: null,
                session: null,
                error: error as AuthError,
            };
        }
    }

    /**
     * Sign out the current user
     */
    async signOut(): Promise<{ error: AuthError | null }> {
        try {
            const { error } = await supabase.auth.signOut();
            return { error };
        } catch (error) {
            return { error: error as AuthError };
        }
    }

    /**
     * Send password recovery email
     */
    async resetPassword(email: string): Promise<{ error: AuthError | null }> {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${this.getBaseUrl()}/auth/callback`,
            });
            return { error };
        } catch (error) {
            return { error: error as AuthError };
        }
    }

    /**
     * Get the current user
     */
    async getCurrentUser(): Promise<User | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    /**
     * Get the current session
     */
    async getSession(): Promise<Session | null> {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            return session;
        } catch (error) {
            console.error('Error getting session:', error);
            return null;
        }
    }

    /**
     * Subscribe to auth state changes
     */
    onAuthStateChange(callback: (user: User | null) => void) {
        return supabase.auth.onAuthStateChange((_event: string, session: any) => {
            callback(session?.user ?? null);
        });
    }
}

export const authService = new AuthService();
