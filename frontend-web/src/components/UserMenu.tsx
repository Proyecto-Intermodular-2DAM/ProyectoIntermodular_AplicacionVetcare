import React from 'react';
import { IonIcon } from '@ionic/react';
import { person, logOutOutline } from 'ionicons/icons';
import { authService, UserProfile } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import '../theme/css/UserMenu.css';

interface UserMenuProps {
    profile: UserProfile | null;
    onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ profile, onClose }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.signOut();
            onClose();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    return (
        <div className="user-menu-container">
            <div className="user-menu-header">
                <div className="menu-user-avatar">
                    {profile ? profile.first_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="menu-user-name">{profile ? `${profile.first_name} ${profile.last_name}` : 'Cargando...'}</span>
            </div>

            <div className="user-menu-list">

                <div className="user-menu-item" onClick={handleLogout}>
                    <IonIcon icon={logOutOutline} style={{ transform: 'rotate(180deg)' }} />
                    <span>Cerrar Sesión</span>
                </div>
            </div>
        </div>
    );
};

export default UserMenu;
