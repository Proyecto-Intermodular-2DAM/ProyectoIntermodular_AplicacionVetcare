import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonLoading, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/ListEmployee.css';

const ListAdoption: React.FC = () => {
    const navigate = useNavigate();
    const [adoptions, setAdoptions] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const fetchAdoptions = async () => {
            try {
                const data = await vetService.getAdoptionHistory();
                setAdoptions(data || []);
            } catch (err: any) {
                setToastMessage(err.message || 'Error al cargar historial');
                setShowToast(true);
            } finally {
                setLoading(false);
            }
        };
        fetchAdoptions();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este registro de adopción?")) return;

        try {
            await vetService.deleteAdoption(id);
            setAdoptions(adoptions.filter(ad => ad.id !== id));
            setToastMessage("Registro de adopción eliminado correctamente");
            setShowToast(true);
        } catch (err: any) {
            setToastMessage("Error al eliminar el registro");
            setShowToast(true);
        }
    };

    if (loading) {
        return <IonLoading isOpen={true} message="Cargando historial..." />;
    }

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
                            <input 
                                type="text" 
                                placeholder="Buscar adopción (Animal, DNI...)" 
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
                            <th className="col-id-animal">Id Animal</th>
                            <th className="col-fecha">Fecha</th>
                            <th className="col-comentario">Comentario</th>
                            <th className="col-id">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adoptions
                            .filter(ad => {
                                const s = searchTerm.toLowerCase();
                                return (
                                    ad.id?.toLowerCase().includes(s) ||
                                    ad.animal?.name?.toLowerCase().includes(s) ||
                                    ad.client?.dni?.toLowerCase().includes(s) ||
                                    ad.animal_id?.toLowerCase().includes(s) ||
                                    new Date(ad.adoption_date).toLocaleDateString().toLowerCase().includes(s) ||
                                    ad.comments?.toLowerCase().includes(s)
                                );
                            })
                            .map((ad) => (
                                <tr key={ad.id}>
                                    <td className="col-no">{ad.id.substring(0, 8)}</td>
                                    <td className="col-dni">{ad.client?.dni || 'N/A'}</td>
                                    <td className="col-nombre">{ad.animal?.name || 'N/A'}</td>
                                    <td className="col-id-animal"><strong>{ad.animal_id.substring(0, 8)}</strong></td>
                                    <td className="col-fecha"><strong>{new Date(ad.adoption_date).toLocaleDateString()}</strong></td>
                                    <td className="col-comentario">{ad.comments}</td>
                                    <td className="col-id">
                                        <button 
                                            className="btn-eliminar-small"
                                            onClick={() => handleDelete(ad.id)}
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

export default ListAdoption;
