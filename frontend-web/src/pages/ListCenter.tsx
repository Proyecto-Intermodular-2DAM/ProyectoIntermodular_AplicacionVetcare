import React from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../theme/css/ListEmployee.css';

const ListCenter: React.FC = () => {
    const navigate = useNavigate();

    const appointments = [
        { cod: 1, nombre: 'Centro Altabix', codPost: '03203', direccion: 'Plaza España 1'},
        { cod: 2, nombre: 'Centro GranVia', codPost: '03201', direccion: 'Calle Mayor 5'},
        { cod: 3, nombre: 'Centro Ballecas', codPost: '01234', direccion: 'Avenida Libertad 10'},
        { cod: 4, nombre: 'Centro Hospitalet', codPost: '04352', direccion: 'Calle Salud 7'},
        { cod: 5, nombre: 'Centro PlazaMar', codPost: '02481', direccion: 'Calle Comercio 3'},
    ];

    return (
        <MainLayout>
            <div className="list-employee-container">
                <div className="list-employee-header">
                    <h1>Listado Centros</h1>
                    <button
                        className="btn-gestion-empleado"
                        onClick={() => navigate('/centros')}
                    >
                        Gestión Centros <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="list-tabs">
                    <div className="tab-item">Listado Centros</div>
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
                            <input type="text" placeholder="Buscar el centro (Ctrl + G)" />
                        </div>
                        <button className="btn-eliminar-empleado">
                            Eliminar Centro <IonIcon icon={chevronForwardOutline} />
                        </button>
                    </div>
                </div>

                <table className="employee-table">
                    <thead>
                        <tr>
                            <th className="col-no">Cod.</th>
                            <th className="col-dni">Nombre</th>
                            <th className="col-nombre">Código Postal</th>
                            <th className="col-sueldo">Dirección</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((emp) => (
                            <tr key={emp.cod}>
                                <td className="col-no">{emp.cod}</td>
                                <td className="col-dni">{emp.nombre}</td>
                                <td className="col-nombre">{emp.codPost}</td>
                                <td className="col-sueldo">{emp.direccion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
};

export default ListCenter;
