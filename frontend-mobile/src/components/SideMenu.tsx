import React, { useState } from 'react';
import {
    IonMenu,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonMenuToggle,
    useIonRouter,
    IonModal,
    IonButton,
    IonText
} from '@ionic/react';
import { home, call, documentText, logOut, close } from 'ionicons/icons';

const SideMenu: React.FC = () => {
    const router = useIonRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        router.push('/login', 'root', 'replace');
    };

    return (
        <>
            <IonMenu menuId="main-menu" contentId="main-content" side="end" type="overlay" className="side-menu">
                <IonContent className="side-menu-content">
                    <div className="side-menu-close-container">
                        <IonMenuToggle>
                            <IonIcon icon={close} className="side-menu-close-icon" />
                        </IonMenuToggle>
                    </div>
                    <IonList lines="none" className="side-menu-list">
                        <IonMenuToggle autoHide={false}>
                            <IonItem routerLink="/home" routerDirection="root" lines="none" detail={false} className="side-menu-item">
                                <IonIcon slot="start" icon={home} className="side-menu-item-icon" />
                                <IonLabel className="side-menu-item-label">Home</IonLabel>
                            </IonItem>
                            <IonItem button lines="none" detail={false} className="side-menu-item">
                                <IonIcon slot="start" icon={call} className="side-menu-item-icon" />
                                <IonLabel className="side-menu-item-label">Contacta con nosotros</IonLabel>
                            </IonItem>
                            <IonItem routerLink="/legal-terms" routerDirection="forward" lines="none" detail={false} className="side-menu-item">
                                <IonIcon slot="start" icon={documentText} className="side-menu-item-icon" />
                                <IonLabel className="side-menu-item-label">Condiciones Legales</IonLabel>
                            </IonItem>
                            {/* Custom Item for Logout to trigger Modal */}
                            <IonItem button onClick={handleLogoutClick} lines="none" detail={false} className="side-menu-item">
                                <IonIcon slot="start" icon={logOut} className="side-menu-item-icon" />
                                <IonLabel className="side-menu-item-label">Cerrar Sesión</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                    </IonList>
                </IonContent>
            </IonMenu>

            <IonModal isOpen={showLogoutModal} onDidDismiss={() => setShowLogoutModal(false)} style={{ '--height': 'auto', '--width': '80%', '--border-radius': '16px', '--box-shadow': '0 4px 16px rgba(0,0,0,0.12)' }}>
                <div className="logout-modal-container">
                    <div className="logout-modal-icon-container">
                        <IonIcon icon={logOut} className="logout-modal-icon" />
                    </div>
                    <IonText color="dark">
                        <h2 className="logout-modal-title">Cerrar Sesión</h2>
                        <p className="logout-modal-text">¿Seguro que quieres salir?</p>
                    </IonText>
                    <div className="logout-modal-buttons">
                        <IonButton expand="block" fill="outline" onClick={confirmLogout} className="logout-modal-button-confirm">
                            Si
                        </IonButton>
                        <IonButton expand="block" fill="solid" onClick={() => setShowLogoutModal(false)} className="logout-modal-button-cancel">
                            No
                        </IonButton>
                    </div>
                </div>
            </IonModal>
        </>
    );
};

export default SideMenu;
