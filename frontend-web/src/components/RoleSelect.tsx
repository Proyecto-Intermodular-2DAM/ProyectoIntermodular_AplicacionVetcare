import React, { useState, useRef, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import '../theme/css/RoleSelect.css';

interface RoleSelectProps {
    value: string;
    onChange: (role: string) => void;
}

const ROLE_MAP: Record<string, string> = {
    'ADMIN': 'Administrador',
    'RECEPTIONIST': 'Recepcionista',
    'VETERINARIAN': 'Veterinario',
    'CAREGIVER': 'Cuidador',
    'SURGEON': 'Cirujano',
    // Reverse mapping for display if needed
    'Administrador': 'ADMIN',
    'Recepcionista': 'RECEPTIONIST',
    'Veterinario': 'VETERINARIAN',
    'Cuidador': 'CAREGIVER',
    'Cirujano': 'SURGEON'
};

const RoleSelect: React.FC<RoleSelectProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const roles = [
        { label: 'Administrador', value: 'ADMIN' },
        { label: 'Recepcionista', value: 'RECEPTIONIST' },
        { label: 'Veterinario', value: 'VETERINARIAN' },
        { label: 'Cuidador', value: 'CAREGIVER' },
        { label: 'Cirujano', value: 'SURGEON' },
        { label: 'Cliente', value: 'CLIENT' }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (roleValue: string) => {
        onChange(roleValue);
        setIsOpen(false);
    };

    // Helper to get display label
    const getDisplayLabel = (val: string) => {
        return ROLE_MAP[val] || val;
    };

    return (
        <div className="role-select-container" ref={containerRef}>
            <div className="role-select-trigger" onClick={() => setIsOpen(!isOpen)}>
                <span>{getDisplayLabel(value)}</span>
                <IonIcon icon={chevronDownOutline} className="chevron-icon" />
            </div>

            {isOpen && (
                <div className="role-select-options">
                    {roles.map((role) => (
                        <div
                            key={role.value}
                            className={`role-option ${value === role.value || value === role.label ? 'selected' : ''}`}
                            onClick={() => handleSelect(role.value)}
                        >
                            {role.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoleSelect;
