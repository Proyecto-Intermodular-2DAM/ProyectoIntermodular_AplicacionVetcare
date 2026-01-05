import React, { useState, useRef, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import '../theme/css/RoleSelect.css';

interface RoleSelectProps {
    value: string;
    onChange: (role: string) => void;
}

const RoleSelect: React.FC<RoleSelectProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const roles = ['Administrador', 'Recepcionista', 'Veterinario', 'Cuidador', 'Cirujano'];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (role: string) => {
        onChange(role);
        setIsOpen(false);
    };

    return (
        <div className="role-select-container" ref={containerRef}>
            <div className="role-select-trigger" onClick={() => setIsOpen(!isOpen)}>
                <span>{value}</span>
                <IonIcon icon={chevronDownOutline} className="chevron-icon" />
            </div>

            {isOpen && (
                <div className="role-select-options">
                    {roles.map((role) => (
                        <div
                            key={role}
                            className={`role-option ${value === role ? 'selected' : ''}`}
                            onClick={() => handleSelect(role)}
                        >
                            {role}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoleSelect;
