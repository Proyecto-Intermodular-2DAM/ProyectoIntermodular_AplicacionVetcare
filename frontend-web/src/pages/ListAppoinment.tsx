import React from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../theme/css/ListEmployee.css';

const ListEmployee: React.FC = () => {
    const navigate = useNavigate();

    const appointments = [
        { no: 1, motivo: 'Consulta', dniRec: '12345678A', dniCli: '12345678A', idAnimal: '611', fecha: '15-01-2025'},
        { no: 2, motivo: 'Vacunación', dniRec: '12345678B', dniCli: '12345678B', idAnimal: '62', fecha: '2000 €'},
        { no: 3, motivo: 'Castración', dniRec: '12345678C', dniCli: '12345678C', idAnimal: '633', fecha: '1800 €'},
        { no: 4, motivo: 'Consulta', dniRec: '12345678F', dniCli: '12345678F', idAnimal: '255', fecha: '1800 €'},
        { no: 5, motivo: 'Operación', dniRec: '12345678E', dniCli: '12345678E', idAnimal: '305', fecha: '2200 €'},
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
                    <div className="tab-item">Listado Citas</div>
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
                            <th className="col-no">No.</th>
                            <th className="col-dni">Motivo</th>
                            <th className="col-nombre">DNI Recepcionista</th>
                            <th className="col-sueldo">DNI Cliente</th>
                            <th className="col-telefono">ID Animal</th>
                            <th className="col-sueldo">Fecha Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((emp) => (
                            <tr key={emp.no}>
                                <td className="col-no">{emp.no}</td>
                                <td className="col-dni">{emp.motivo}</td>
                                <td className="col-nombre">{emp.dniRec}</td>
                                <td className="col-sueldo">{emp.dniCli}</td>
                                <td className="col-telefono">{emp.idAnimal}</td>
                                <td className="col-sueldo">{emp.fecha}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
};

export default ListEmployee;
