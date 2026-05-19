import React from 'react';
import { IonIcon, IonSearchbar } from '@ionic/react';
import { notificationsOutline } from 'ionicons/icons';
import UserMenu from './UserMenu';
import Breadcrumbs from './Breadcrumbs';
import { authService, UserProfile } from '../services/authService';
import '../theme/css/TopBar.css';

const TopBar: React.FC = () => {
    const [showUserMenu, setShowUserMenu] = React.useState(false);
    const [profile, setProfile] = React.useState<UserProfile | null>(null);

    React.useEffect(() => {
        const fetchProfile = async () => {
            const up = await authService.getUserProfile();
            setProfile(up);
        };
        fetchProfile();
    }, []);

    return (
        <div className="top-bar-container">
            <div className="top-bar-left">
                <div className="context-icon-box">
                    A
                </div>
                <Breadcrumbs />
            </div>

            <div className="top-bar-right">

                <div className="notification-button">
                    <IonIcon icon={notificationsOutline} className="notification-icon" />
                    <span className="notification-badge">2</span>
                </div>

                <div
                    className="user-profile"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                >
                    <div className="user-avatar">
                        {profile ? profile.first_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="user-name">{profile ? profile.first_name : 'Cargando...'}</span>
                </div>

                {showUserMenu && (
                    <UserMenu profile={profile} onClose={() => setShowUserMenu(false)} />
                )}
            </div>
        </div>
    );
};

export default TopBar;
