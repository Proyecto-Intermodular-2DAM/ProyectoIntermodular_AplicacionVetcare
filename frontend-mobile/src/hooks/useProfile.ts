import { useEffect } from 'react';
import { useApi } from './useApi';
import { authService, UserProfile } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook to fetch and manage the public profile of the current user.
 */
export function useProfile() {
    const { user } = useAuth();
    const { data: profile, loading, error, request, setData } = useApi<UserProfile | null, []>(
        () => authService.getPublicUserProfile(),
        null
    );

    useEffect(() => {
        if (user) {
            request();
        }
    }, [user, request]);

    return { profile, loading, error, refresh: request, setProfile: setData };
}
