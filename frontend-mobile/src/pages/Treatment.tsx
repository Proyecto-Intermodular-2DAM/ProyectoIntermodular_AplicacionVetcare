import {
    IonPage,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonAvatar,
    IonIcon,
} from '@ionic/react';
import { arrowForward, medkit } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import TopBar from '../components/TopBar';
import SideMenu from '../components/SideMenu';
import '../theme/css/Treatment.css';

interface Animal {
    id: number;
    name: string;
    breed: string;
    image: string;
    activeTreatments: number;
}

const Treatment: React.FC = () => {
    const history = useHistory();
    // Mock data for animals
    const animals: Animal[] = [
        {
            id: 1,
            name: 'Max',
            breed: 'Golden Retriever',
            image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=200&h=200&fit=crop',
            activeTreatments: 2,
        },
        {
            id: 2,
            name: 'Peluso',
            breed: 'Siames',
            image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop',
            activeTreatments: 0,
        },
    ];

    const totalAnimals = animals.length;
    const animalsInTreatment = animals.filter(animal => animal.activeTreatments > 0).length;

    const handleAnimalClick = (animalId: number) => {
        history.push(`/animal-treatment/${animalId}`);
    };

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <TopBar />
                <IonContent fullscreen className="treatment-content">
                    <div className="treatment-container">
                        {/* Header Section */}
                        <div className="treatment-header">
                            <h1 className="treatment-title">Mis Mascotas</h1>
                            <p className="treatment-subtitle">
                                Selecciona una mascota para ver su tratamiento
                            </p>

                            {/* Stats Card */}
                            <IonCard className="treatment-stats-card">
                                <IonCardContent className="treatment-stats-content">
                                    <div className="treatment-stat">
                                        <div className="treatment-stat-label">Total mascotas</div>
                                        <div className="treatment-stat-value">{totalAnimals}</div>
                                    </div>
                                    <div className="treatment-stat-divider"></div>
                                    <div className="treatment-stat">
                                        <div className="treatment-stat-label">En tratamiento</div>
                                        <div className="treatment-stat-value">{animalsInTreatment}</div>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </div>

                        {/* Animals List */}
                        <div className="treatment-list">
                            {animals.map((animal) => (
                                <IonCard
                                    key={animal.id}
                                    className="treatment-card"
                                    button
                                    onClick={() => handleAnimalClick(animal.id)}
                                >
                                    <IonCardContent className="treatment-card-content">
                                        <div className="treatment-card-left">
                                            <IonAvatar className="treatment-avatar">
                                                <img src={animal.image} alt={animal.name} />
                                            </IonAvatar>
                                            <div className="treatment-info">
                                                <h2 className="treatment-name">{animal.name}</h2>
                                                <p className="treatment-breed">{animal.breed}</p>
                                            </div>
                                        </div>
                                        <div className="treatment-card-right">
                                            {animal.activeTreatments > 0 ? (
                                                <div className="treatment-treatments">
                                                    <IonIcon icon={medkit} className="treatment-treatment-icon" />
                                                    <span className="treatment-treatment-text">
                                                        {animal.activeTreatments} Tratamientos activos
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="treatment-no-treatments">
                                                    Sin tratamientos activos
                                                </div>
                                            )}
                                            <IonIcon icon={arrowForward} className="treatment-arrow-icon" />
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            ))}
                        </div>
                    </div>
                </IonContent>
            </IonPage>
        </>
    );
};

export default Treatment;
