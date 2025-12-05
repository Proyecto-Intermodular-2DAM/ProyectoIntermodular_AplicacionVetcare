import {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    useIonRouter,
    IonMenuButton
} from '@ionic/react';
import { arrowBack, personCircle } from 'ionicons/icons';
import { useLocation } from 'react-router-dom';

const TopBar: React.FC = () => {
    const location = useLocation();
    const router = useIonRouter();
    const isHome = location.pathname === '/home';

    const handleLogoClick = () => {
        router.push('/home', 'root', 'replace');
    };

    const handleBackClick = () => {
        if (router.canGoBack()) {
            router.goBack();
        } else {
            router.push('/home', 'root', 'replace');
        }
    };

    return (
        <IonHeader className="ion-no-border">
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
                    <IonButton>
                        <IonIcon slot="icon-only" icon={personCircle} className="top-bar-icon-profile" />
                    </IonButton>
                    <IonMenuButton menu="main-menu" className="top-bar-icon-menu" />
                </IonButtons>
            </IonToolbar>
        </IonHeader>
    );
};

export default TopBar;
