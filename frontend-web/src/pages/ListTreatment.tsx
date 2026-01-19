import React from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../theme/css/ListEmployee.css'; // Reusing common list styles

const ListTreatment: React.FC = () => {
    const navigate = useNavigate();

    const treatments = [
        { id: 1, dniCli: '12345678A', animal: 'Anakin', desc: 'Tratamiento antibiótico por infección', med: 'Amoxicilina 250 mg', psol: '1 comprimido cada 12 horas durante 7 días' },
        { id: 2, dniCli: '12345678B', animal: 'Pelusa', desc: 'Desparasitación interna por parásitos', med: 'Milbemax', psol: '1 comprimido cada 3 meses' },
        { id: 3, dniCli: '12345678C', animal: 'Mustio', desc: 'Control de dermatitis alérgica con picazón', med: 'Apoquel 5.4 mg', psol: '1 comprimido diario durante 14 días' },
        { id: 4, dniCli: '12345678F', animal: 'Bola', desc: 'Tratamiento para otitis externa con secreción.', med: 'Otomax gotas', psol: '4 gotas por oído, 2 veces al día durante' },
        { id: 5, dniCli: '12345678E', animal: 'camilo', desc: 'Prevención de pulgas y garrapatas.', med: 'NexGard 28 mg', psol: 'NexGard 28 mg' },
    ];

    return (
        <MainLayout>
            <div className="list-employee-container">
                <div className="list-employee-header">
                    <h1>Listado Tratamiento</h1>
                    <button
                        className="btn-gestion-empleado"
                        onClick={() => navigate('/tratamientos')}
                    >
                        Gestión Tratamiento <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="list-tabs">
                    <div className="tab-item selected">Listado Tratamiento</div>
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
                            Eliminar Tratamiento <IonIcon icon={chevronForwardOutline} />
                        </button>
                    </div>
                </div>

                <table className="employee-table">
                    <thead>
                        <tr>
                            <th className="col-no">Id</th>
                            <th className="col-dni">DNI Cliente</th>
                            <th className="col-nombre">Nombre Animal</th>
                            <th className="col-desc">Descripción</th>
                            <th className="col-med">Medicamento</th>
                            <th className="col-psol">Psologia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {treatments.map((tr) => (
                            <tr key={tr.id}>
                                <td className="col-no">{tr.id}</td>
                                <td className="col-dni">{tr.dniCli}</td>
                                <td className="col-nombre">{tr.animal}</td>
                                <td className="col-desc"><strong>{tr.desc}</strong></td>
                                <td className="col-med"><strong>{tr.med}</strong></td>
                                <td className="col-psol">{tr.psol}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
};

export default ListTreatment;
