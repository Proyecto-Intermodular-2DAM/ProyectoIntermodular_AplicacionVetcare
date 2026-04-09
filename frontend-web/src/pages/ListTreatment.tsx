import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonLoading, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/ListEmployee.css';

const ListTreatment: React.FC = () => {
    const navigate = useNavigate();
    const [treatments, setTreatments] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const fetchTreatments = async () => {
            try {
                const data = await vetService.getTreatments();
                setTreatments(data || []);
            } catch (err: any) {
                setToastMessage(err.message || 'Error al cargar tratamientos');
                setShowToast(true);
            } finally {
                setLoading(false);
            }
        };
        fetchTreatments();
    }, []);

    if (loading) {
        return <IonLoading isOpen={true} message="Cargando tratamientos..." />;
    }

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
                            <input 
                                type="text" 
                                placeholder="Buscar tratamiento (Animal, descripción...)" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
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
                            <th className="col-psol">Posología</th>
                        </tr>
                    </thead>
                    <tbody>
                        {treatments
                            .filter(tr => {
                                const s = searchTerm.toLowerCase();
                                return (
                                    tr.id?.toLowerCase().includes(s) ||
                                    tr.appointment?.animal?.name?.toLowerCase().includes(s) ||
                                    tr.appointment?.client?.dni?.toLowerCase().includes(s) ||
                                    tr.description?.toLowerCase().includes(s) ||
                                    tr.medication?.toLowerCase().includes(s) ||
                                    tr.dosage?.toLowerCase().includes(s)
                                );
                            })
                            .map((tr) => (
                                <tr key={tr.id}>
                                    <td className="col-no">{tr.id.substring(0, 8)}</td>
                                    <td className="col-dni">{tr.appointment?.client?.dni || 'N/A'}</td>
                                    <td className="col-nombre">{tr.appointment?.animal?.name || 'N/A'}</td>
                                    <td className="col-desc"><strong>{tr.description}</strong></td>
                                    <td className="col-med"><strong>{tr.medication}</strong></td>
                                    <td className="col-psol">{tr.dosage}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={3000}
                color="danger"
                position="top"
            />
        </MainLayout>
    );
};

export default ListTreatment;
