import React from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../theme/css/ListEmployee.css'; // Reusing common list styles

const ListAdoption: React.FC = () => {
    const navigate = useNavigate();

    const adoptions = [
        { id: 1, dniCli: '12345678A', animal: 'Anakin', idAnimal: '145', fecha: '11/09/2025', comentario: '' },
        { id: 2, dniCli: '12345678B', animal: 'Pelusa', idAnimal: '99', fecha: '02/05/2024', comentario: '' },
        { id: 3, dniCli: '12345678C', animal: 'Mustio', idAnimal: '15', fecha: '19/06/2015', comentario: '' },
        { id: 4, dniCli: '12345678F', animal: 'Bola', idAnimal: '120', fecha: '06/01/2016', comentario: '' },
        { id: 5, dniCli: '12345678E', animal: 'camilo', idAnimal: '75', fecha: '01/05/2020', comentario: '' },
    ];

    return (
        <MainLayout>
            <div className="list-employee-container">
                <div className="list-employee-header">
                    <h1>Historial Adopción</h1>
                    <button
                        className="btn-gestion-empleado"
                        onClick={() => navigate('/gestion-adopcion')}
                    >
                        Gestión Adopción <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="list-tabs">
                    <div className="tab-item selected">Listado Adopcion</div>
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
                            Eliminar Adopcion <IonIcon icon={chevronForwardOutline} />
                        </button>
                    </div>
                </div>

                <table className="employee-table">
                    <thead>
                        <tr>
                            <th className="col-no">Id</th>
                            <th className="col-dni">DNI Cliente</th>
                            <th className="col-nombre">Nombre Animal</th>
                            <th className="col-id-animal">Id Animal</th>
                            <th className="col-fecha">Fecha</th>
                            <th className="col-comentario">Comentario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adoptions.map((ad) => (
                            <tr key={ad.id}>
                                <td className="col-no">{ad.id}</td>
                                <td className="col-dni">{ad.dniCli}</td>
                                <td className="col-nombre">{ad.animal}</td>
                                <td className="col-id-animal"><strong>{ad.idAnimal}</strong></td>
                                <td className="col-fecha"><strong>{ad.fecha}</strong></td>
                                <td className="col-comentario">{ad.comentario}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
};

export default ListAdoption;
