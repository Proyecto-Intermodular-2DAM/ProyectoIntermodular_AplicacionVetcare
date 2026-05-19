import React from 'react';
import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import {
    gridOutline,
    peopleOutline,
    documentTextOutline,
    businessOutline,
    pawOutline,
    cubeOutline,
    medkitOutline,
    timeOutline,
    personOutline,
    globeOutline,
    settingsOutline,
    appsOutline
} from 'ionicons/icons';
import '../theme/css/SideMenu.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SideMenu: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { profile } = useAuth();
    const isAdmin = profile?.role === 'ADMIN';

    const isActive = (path: string) => location.pathname === path;

    const mainMenuItems = [
        { label: 'Citas', icon: documentTextOutline, path: '/citas' },
        { label: 'Centros', icon: businessOutline, path: '/centros' },
        { label: 'Animales', icon: pawOutline, path: '/animales' },
        { label: 'Salas', icon: cubeOutline, path: '/salas' },
        { label: 'Tratamientos', icon: medkitOutline, path: '/tratamientos' },
        { label: 'Historial Adopciónes', icon: timeOutline, path: '/historial-adopciones' },
        { label: 'Clientes', icon: personOutline, path: '/clientes' },
    ];

    if (isAdmin) {
        mainMenuItems.unshift({ label: 'Empleados', icon: peopleOutline, path: '/empleados' });
    }

    const secondaryMenuItems = [
        { label: 'Roles Y Permisos', icon: settingsOutline, path: '/ajustes' },
    ];

    if (isAdmin) {
        secondaryMenuItems.unshift({ label: 'Usuarios', icon: globeOutline, path: '/usuarios' });
    }

    return (
        <div className="side-menu-container">
            <div className="side-menu-logo">
                <IonIcon icon={appsOutline} className="logo-icon" />
                <h2 className="logo-text">VetCare</h2>
            </div>

            <div className="menu-section-label">MAIN MENU</div>

            <IonList lines="none">
                {mainMenuItems.map((item) => (
                    <IonItem
                        key={item.label}
                        button
                        className={`menu-item ${isActive(item.path) ? 'selected' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <IonIcon icon={item.icon} slot="start" />
                        <IonLabel>{item.label}</IonLabel>
                    </IonItem>
                ))}
            </IonList>

            <div className="menu-divider"></div>

            <IonList lines="none">
                {secondaryMenuItems.map((item) => (
                    <IonItem
                        key={item.label}
                        button
                        className={`menu-item ${isActive(item.path) ? 'selected' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <IonIcon icon={item.icon} slot="start" />
                        <IonLabel>{item.label}</IonLabel>
                    </IonItem>
                ))}
            </IonList>
        </div>
    );
};

export default SideMenu;
