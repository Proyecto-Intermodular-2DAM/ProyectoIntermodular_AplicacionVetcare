import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './authService';

// Mocks deben definirse ANTES de cualquier variable (hoisting de vi.mock)
vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: {
            signUp: vi.fn(),
            signInWithPassword: vi.fn(),
            signOut: vi.fn(),
            resetPasswordForEmail: vi.fn(),
            updateUser: vi.fn(),
            getUser: vi.fn(),
            getSession: vi.fn(),
            onAuthStateChange: vi.fn(),
        },
    },
}));

vi.mock('./apiClient', () => ({
    default: {
        get: vi.fn(),
        patch: vi.fn(),
    },
}));

vi.mock('./vetService', () => ({
    vetService: {
        clearCache: vi.fn(),
    },
}));

import { supabase } from '../lib/supabase';
import apiClient from './apiClient';
import { vetService } from './vetService';

const mockSupabaseAuth = supabase.auth;
const mockApiClient = apiClient as any;
const mockVetService = vetService as any;

describe('AuthService (frontend-mobile)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (authService as any).userProfile = null;
        (authService as any).userIdCache = null;
        (authService as any).profilePromise = null;
    });

    describe('signUp', () => {
        it('registers a new user with email and password', async () => {
            const mockUser = { id: 'user-123', email: 'new@test.com' };
            (mockSupabaseAuth.signUp as any).mockResolvedValue({
                data: { user: mockUser, session: { access_token: 'token' } },
                error: null,
            });

            const result = await authService.signUp({
                email: 'new@test.com',
                password: 'pass123',
                name: 'John',
                surname: 'Doe',
                dni: '12345678A',
                phone: '612345678',
            });

            expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith(expect.objectContaining({
                email: 'new@test.com',
                password: 'pass123',
            }));
            expect(result.user).toEqual(mockUser);
        });

        it('throws error when signUp fails', async () => {
            (mockSupabaseAuth.signUp as any).mockResolvedValue({
                data: { user: null },
                error: { message: 'Email already registered' },
            });

            await expect(authService.signUp({
                email: 'exists@test.com',
                password: 'pass123',
                name: 'John',
                surname: 'Doe',
                dni: '12345678A',
                phone: '612345678',
            })).rejects.toThrow('Email already registered');
        });
    });

    describe('signIn', () => {
        it('authenticates user with credentials', async () => {
            const mockUser = { id: 'user-123', email: 'test@test.com' };
            (mockSupabaseAuth.signInWithPassword as any).mockResolvedValue({
                data: { user: mockUser, session: { access_token: 'token' } },
                error: null,
            });

            const result = await authService.signIn('test@test.com', 'password123');

            expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@test.com',
                password: 'password123',
            });
            expect(result.user).toEqual(mockUser);
        });

        it('throws error on invalid credentials', async () => {
            (mockSupabaseAuth.signInWithPassword as any).mockResolvedValue({
                data: { user: null },
                error: { message: 'Invalid login credentials' },
            });

            await expect(authService.signIn('test@test.com', 'wrong')).rejects.toThrow('Invalid login credentials');
        });
    });

    describe('signOut', () => {
        it('clears session and caches', async () => {
            (mockSupabaseAuth.signOut as any).mockResolvedValue({ error: null });

            await authService.signOut();

            expect(mockSupabaseAuth.signOut).toHaveBeenCalled();
            expect(mockVetService.clearCache).toHaveBeenCalled();
        });
    });

    describe('resetPassword', () => {
        it('sends password recovery email', async () => {
            (mockSupabaseAuth.resetPasswordForEmail as any).mockResolvedValue({ error: null });

            const result = await authService.resetPassword('test@test.com');

            expect(mockSupabaseAuth.resetPasswordForEmail).toHaveBeenCalledWith(
                'test@test.com',
                expect.objectContaining({ redirectTo: expect.any(String) })
            );
            expect(result.error).toBeNull();
        });
    });

    describe('getCurrentUser', () => {
        it('returns current Supabase user', async () => {
            const mockUser = { id: 'user-123', email: 'test@test.com' };
            (mockSupabaseAuth.getUser as any).mockResolvedValue({ data: { user: mockUser } });

            const result = await authService.getCurrentUser();

            expect(result).toEqual(mockUser);
        });

        it('returns null on error', async () => {
            (mockSupabaseAuth.getUser as any).mockRejectedValue(new Error('Network error'));

            const result = await authService.getCurrentUser();

            expect(result).toBeNull();
        });
    });

    describe('onAuthStateChange', () => {
        it('returns subscription with unsubscribe', () => {
            const mockUnsubscribe = vi.fn();
            (mockSupabaseAuth.onAuthStateChange as any).mockReturnValue({
                data: { subscription: { unsubscribe: mockUnsubscribe } },
            });

            const callback = vi.fn();
            const result = authService.onAuthStateChange(callback);

            expect(result.data.subscription.unsubscribe).toBe(mockUnsubscribe);
        });
    });
});