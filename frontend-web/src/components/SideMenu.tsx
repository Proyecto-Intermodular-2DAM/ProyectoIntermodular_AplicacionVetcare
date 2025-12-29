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

const SideMenu: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Helper to determine if route is active
    const isActive = (path: string) => location.pathname === path;

    const mainMenuItems = [
        { label: 'Empleados', icon: peopleOutline, path: '/empleados' },
        { label: 'Citas', icon: documentTextOutline, path: '/citas' },
        { label: 'Centros', icon: businessOutline, path: '/centros' },
        { label: 'Animales', icon: pawOutline, path: '/animales' },
        { label: 'Salas', icon: cubeOutline, path: '/salas' },
        { label: 'Tratamientos', icon: medkitOutline, path: '/tratamientos' },
        { label: 'Historial Adopciónes', icon: timeOutline, path: '/historial-adopciones' },
        { label: 'Clientes', icon: personOutline, path: '/clientes' },
    ];

    const secondaryMenuItems = [
        { label: 'Usuarios', icon: globeOutline, path: '/usuarios' }, // globeOutline as placeholder for Usuarios (which was displayed with a web/globe icon in thought process, or maybe circle)
        { label: 'AjustRoles Y Permisos', icon: settingsOutline, path: '/ajustes' },
    ];

    return (
        <div className="side-menu-container">
            {/* Logo Section */}
            <div className="side-menu-logo">
                <IonIcon icon={appsOutline} className="logo-icon" />
                <h2 className="logo-text">VetCare</h2>
            </div>

            {/* Main Menu Label */}
            <div className="menu-section-label">MAIN MENU</div>

            {/* Main Menu List */}
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

            {/* Divider */}
            <div className="menu-divider"></div>

            {/* Secondary Menu List */}
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
