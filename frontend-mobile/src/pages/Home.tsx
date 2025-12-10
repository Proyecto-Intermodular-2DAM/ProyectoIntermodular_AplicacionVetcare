import React from 'react';
import {
    IonPage,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
} from '@ionic/react';
import {
    calendarOutline, // Icono para Citas
    pawOutline, // Icono para Adopción
    documentTextOutline, // Icono para Historial
    pulseOutline, // Icono para Tratamientos
    chevronForwardOutline, // Icono de flecha para detalle
} from 'ionicons/icons';
import TopBar from '../components/TopBar';

// Asegúrate de que esta ruta sea correcta para tus estilos
import '../theme/css/Home.css';

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
            <TopBar />

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