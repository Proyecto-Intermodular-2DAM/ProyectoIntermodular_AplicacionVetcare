import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonLoading, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/ListEmployee.css';

const ListClients: React.FC = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await vetService.getClients();
                setClients(data || []);
            } catch (err: any) {
                setToastMessage(err.message || 'Error al cargar clientes');
                setShowToast(true);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) return;

        try {
            await vetService.deleteEmployee(id);
            setClients(clients.filter(c => c.id !== id));
            setToastMessage("Cliente eliminado correctamente");
            setShowToast(true);
        } catch (err: any) {
            setToastMessage("Error al eliminar el cliente");
            setShowToast(true);
        }
    };

    if (loading) {
        return <IonLoading isOpen={true} message="Cargando clientes..." />;
    }

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
                            <input 
                                type="text" 
                                placeholder="Buscar cliente (Nombre, DNI, email...)" 
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
                            <th className="col-nombre">Nombre</th>
                            <th className="col-email">Email</th>
                            <th className="col-fecha">Fecha</th>
                            <th className="col-tel">Telefono</th>
                            <th className="col-id">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients
                            .filter(client => {
                                const s = searchTerm.toLowerCase();
                                return (
                                    client.id?.toLowerCase().includes(s) ||
                                    `${client.first_name} ${client.last_name}`.toLowerCase().includes(s) ||
                                    client.dni?.toLowerCase().includes(s) ||
                                    client.email?.toLowerCase().includes(s) ||
                                    new Date(client.created_at).toLocaleDateString().toLowerCase().includes(s) ||
                                    client.phone_number?.toLowerCase().includes(s)
                                );
                            })
                            .map((c) => (
                                <tr key={c.id}>
                                    <td className="col-no">{c.id.substring(0, 8)}</td>
                                    <td className="col-dni">{c.dni}</td>
                                    <td className="col-nombre">{c.first_name} {c.last_name}</td>
                                    <td className="col-email"><strong>{c.email}</strong></td>
                                    <td className="col-fecha"><strong>{new Date(c.created_at).toLocaleDateString()}</strong></td>
                                    <td className="col-tel"><strong>{c.phone_number}</strong></td>
                                    <td className="col-id">
                                        <button 
                                            className="btn-eliminar-small"
                                            onClick={() => handleDelete(c.id)}
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

export default ListClients;
