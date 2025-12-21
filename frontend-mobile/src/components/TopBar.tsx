import {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonMenuButton
} from '@ionic/react';
import { arrowBack, personCircle } from 'ionicons/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const TopBar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/home';

    const handleLogoClick = () => {
        navigate('/home');
    };

    const handleBackClick = () => {
        // Simple back navigation logic for standard router
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/home', { replace: true });
        }
    };

    const handleProfileClick = () => {
        navigate('/user-profile');
    };

    return (
        <IonHeader className="ion-no-border">
            <div className="status-bar-spacer" />
            <IonToolbar className="top-bar-toolbar">
                <IonButtons slot="start">
                    {!isHome && (
                        <IonButton onClick={handleBackClick}>
                            <IonIcon slot="icon-only" icon={arrowBack} className="top-bar-icon-primary" />
                        </IonButton>
                    )}
                    <div onClick={handleLogoClick} className={`top-bar-title ${isHome ? 'top-bar-title-margin' : ''}`}>
                        Vetcare
                    </div>
                </IonButtons>

                <IonButtons slot="end">
                    <IonButton onClick={handleProfileClick}>
                        <IonIcon slot="icon-only" icon={personCircle} className="top-bar-icon-profile" />
                    </IonButton>
                    <IonMenuButton menu="main-menu" className="top-bar-icon-menu" />
                </IonButtons>
            </IonToolbar>
        </IonHeader>
    );
};

export default TopBar;
