import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonLoading, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/ListEmployee.css';

const ListRooms: React.FC = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await vetService.getRooms();
                setRooms(data || []);
            } catch (err: any) {
                setToastMessage(err.message || 'Error al cargar salas');
                setShowToast(true);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    if (loading) {
        return <IonLoading isOpen={true} message="Cargando salas..." />;
    }

    return (
        <MainLayout>
            <div className="list-employee-container">
                <div className="list-employee-header">
                    <h1>Listado Salas</h1>
                    <button
                        className="btn-gestion-empleado"
                        onClick={() => navigate('/salas')}
                    >
                        Gestion Salas <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="list-tabs">
                    <div className="tab-item selected">Listado Salas</div>
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
                                placeholder="Buscar sala (Nombre...)" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <table className="employee-table">
                    <thead>
                        <tr>
                            <th className="col-nombre">Nombre</th>
                            <th className="col-centro">Codigo Centro</th>
                            <th className="col-dni">Tamaño (m²)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms
                            .filter(room => 
                                room.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                room.center_code?.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((room, index) => (
                                <tr key={index}>
                                    <td className="col-nombre">{room.name}</td>
                                    <td className="col-centro">{room.center_code}</td>
                                    <td className="col-dni">{room.size_m2} m²</td>
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

export default ListRooms;
