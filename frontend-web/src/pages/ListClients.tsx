import React from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../theme/css/ListEmployee.css'; // Reusing common list styles

const ListClients: React.FC = () => {
    const navigate = useNavigate();

    const clients = [
        { id: 1, dni: '12345678A', nombre: 'Juan Carlos', email: 'jc@gmial.com', fecha: '11/09/2025', tel: '966 66 66 66' },
        { id: 2, dni: '12345678B', nombre: 'Ruben', email: 'ruben@gmail.com', fecha: '02/05/2024', tel: '966 69 69 69' },
        { id: 3, dni: '12345678C', nombre: 'Martin', email: 'martin@gmail.com', fecha: '19/06/2015', tel: '966 66 66 62' },
        { id: 4, dni: '12345678F', nombre: 'Raul', email: 'raul@gmail.com', fecha: '06/01/2016', tel: '966 66 66 63' },
        { id: 5, dni: '12345678E', nombre: 'Alma', email: 'alma@gmail.com', fecha: '01/05/2020', tel: '966 66 66 64' },
    ];

    return (
        <MainLayout>
            <div className="list-employee-container">
                <div className="list-employee-header">
                    <h1>Listado Cliente</h1>
                    <button
                        className="btn-gestion-empleado"
                        onClick={() => navigate('/gestion-clientes')}
                    >
                        Gestión Cliente <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="list-tabs">
                    <div className="tab-item selected">Listado Cliente</div>
                </div>

                <div className="list-controls">
                    <div className="controls-left">
                        <div className="filter-select">
                            <IonIcon icon={calendarOutline} />
                            Last 30 days
                            <IonIcon icon={chevronForwardOutline} style={{ transform: 'rotate(90deg)', fontSize: '10px' }} />
                        </div>
                        <div className="filter-select">
                            <IonIcon icon={filterOutline} />
                            Filter by
                            <IonIcon icon={chevronForwardOutline} style={{ transform: 'rotate(90deg)', fontSize: '10px' }} />
                        </div>
                    </div>

                    <div className="controls-right">
                        <div className="table-search-bar">
                            <IonIcon icon={searchOutline} style={{ marginRight: '8px', color: '#888' }} />
                            <input type="text" placeholder="Buscar la cita (Ctrl + G)" />
                        </div>
                        <button className="btn-eliminar-empleado">
                            Eliminar Cliente <IonIcon icon={chevronForwardOutline} />
                        </button>
                    </div>
                </div>

                <table className="employee-table">
                    <thead>
                        <tr>
                            <th className="col-no">Id</th>
                            <th className="col-dni">DNI Cliente</th>
                            <th className="col-nombre">Nombre</th>
                            <th className="col-email">Email</th>
                            <th className="col-fecha">Fecha</th>
                            <th className="col-tel">Telefono</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((c) => (
                            <tr key={c.id}>
                                <td className="col-no">{c.id}</td>
                                <td className="col-dni">{c.dni}</td>
                                <td className="col-nombre">{c.nombre}</td>
                                <td className="col-email"><strong>{c.email}</strong></td>
                                <td className="col-fecha"><strong>{c.fecha}</strong></td>
                                <td className="col-tel"><strong>{c.tel}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
};

export default ListClients;
