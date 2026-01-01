import React from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../theme/css/ListEmployee.css'; // Reusing common list styles

const ListAnimal: React.FC = () => {
    const navigate = useNavigate();

    const animals = [
        { cod: 1, dniCli: '12334566 B', codCentro: '1', nombre: 'Anakin', especie: 'Gato', foto: '' },
        { cod: 2, dniCli: '12334566 C', codCentro: '2', nombre: 'Mustio', especie: 'Perro', foto: '' },
        { cod: 3, dniCli: '12334566 D', codCentro: '3', nombre: 'Pelusa', especie: 'Gato', foto: '' },
        { cod: 4, dniCli: '12334566 E', codCentro: '1', nombre: 'Bola', especie: 'Pajaro', foto: '' },
        { cod: 5, dniCli: '12334566 Q', codCentro: '2', nombre: 'Camilo', especie: 'Lagarto', foto: '' },
    ];

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
                            <input type="text" placeholder="Buscar la cita (Ctrl + G)" />
                        </div>
                        <button className="btn-eliminar-empleado">
                            Eliminar Animal <IonIcon icon={chevronForwardOutline} />
                        </button>
                    </div>
                </div>

                <table className="employee-table">
                    <thead>
                        <tr>
                            <th className="col-no">Cod</th>
                            <th className="col-dni">DNI Cliente</th>
                            <th className="col-centro">Codigo Centro</th>
                            <th className="col-nombre">Nombre</th>
                            <th className="col-especie">Especie</th>
                            <th className="col-foto">Foto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {animals.map((animal) => (
                            <tr key={animal.cod}>
                                <td className="col-no">{animal.cod}</td>
                                <td className="col-dni">{animal.dniCli}</td>
                                <td className="col-centro">{animal.codCentro}</td>
                                <td className="col-nombre"><strong>{animal.nombre}</strong></td>
                                <td className="col-especie">{animal.especie}</td>
                                <td className="col-foto">{animal.foto}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
};

export default ListAnimal;
