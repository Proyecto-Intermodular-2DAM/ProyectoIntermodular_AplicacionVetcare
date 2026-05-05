import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonLoading, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/ListEmployee.css';

const ListDate: React.FC = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const fetchAppointments = async () => {
        try {
            const data = await vetService.getAppointments();
            setAppointments(data || []);
        } catch (err: any) {
            setToastMessage(err.message || 'Error al cargar citas');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;
        try {
            await vetService.deleteAppointment(id);
            setAppointments(appointments.filter(apt => apt.id !== id));
            setToastMessage('Cita eliminada correctamente');
            setShowToast(true);
        } catch (err: any) {
            setToastMessage(err.message || 'Error al eliminar cita');
            setShowToast(true);
        }
    };

    if (loading) {
        return <IonLoading isOpen={true} message="Cargando citas..." />;
    }

    return (
        <MainLayout>
            <div className="list-employee-container">
                <div className="list-employee-header">
                    <h1>Listado Citas</h1>
                    <button
                        className="btn-gestion-empleado"
                        onClick={() => navigate('/date')}
                    >
                        Nueva Cita <IonIcon icon={chevronForwardOutline} />
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
                            <input 
                                type="text" 
                                placeholder="Buscar cita (Animal, cliente...)" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <table className="employee-table">
                    <thead>
                        <tr>
                            <th className="col-id">ID</th>
                            <th className="col-animal">Animal</th>
                            <th className="col-fecha">Fecha</th>
                            <th className="col-hora">Hora</th>
                            <th className="col-veterinario">Cliente</th>
                            <th className="col-estado">Estado</th>
                            <th className="col-id">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments
                            .filter(apt => {
                                const s = searchTerm.toLowerCase();
                                return (
                                    apt.id?.toLowerCase().includes(s) ||
                                    apt.animal?.name?.toLowerCase().includes(s) ||
                                    `${apt.client?.first_name} ${apt.client?.last_name}`.toLowerCase().includes(s) ||
                                    apt.status?.toLowerCase().includes(s) ||
                                    new Date(apt.appointment_date).toLocaleDateString().toLowerCase().includes(s) ||
                                    apt.appointment_time?.toLowerCase().includes(s)
                                );
                            })
                            .map((apt) => (
                                <tr key={apt.id}>
                                    <td className="col-id">{apt.id.substring(0, 8)}</td>
                                    <td className="col-animal">{apt.animal?.name || 'N/A'}</td>
                                    <td className="col-fecha">{new Date(apt.appointment_date).toLocaleDateString()}</td>
                                    <td className="col-hora">{apt.appointment_time}</td>
                                    <td className="col-veterinario">{apt.client ? `${apt.client.first_name} ${apt.client.last_name}` : 'N/A'}</td>
                                    <td className="col-estado">
                                        <span className={`status-badge ${apt.status?.toLowerCase()}`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td className="col-id">
                                        <button 
                                            className="btn-eliminar-small"
                                            onClick={() => handleDelete(apt.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
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
                color={toastMessage.includes("correctamente") ? "success" : "danger"}
                position="top"
            />
        </MainLayout>
    );
};

export default ListDate;
