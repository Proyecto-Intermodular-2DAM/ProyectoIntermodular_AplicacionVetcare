import { useState, useEffect, useRef } from 'react';
import { authService, UserProfile } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook to fetch and manage the public profile of the current user.
 */
export function useProfile() {
    const { user } = useAuth();
    const fetched = useRef(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user || fetched.current) return;
        fetched.current = true;

        const getProfile = async () => {
            try {
                setLoading(true);
                const response = await authService.getPublicUserProfile();
                setProfile(response);
            } catch (err: any) {
                setError(err.userMessage || "No se ha podido obtener el perfil");
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [user]);

    return { profile, loading, error };
}
