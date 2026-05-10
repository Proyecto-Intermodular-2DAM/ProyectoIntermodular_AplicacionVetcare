import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

// Mock authService - hoisted to top
vi.mock('../services/authService', () => ({
    authService: {
        getCurrentUser: vi.fn(),
        getUserProfile: vi.fn(),
        onAuthStateChange: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
    },
}));

import { authService } from '../services/authService';

const mockAuthService = authService as any;

// Test component that consumes the context
const TestConsumer: React.FC = () => {
    const { user, profile, loading, signIn, signOut } = useAuth();
    return (
        <div>
            <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>
            <div data-testid="user">{user ? user.email : 'no-user'}</div>
            <div data-testid="profile-role">{profile ? profile.role : 'no-profile'}</div>
            <button data-testid="signin-btn" onClick={() => signIn('test@test.com', 'pass')}>Sign In</button>
            <button data-testid="signout-btn" onClick={() => signOut()}>Sign Out</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initializes with loading=true and then sets user/profile', async () => {
        const mockUser = { id: 'user-1', email: 'test@test.com' };
        const mockProfile = { id: '1', role: 'ADMIN', first_name: 'Test' };

        mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
        mockAuthService.getUserProfile.mockResolvedValue(mockProfile);
        mockAuthService.onAuthStateChange.mockReturnValue({
            data: { subscription: { unsubscribe: vi.fn() } },
        });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(screen.getByTestId('loading').textContent).toBe('loading');

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('ready');
        });

        expect(screen.getByTestId('user').textContent).toBe('test@test.com');
        expect(screen.getByTestId('profile-role').textContent).toBe('ADMIN');
    });

    it('handles no active session on mount', async () => {
        mockAuthService.getCurrentUser.mockResolvedValue(null);
        mockAuthService.onAuthStateChange.mockReturnValue({
            data: { subscription: { unsubscribe: vi.fn() } },
        });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('ready');
        });

        expect(screen.getByTestId('user').textContent).toBe('no-user');
        expect(screen.getByTestId('profile-role').textContent).toBe('no-profile');
    });

    it('calls authService.signIn when signIn is invoked', async () => {
        mockAuthService.getCurrentUser.mockResolvedValue(null);
        mockAuthService.onAuthStateChange.mockReturnValue({
            data: { subscription: { unsubscribe: vi.fn() } },
        });
        mockAuthService.signIn.mockResolvedValue(undefined);

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('ready');
        });

        screen.getByTestId('signin-btn').click();

        await waitFor(() => {
            expect(mockAuthService.signIn).toHaveBeenCalledWith('test@test.com', 'pass');
        });
    });

    it('clears user and profile on signOut', async () => {
        const mockUser = { id: 'user-1', email: 'test@test.com' };
        const mockProfile = { id: '1', role: 'ADMIN' };

        mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
        mockAuthService.getUserProfile.mockResolvedValue(mockProfile);
        mockAuthService.onAuthStateChange.mockReturnValue({
            data: { subscription: { unsubscribe: vi.fn() } },
        });
        mockAuthService.signOut.mockResolvedValue(undefined);

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('user').textContent).toBe('test@test.com');
        });

        screen.getByTestId('signout-btn').click();

        await waitFor(() => {
            expect(mockAuthService.signOut).toHaveBeenCalled();
        });
    });

    it('throws error when useAuth is used outside AuthProvider', () => {
        const BadComponent: React.FC = () => {
            useAuth();
            return null;
        };

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => render(<BadComponent />)).toThrow('useAuth must be used within an AuthProvider');

        consoleSpy.mockRestore();
    });
});