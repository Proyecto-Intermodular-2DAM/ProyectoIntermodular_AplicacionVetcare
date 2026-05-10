import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SideMenu from './SideMenu';
import React from 'react';

// Mock useAuth from correct path
vi.mock('../contexts/AuthContext', () => ({
    useAuth: vi.fn(),
}));

import { useAuth } from '../contexts/AuthContext';

const mockUseAuth = useAuth as any;

// Mock Ionic components
vi.mock('@ionic/react', () => ({
    IonIcon: () => <span data-testid="icon" style={{ display: 'none' }} />,
    IonItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
        <div data-testid="menu-item" onClick={onClick}>{children}</div>
    ),
    IonLabel: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    IonList: ({ children }: { children: React.ReactNode }) => <div data-testid="menu-list">{children}</div>,
}));

describe('SideMenu', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows "Empleados" and "Usuarios" when role is ADMIN', () => {
        mockUseAuth.mockReturnValue({
            profile: { role: 'ADMIN', first_name: 'Admin' },
        });

        render(
            <MemoryRouter>
                <SideMenu />
            </MemoryRouter>
        );

        const menuItems = screen.getAllByTestId('menu-item');
        const labels = menuItems.map((item) => item.textContent);

        expect(labels).toContain('Empleados');
        expect(labels).toContain('Usuarios');
        expect(labels).toContain('Roles Y Permisos');
    });

    it('hides "Empleados" and "Usuarios" when role is VETERINARIAN', () => {
        mockUseAuth.mockReturnValue({
            profile: { role: 'VETERINARIAN', first_name: 'Vet' },
        });

        render(
            <MemoryRouter>
                <SideMenu />
            </MemoryRouter>
        );

        const menuItems = screen.getAllByTestId('menu-item');
        const labels = menuItems.map((item) => item.textContent);

        expect(labels).not.toContain('Empleados');
        expect(labels).not.toContain('Usuarios');
        expect(labels).toContain('Citas');
        expect(labels).toContain('Animales');
    });

    it('hides admin items when role is RECEPTIONIST', () => {
        mockUseAuth.mockReturnValue({
            profile: { role: 'RECEPTIONIST', first_name: 'Recep' },
        });

        render(
            <MemoryRouter>
                <SideMenu />
            </MemoryRouter>
        );

        const menuItems = screen.getAllByTestId('menu-item');
        const labels = menuItems.map((item) => item.textContent);

        expect(labels).not.toContain('Empleados');
        expect(labels).not.toContain('Usuarios');
        expect(labels).toContain('Citas');
        expect(labels).toContain('Clientes');
    });

    it('shows base menu items for all authenticated users', () => {
        mockUseAuth.mockReturnValue({
            profile: { role: 'CAREGIVER', first_name: 'Care' },
        });

        render(
            <MemoryRouter>
                <SideMenu />
            </MemoryRouter>
        );

        const menuItems = screen.getAllByTestId('menu-item');
        const labels = menuItems.map((item) => item.textContent);

        expect(labels).toContain('Citas');
        expect(labels).toContain('Centros');
        expect(labels).toContain('Animales');
        expect(labels).toContain('Salas');
        expect(labels).toContain('Tratamientos');
        expect(labels).toContain('Historial Adopciónes');
        expect(labels).toContain('Clientes');
    });
});