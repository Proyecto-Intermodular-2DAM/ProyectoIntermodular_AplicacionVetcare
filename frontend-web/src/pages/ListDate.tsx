import React from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../theme/css/ListEmployee.css'; // Reusing common list styles

const ListDate: React.FC = () => {
    const navigate = useNavigate();

    const appointments = [
        { no: 1, motivo: 'Vacunación mascota', dniRec: '74252515B', dniCli: '72585958B', idAnimal: '125', fecha: '15.01.2025', hora: '10:16 AM' },
        { no: 2, motivo: 'Operación programada', dniRec: '74252515B', dniCli: '8085457B', idAnimal: '15', fecha: '01.06.2025', hora: '23:32 AM' },
        { no: 3, motivo: 'Revision general', dniRec: '74252515B', dniCli: '74253156B', idAnimal: '215', fecha: '15.07.2025', hora: '10:05 AM' },
        { no: 4, motivo: 'Desparasitación', dniRec: '78888888B', dniCli: '74245218B', idAnimal: '255', fecha: '25.05.2025', hora: '10:25 AM' },
        { no: 5, motivo: 'Operación programada', dniRec: '78888888B', dniCli: '74879457B', idAnimal: '305', fecha: '25.25.2025', hora: '16:15 AM' },
    ];

    return (
        <MainLayout>
            <div className="list-employee-container">
                <div className="list-employee-header">
                    <h1>Listado Citas</h1>
                    <button
                        className="btn-gestion-empleado"
                        onClick={() => navigate('/citas')}
                    >
                        Gestión Citas <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="list-tabs">
                    <div className="tab-item selected">Listado Citas</div>
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
                            Eliminar Cita <IonIcon icon={chevronForwardOutline} />
                        </button>
                    </div>
                </div>

                <table className="employee-table">
                    <thead>
                        <tr>
                            <th className="col-check" style={{ width: '40px' }}><input type="checkbox" /></th>
                            <th className="col-no">No.</th>
                            <th className="col-motivo">Motivo</th>
                            <th className="col-dni-rec">DNI Recepcionista <span style={{ color: 'red' }}>*</span></th>
                            <th className="col-dni-cli">DNI Cliente</th>
                            <th className="col-animal">ID Animal</th>
                            <th className="col-fecha">Fecha / Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((apt) => (
                            <tr key={apt.no}>
                                <td className="col-check"><input type="checkbox" /></td>
                                <td className="col-no">{apt.no}</td>
                                <td className="col-motivo">{apt.motivo}</td>
                                <td className="col-dni-rec"><strong>{apt.dniRec}</strong></td>
                                <td className="col-dni-cli"><strong>{apt.dniCli}</strong></td>
                                <td className="col-animal">{apt.idAnimal}</td>
                                <td className="col-fecha">
                                    <div>{apt.fecha}</div>
                                    <div style={{ fontSize: '12px', color: '#888' }}>{apt.hora}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
};

export default ListDate;
