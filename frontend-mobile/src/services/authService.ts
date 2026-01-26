import { supabase } from '../lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { vetService } from './vetService';
import apiClient from './apiClient';

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

export interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    user_image: string;
    dni: string;
    auth_id: string;
}

class AuthService {
    private userProfile: UserProfile | null = null;
    private userIdCache: string | null = null;
    private profilePromise: Promise<UserProfile | null> | null = null;

    private getBaseUrl() {
        let baseUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
        if (baseUrl.endsWith('/')) {
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
            this.clearCache();
            vetService.clearCache();
            return { error };
        } catch (error) {
            return { error: error as AuthError };
        }
    }

    private clearCache() {
        this.userProfile = null;
        this.userIdCache = null;
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
     * Update current user profile metadata
     */
    async updateProfile(updates: { name?: string; surname?: string; phone?: string; avatar_url?: string; password?: string; dni?: string }) {
        try {
            const { name, surname, phone, avatar_url, password, dni } = updates;
            
            // 1. Update Supabase Auth metadata
            const authUpdateData: any = {
                data: {}
            };
            if (name) authUpdateData.data.name = name;
            if (surname) authUpdateData.data.surname = surname;
            if (phone) authUpdateData.data.phone = phone;
            if (password) authUpdateData.password = password;

            const { data: authData, error: authError } = await supabase.auth.updateUser(authUpdateData);
            if (authError) throw authError;

            // 2. Update public.users table using Axios
            const userId = await this.getPublicUserId();
            if (userId) {
                const dbUpdateData: any = {};
                if (name) dbUpdateData.first_name = name;
                if (surname) dbUpdateData.last_name = surname;
                if (phone) dbUpdateData.phone_number = phone;
                if (avatar_url) dbUpdateData.user_image = avatar_url;
                if (dni) dbUpdateData.dni = dni;

                await apiClient.patch(`/users`, dbUpdateData, {
                    params: {
                        id: `eq.${userId}`
                    }
                });
            }

            return { user: authData.user, error: null };
        } catch (error) {
            return { user: null, error: error as AuthError };
        }
    }

    /**
     * Get the public user profile from the database
     */
    async getPublicUserProfile(): Promise<UserProfile | null> {
        if (this.userProfile) return this.userProfile;
        if (this.profilePromise) return this.profilePromise;

        this.profilePromise = (async () => {
            try {
                const user = await this.getCurrentUser();
                if (!user) return null;

                const response = await apiClient.get<UserProfile[]>(`/users`, {
                    params: {
                        select: 'id,first_name,last_name,phone_number,user_image,dni,auth_id',
                        auth_id: `eq.${user.id}`
                    },
                    headers: {
                        'Accept': 'application/vnd.pgrst.object+json'
                    }
                });
                
                const data = response.data as unknown as UserProfile;
                if (data) {
                    this.userProfile = data;
                    this.userIdCache = data.id;
                }
                return data;
            } catch (error) {
                console.error('[Diagnostic] Error in getPublicUserProfile:', error);
                return null;
            } finally {
                this.profilePromise = null;
            }
        })();

        return this.profilePromise;
    }

    /**
     * Get the internal public.users.id
     */
    async getPublicUserId(): Promise<string | null> {
        if (this.userIdCache) return this.userIdCache;
        const profile = await this.getPublicUserProfile();
        return profile?.id || null;
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
