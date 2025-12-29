import React from 'react';
import { IonIcon, IonSearchbar } from '@ionic/react';
import { notificationsOutline } from 'ionicons/icons';
import UserMenu from './UserMenu';
import Breadcrumbs from './Breadcrumbs';
import '../theme/css/TopBar.css';

const TopBar: React.FC = () => {
    const [showUserMenu, setShowUserMenu] = React.useState(false);

    return (
        <div className="top-bar-container">
            <div className="top-bar-left">
                {/* Black box icon with A, as seen in image */}
                <div className="context-icon-box">
                    A
                </div>
                <Breadcrumbs />
            </div>

            <div className="top-bar-right">
                <IonSearchbar
                    placeholder="Search or type a command (Ctrl + G)"
                    className="custom-search-bar"
                />

                <div className="notification-button">
                    <IonIcon icon={notificationsOutline} className="notification-icon" />
                    <span className="notification-badge">2</span>
                </div>

                <div
                    className="user-profile"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                >
                    <div className="user-avatar">
                        P
                    </div>
                    <span className="user-name">Raul</span>
                </div>

                {showUserMenu && (
                    <UserMenu onClose={() => setShowUserMenu(false)} />
                )}
            </div>
        </div>
    );
};

export default TopBar;
