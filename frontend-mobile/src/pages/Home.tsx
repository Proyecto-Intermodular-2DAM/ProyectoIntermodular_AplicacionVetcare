import React from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonFooter,
    IonMenuButton
} from '@ionic/react';
import {
    personCircleOutline, // Icono de usuario/perfil
    calendarOutline, // Icono para Citas
    pawOutline, // Icono para Adopción
    documentTextOutline, // Icono para Historial
    pulseOutline, // Icono para Tratamientos
    chevronForwardOutline, // Icono de flecha para detalle
    menuOutline // <-- ¡CLAVE! Asegúrate de que esté aquí.
} from 'ionicons/icons';

// Asegúrate de que esta ruta sea correcta para tus estilos
import '../theme/Home.css';

interface MenuOption {
    title: string;
    icon: string;
    path: string;
}

const MenuPage: React.FC = () => {

    // Función de navegación (simulada)
    const handleNavigation = (path: string) => {
        console.log(`Navegando a: ${path}`);
        // En una aplicación real, usarías history.push(path) o useNavigate()
    };

    // Definición de las opciones del menú
    const menuOptions: MenuOption[] = [
        { title: "Citas", icon: calendarOutline, path: "/citas" },
        { title: "Adopción", icon: pawOutline, path: "/adopcion" },
        { title: "Historial", icon: documentTextOutline, path: "/historial" },
        { title: "Tratamientos", icon: pulseOutline, path: "/tratamientos" },
    ];

    return (
        <IonPage className="vetcare-page">

            {/* -------------------- Cabecera de la Aplicación -------------------- */}
            <IonHeader className="ion-no-border vetcare-header">
                <div className="status-bar-spacer" />
                <IonToolbar>

                    {/* TÍTULO: Vetcare */}
                    <IonTitle className="vetcare-title" slot="start">Vetcare</IonTitle>

                    {/* BOTONES DE LA DERECHA (Perfil y Menú Hamburguesa) */}
                    <IonButtons slot="end">

                        {/* 1. Icono de Perfil estilizado */}
                        <IonButton className="header-icon-button profile-button" onClick={() => handleNavigation('/profile')}>
                            <IonIcon slot="icon-only" icon={personCircleOutline} />
                        </IonButton>

                        {/* 2. Botón Hamburguesa (Menu Button) */}
                        <IonButton className="header-icon-button menu-button" onClick={() => handleNavigation('/menu')}>
                            <IonIcon slot="icon-only" icon={menuOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            {/* -------------------- Contenido Principal (Opciones de Menú) -------------------- */}
            <IonContent className="ion-padding menu-content">

                <IonList className="menu-list" lines="none">
                    {menuOptions.map((option, index) => (
                        <IonItem
                            key={index}
                            className="menu-item-box"
                            button
                            detail={false}
                            onClick={() => handleNavigation(option.path)}
                        >
                            {/* Icono de la opción */}
                            <IonIcon
                                slot="start"
                                icon={option.icon}
                                className="item-icon"
                            />

                            {/* Título de la opción */}
                            <IonLabel>
                                <h2>{option.title}</h2>
                            </IonLabel>

                            {/* Icono de flecha a la derecha */}
                            <IonIcon
                                slot="end"
                                icon={chevronForwardOutline}
                                className="arrow-icon"
                            />
                        </IonItem>
                    ))}
                </IonList>

            </IonContent>

        </IonPage>
    );
};

export default MenuPage;