import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonLoading, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/ListEmployee.css';

const ListAnimal: React.FC = () => {
    const navigate = useNavigate();
    const [animals, setAnimals] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const data = await vetService.getAnimals();
                setAnimals(data || []);
            } catch (err: any) {
                setToastMessage(err.message || 'Error al cargar animales');
                setShowToast(true);
            } finally {
                setLoading(false);
            }
        };
        fetchAnimals();
    }, []);

    if (loading) {
        return <IonLoading isOpen={true} message="Cargando animales..." />;
    }

    return (
        <MainLayout>
            <div className="list-employee-container">
                <div className="list-employee-header">
                    <h1>Listado Animales</h1>
                    <button
                        className="btn-gestion-empleado"
                        onClick={() => navigate('/animales')}
                    >
                        Gestion Animales <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="list-tabs">
                    <div className="tab-item selected">Listado Animales</div>
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
                                placeholder="Buscar animal (Nombre, Especie, Cod, Centro, Estado...)" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <table className="employee-table">
                    <thead>
                        <tr>
                            <th className="col-no">Cod</th>
                            <th className="col-dni">Propietario</th>
                            <th className="col-centro">Codigo Centro</th>
                            <th className="col-nombre">Nombre</th>
                            <th className="col-especie">Especie</th>
                            <th className="col-foto">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {animals
                            .filter(animal => {
                                const s = searchTerm.toLowerCase();
                                return (
                                    animal.name?.toLowerCase().includes(s) ||
                                    animal.species?.toLowerCase().includes(s) ||
                                    `${animal.client?.first_name} ${animal.client?.last_name}`.toLowerCase().includes(s) ||
                                    animal.id?.toLowerCase().includes(s) ||
                                    (animal.center_id || 'global').toLowerCase().includes(s) ||
                                    animal.status?.toLowerCase().includes(s)
                                );
                            })
                            .map((animal) => (
                                <tr key={animal.id}>
                                    <td className="col-no">{animal.id.substring(0, 8)}</td>
                                    <td className="col-dni">{animal.client?.first_name} {animal.client?.last_name}</td>
                                    <td className="col-centro">{animal.center_id || 'Global'}</td>
                                    <td className="col-nombre"><strong>{animal.name}</strong></td>
                                    <td className="col-especie">{animal.species}</td>
                                    <td className="col-foto">{animal.status}</td>
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

export default ListAnimal;
