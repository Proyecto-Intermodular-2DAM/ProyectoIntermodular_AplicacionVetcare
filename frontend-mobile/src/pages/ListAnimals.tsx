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
import TopBar from '../components/TopBar';
import SideMenu from '../components/SideMenu';
import '../theme/css/ListAnimals.css';

interface Animal {
    id: number;
    name: string;
    breed: string;
    image: string;
    activeTreatments: number;
}

const ListAnimals: React.FC = () => {
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
        console.log('Navegando a detalles de animal:', animalId);
        // TODO: Navigate to animal details page
    };

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <TopBar />
                <IonContent fullscreen className="list-animals-content">
                    <div className="list-animals-container">
                        {/* Header Section */}
                        <div className="list-animals-header">
                            <h1 className="list-animals-title">Mis Mascotas</h1>
                            <p className="list-animals-subtitle">
                                Selecciona una mascota para ver su tratamiento
                            </p>

                            {/* Stats Card */}
                            <IonCard className="list-animals-stats-card">
                                <IonCardContent className="list-animals-stats-content">
                                    <div className="list-animals-stat">
                                        <div className="list-animals-stat-label">Total mascotas</div>
                                        <div className="list-animals-stat-value">{totalAnimals}</div>
                                    </div>
                                    <div className="list-animals-stat-divider"></div>
                                    <div className="list-animals-stat">
                                        <div className="list-animals-stat-label">En tratamiento</div>
                                        <div className="list-animals-stat-value">{animalsInTreatment}</div>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </div>

                        {/* Animals List */}
                        <div className="list-animals-list">
                            {animals.map((animal) => (
                                <IonCard
                                    key={animal.id}
                                    className="list-animals-card"
                                    button
                                    onClick={() => handleAnimalClick(animal.id)}
                                >
                                    <IonCardContent className="list-animals-card-content">
                                        <div className="list-animals-card-left">
                                            <IonAvatar className="list-animals-avatar">
                                                <img src={animal.image} alt={animal.name} />
                                            </IonAvatar>
                                            <div className="list-animals-info">
                                                <h2 className="list-animals-name">{animal.name}</h2>
                                                <p className="list-animals-breed">{animal.breed}</p>
                                            </div>
                                        </div>
                                        <div className="list-animals-card-right">
                                            {animal.activeTreatments > 0 ? (
                                                <div className="list-animals-treatments">
                                                    <IonIcon icon={medkit} className="list-animals-treatment-icon" />
                                                    <span className="list-animals-treatment-text">
                                                        {animal.activeTreatments} Tratamientos activos
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="list-animals-no-treatments">
                                                    Sin tratamientos activos
                                                </div>
                                            )}
                                            <IonIcon icon={arrowForward} className="list-animals-arrow-icon" />
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

export default ListAnimals;
