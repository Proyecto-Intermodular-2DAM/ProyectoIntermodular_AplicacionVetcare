import React from 'react';
import { IonBreadcrumb, IonBreadcrumbs, IonIcon } from '@ionic/react';
import { chevronForward } from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import '../theme/css/Breadcrumbs.css';

const routeMap: { [key: string]: string } = {
    'empleados': 'Empleados',
    'citas': 'Citas',
    'centros': 'Centros',
    'animales': 'Animales',
    'salas': 'Salas',
    'tratamientos': 'Tratamientos',
    'historial-adopciones': 'Historial Adopciones',
    'clientes': 'Clientes',
    'usuarios': 'Usuarios',
    'ajustes': 'Ajustes Roles y Permisos',
    'listado-empleados': 'Listado Empleados',
    'home': 'Home'
};

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Don't show breadcrumbs on home or login
    if (pathnames.length === 0 || pathnames[0] === 'home' || pathnames[0] === 'login') {
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
                            key={value}
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
