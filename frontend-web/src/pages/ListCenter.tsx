import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonLoading, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/ListEmployee.css';

const ListCenter: React.FC = () => {
    const navigate = useNavigate();
    const [centers, setCenters] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const fetchCenters = async () => {
            try {
                const data = await vetService.getCenters();
                setCenters(data || []);
            } catch (err: any) {
                setToastMessage(err.message || 'Error al cargar centros');
                setShowToast(true);
            } finally {
                setLoading(false);
            }
        };
        fetchCenters();
    }, []);

    if (loading) {
        return <IonLoading isOpen={true} message="Cargando centros..." />;
    }

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
                            <input 
                                type="text" 
                                placeholder="Buscar centro (Nombre, dirección...)" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
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
                        {centers
                            .filter(center => {
                                const s = searchTerm.toLowerCase();
                                return (
                                    center.id?.toLowerCase().includes(s) ||
                                    center.name?.toLowerCase().includes(s) ||
                                    center.address?.toLowerCase().includes(s) ||
                                    center.postcode?.toLowerCase().includes(s)
                                );
                            })
                            .map((center) => (
                                <tr key={center.id}>
                                    <td className="col-no">{center.id.substring(0, 8)}</td>
                                    <td className="col-dni">{center.name}</td>
                                    <td className="col-nombre">{center.postcode}</td>
                                    <td className="col-sueldo">{center.address}</td>
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

export default ListCenter;
