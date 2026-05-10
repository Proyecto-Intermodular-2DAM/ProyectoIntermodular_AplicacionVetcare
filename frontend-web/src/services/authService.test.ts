import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './authService';

// Mocks deben definirse ANTES de cualquier variable (hoisting de vi.mock)
vi.mock('./supabaseClient', () => ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
            signOut: vi.fn(),
            getUser: vi.fn(),
            getSession: vi.fn(),
            onAuthStateChange: vi.fn(),
        },
    },
}));

vi.mock('./apiClient', () => ({
    default: {
        get: vi.fn(),
    },
}));

import { supabase } from './supabaseClient';
import apiClient from './apiClient';

const mockSupabaseAuth = supabase.auth;
const mockApiClient = apiClient as any;

describe('AuthService (frontend-web)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (authService as any).userProfile = null;
    });

    describe('signIn', () => {
        it('calls supabase.auth.signInWithPassword with credentials', async () => {
            (mockSupabaseAuth.signInWithPassword as any).mockResolvedValue({
                data: { user: { id: 'user-123', email: 'test@test.com' } },
                error: null,
            });

            await authService.signIn('test@test.com', 'password123');

            expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@test.com',
                password: 'password123',
            });
        });

        it('throws error when Supabase returns an error', async () => {
            (mockSupabaseAuth.signInWithPassword as any).mockResolvedValue({
                data: { user: null },
                error: { message: 'Invalid credentials' },
            });

            await expect(authService.signIn('test@test.com', 'wrong')).rejects.toThrow('Invalid credentials');
        });
    });

    describe('signOut', () => {
        it('calls supabase.auth.signOut', async () => {
            (mockSupabaseAuth.signOut as any).mockResolvedValue({ error: null });

            await authService.signOut();

            expect(mockSupabaseAuth.signOut).toHaveBeenCalled();
        });
    });

    describe('getCurrentUser', () => {
        it('returns user when session exists', async () => {
            const mockUser = { id: 'user-123', email: 'test@test.com' };
            (mockSupabaseAuth.getUser as any).mockResolvedValue({ data: { user: mockUser }, error: null });

            const result = await authService.getCurrentUser();

            expect(result).toEqual(mockUser);
        });

        it('returns null when no user', async () => {
            (mockSupabaseAuth.getUser as any).mockResolvedValue({ data: { user: null }, error: null });

            const result = await authService.getCurrentUser();

            expect(result).toBeNull();
        });
    });

    describe('getUserProfile', () => {
        it('returns cached profile if available', async () => {
            const cachedProfile = {
                id: '1', first_name: 'John', last_name: 'Doe',
                phone_number: '123', user_image: '', dni: '12345678A',
                auth_id: 'user-123', role: 'ADMIN',
            };
            (authService as any).userProfile = cachedProfile;

            const result = await authService.getUserProfile();

            expect(result).toEqual(cachedProfile);
            expect(mockApiClient.get).not.toHaveBeenCalled();
        });

        it('fetches profile from API when not cached', async () => {
            const mockUser = { id: 'user-123' };
            const apiProfile = {
                id: '1', first_name: 'John', last_name: 'Doe',
                phone_number: '123', user_image: '', dni: '12345678A',
                auth_id: 'user-123', role: 'ADMIN',
            };

            (mockSupabaseAuth.getUser as any).mockResolvedValue({ data: { user: mockUser }, error: null });
            mockApiClient.get.mockResolvedValue({ data: apiProfile });

            const result = await authService.getUserProfile();

            expect(mockApiClient.get).toHaveBeenCalledWith('/users', expect.any(Object));
            expect(result).toEqual(apiProfile);
        });

        it('returns null when no user is authenticated', async () => {
            (mockSupabaseAuth.getUser as any).mockResolvedValue({ data: { user: null }, error: null });

            const result = await authService.getUserProfile();

            expect(result).toBeNull();
        });
    });

    describe('onAuthStateChange', () => {
        it('returns subscription with unsubscribe function', () => {
            const mockUnsubscribe = vi.fn();
            (mockSupabaseAuth.onAuthStateChange as any).mockReturnValue({
                data: { subscription: { unsubscribe: mockUnsubscribe } },
            });

            const callback = vi.fn();
            const result = authService.onAuthStateChange(callback);

            expect(mockSupabaseAuth.onAuthStateChange).toHaveBeenCalled();
            expect(result.data.subscription.unsubscribe).toBe(mockUnsubscribe);
        });
    });
});