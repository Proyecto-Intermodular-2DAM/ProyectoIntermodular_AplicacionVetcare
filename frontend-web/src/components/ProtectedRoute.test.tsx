import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import React from 'react';

// Mock useAuth from correct path
vi.mock('../contexts/AuthContext', () => ({
    useAuth: vi.fn(),
}));

import { useAuth } from '../contexts/AuthContext';

const mockUseAuth = useAuth as any;

// Mock IonLoading
vi.mock('@ionic/react', () => ({
    IonLoading: ({ message }: { message: string }) => <div data-testid="loading">{message}</div>,
}));

const DummyComponent: React.FC = () => <div data-testid="protected-content">Protected Content</div>;

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading spinner while auth is initializing', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            profile: null,
            loading: true,
        });

        render(
            <MemoryRouter initialEntries={['/home']}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/home" element={<DummyComponent />} />
                    </Route>
                    <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('loading')).toHaveTextContent('Verificando sesión...');
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('redirects to /login when user is not authenticated', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            profile: null,
            loading: false,
        });

        render(
            <MemoryRouter initialEntries={['/home']}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/home" element={<DummyComponent />} />
                    </Route>
                    <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('login-page')).toBeInTheDocument();
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('redirects to /login when profile role is CLIENT', () => {
        mockUseAuth.mockReturnValue({
            user: { id: 'user-1', email: 'client@test.com' },
            profile: { id: '1', role: 'CLIENT', first_name: 'Client' },
            loading: false,
        });

        render(
            <MemoryRouter initialEntries={['/home']}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/home" element={<DummyComponent />} />
                    </Route>
                    <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('login-page')).toBeInTheDocument();
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('renders Outlet when user is ADMIN', () => {
        mockUseAuth.mockReturnValue({
            user: { id: 'user-1', email: 'admin@test.com' },
            profile: { id: '1', role: 'ADMIN', first_name: 'Admin' },
            loading: false,
        });

        render(
            <MemoryRouter initialEntries={['/home']}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/home" element={<DummyComponent />} />
                    </Route>
                    <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });

    it('renders Outlet when user is employee (non-CLIENT)', () => {
        mockUseAuth.mockReturnValue({
            user: { id: 'user-1', email: 'vet@test.com' },
            profile: { id: '1', role: 'VETERINARIAN', first_name: 'Vet' },
            loading: false,
        });

        render(
            <MemoryRouter initialEntries={['/home']}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/home" element={<DummyComponent />} />
                    </Route>
                    <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });
});