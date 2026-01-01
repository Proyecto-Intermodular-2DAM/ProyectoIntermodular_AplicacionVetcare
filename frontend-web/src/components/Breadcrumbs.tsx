import React from 'react';
import { IonBreadcrumb, IonBreadcrumbs, IonIcon } from '@ionic/react';
import { chevronForward } from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import '../theme/css/Breadcrumbs.css';

const routeMap: { [key: string]: string } = {
    'empleados': 'Empleados',
    'citas': 'Gestión Citas',
    'date': 'Gestión Citas',
    'centros': 'Centros',
    'animales': 'Gestión Animal',
    'gestion-animal': 'Gestión Animal',
    'Manufacturing': 'Manufacturing',
    'salas': 'Gestión Salas',
    'gestion-salas': 'Gestión Salas',
    'tratamientos': 'Gestión Tratamiento',
    'gestion-tratamiento': 'Gestión Tratamiento',
    'historial-adopciones': 'Gestión Adopción',
    'gestion-adopcion': 'Gestión Adopción',
    'clientes': 'Clientes',
    'usuarios': 'Usuarios',
    'ajustes': 'Ajustes Roles y Permisos',
    'listado-empleados': 'Listado Empleados',
    'listado-citas': 'Listado Citas',
    'listado-animales': 'Listado Animales',
    'listado-salas': 'Listado Salas',
    'listado-tratamientos': 'Listado Tratamiento',
    'listado-adopcion': 'Historial Adopción',
    'home': 'Home'
};

// Map to define virtual parents for flat routes
const parentMap: { [key: string]: string } = {
    'listado-empleados': 'empleados',
    'listado-centros': 'centros',
    'listado-citas': 'citas',
    'listado-animales': 'animales',
    'listado-salas': 'salas',
    'listado-tratamientos': 'tratamientos',
    'listado-adopcion': 'adopcion',
    'gestion-salas': 'Manufacturing',
    'gestion-tratamiento': 'Manufacturing',
    'gestion-adopcion': 'Manufacturing',
    'gestion-animal': 'centros'
};

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const rawPathnames = location.pathname.split('/').filter((x) => x);

    // Virtualize hierarchy if it's a flat list/management route
    let pathnames = [...rawPathnames];
    if (pathnames.length === 1 && parentMap[pathnames[0]]) {
        pathnames = [parentMap[pathnames[0]], pathnames[0]];
    }

    // Don't show breadcrumbs on home or login
    if (rawPathnames.length === 0 || rawPathnames[0] === 'home' || rawPathnames[0] === 'login') {
        return null;
    }

    return (
        <div className="custom-breadcrumbs-container">
            <IonIcon icon={chevronForward} className="breadcrumb-separator-start" />

            <IonBreadcrumbs
                maxItems={5}
                itemsBeforeCollapse={2}
                itemsAfterCollapse={2}
                className="custom-ion-breadcrumbs"
            >
                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const label = routeMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

                    return (
                        <IonBreadcrumb
                            key={`${value}-${index}`}
                            className={`breadcrumb-item ${last ? 'active' : ''}`}
                        >
                            {label}
                            {!last && <IonIcon slot="separator" icon={chevronForward} />}
                        </IonBreadcrumb>
                    );
                })}
            </IonBreadcrumbs>
        </div>
    );
};

export default Breadcrumbs;
