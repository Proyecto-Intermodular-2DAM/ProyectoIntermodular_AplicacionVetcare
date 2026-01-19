import React from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../theme/css/ListEmployee.css'; // Reusing common list styles

const ListRooms: React.FC = () => {
    const navigate = useNavigate();

    const rooms = [
        { nombre: '1', codCentro: '1', dniCli: '12334566 B' },
        { nombre: '2', codCentro: '1', dniCli: '12334566 C' },
        { nombre: '3', codCentro: '2', dniCli: '12334566 D' },
        { nombre: '1', codCentro: '3', dniCli: '12334566 E' },
        { nombre: '2', codCentro: '1', dniCli: '12334566 Q' },
    ];

    return (
        <MainLayout>
            <div className="list-employee-container">
                <div className="list-employee-header">
                    <h1>Listado Salas</h1>
                    <button
                        className="btn-gestion-empleado"
                        onClick={() => navigate('/salas')}
                    >
                        Gestion Salas <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="list-tabs">
                    <div className="tab-item selected">Listado Salas</div>
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
                            Eliminar Salas <IonIcon icon={chevronForwardOutline} />
                        </button>
                    </div>
                </div>

                <table className="employee-table">
                    <thead>
                        <tr>
                            <th className="col-nombre">Nombre</th>
                            <th className="col-centro">Codigo Centro</th>
                            <th className="col-dni">DNI Cliente</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room, index) => (
                            <tr key={index}>
                                <td className="col-nombre">{room.nombre}</td>
                                <td className="col-centro">{room.codCentro}</td>
                                <td className="col-dni">{room.dniCli}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
};

export default ListRooms;
