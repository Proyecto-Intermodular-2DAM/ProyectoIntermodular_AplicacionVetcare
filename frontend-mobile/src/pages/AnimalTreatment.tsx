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
import { medkit, time, calendar } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import SideMenu from '../components/SideMenu';
import '../theme/css/AnimalTreatment.css';

interface Treatment {
    id: number;
    name: string;
    dosage: string;
    frequency: string;
    times: string;
    nextDose: string;
    instructions: string;
}

interface Animal {
    id: number;
    name: string;
    breed: string;
    image: string;
    activeTreatments: number;
    treatments: Treatment[];
}

const AnimalTreatment: React.FC = () => {
    const { animalId } = useParams<{ animalId: string }>();

    // Mock data for animals and their treatments
    const animals: Animal[] = [
        {
            id: 1,
            name: 'Max',
            breed: 'Golden Retriever',
            image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=200&h=200&fit=crop',
            activeTreatments: 1,
            treatments: [
                {
                    id: 1,
                    name: 'Antibiótico Amoxicilina',
                    dosage: '250 mg - Cada 12 horas',
                    frequency: 'Cada 12 horas',
                    times: '08:00, 20:00',
                    nextDose: 'Hoy a las 20:00',
                    instructions: 'Administrar con comida. No suspender el tratamiento antes de tiempo.',
                },
            ],
        },
        {
            id: 2,
            name: 'Peluso',
            breed: 'Siames',
            image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop',
            activeTreatments: 0,
            treatments: [],
        },
    ];

    const animal = animals.find(a => a.id === parseInt(animalId || '1'));

    if (!animal) {
        return (
            <>
                <SideMenu />
                <IonPage id="main-content">
                    <TopBar />
                    <IonContent>
                        <div className="animal-treatment-error">
                            <p>Animal no encontrado</p>
                        </div>
                    </IonContent>
                </IonPage>
            </>
        );
    }

    return (
        <>
            <SideMenu />
            <IonPage id="main-content">
                <TopBar />
                <IonContent fullscreen className="animal-treatment-content">
                    <div className="animal-treatment-container">
                        {/* Header Section with Animal Info */}
                        <div className="animal-treatment-header">
                            <div className="animal-treatment-header-content">
                                <IonAvatar className="animal-treatment-avatar">
                                    <img src={animal.image} alt={animal.name} />
                                </IonAvatar>
                                <div className="animal-treatment-header-info">
                                    <h1 className="animal-treatment-name">{animal.name}</h1>
                                    <p className="animal-treatment-breed">{animal.breed}</p>
                                </div>
                            </div>

                            {/* Active Treatments Card */}
                            <IonCard className="animal-treatment-active-card">
                                <IonCardContent className="animal-treatment-active-content">
                                    <div className="animal-treatment-active-label">Tratamientos activos</div>
                                    <div className="animal-treatment-active-value">{animal.activeTreatments}</div>
                                </IonCardContent>
                            </IonCard>
                        </div>

                        {/* Treatments List */}
                        <div className="animal-treatment-list">
                            {animal.treatments.length > 0 ? (
                                animal.treatments.map((treatment) => (
                                    <IonCard key={treatment.id} className="animal-treatment-card">
                                        <IonCardHeader className="animal-treatment-card-header">
                                            <div className="animal-treatment-card-title-row">
                                                <IonIcon icon={medkit} className="animal-treatment-card-icon" />
                                                <IonCardTitle className="animal-treatment-card-title">
                                                    {treatment.name}
                                                </IonCardTitle>
                                            </div>
                                            <IonCardSubtitle className="animal-treatment-card-subtitle">
                                                <IonIcon icon={medkit} className="animal-treatment-subtitle-icon" />
                                                {treatment.dosage}
                                            </IonCardSubtitle>
                                            <IonCardSubtitle className="animal-treatment-card-subtitle">
                                                <IonIcon icon={time} className="animal-treatment-subtitle-icon" />
                                                {treatment.times}
                                            </IonCardSubtitle>
                                        </IonCardHeader>

                                        <IonCardContent className="animal-treatment-card-content">
                                            {/* Next Dose Alert */}
                                            <div className="animal-treatment-next-dose">
                                                <IonIcon icon={calendar} className="animal-treatment-next-dose-icon" />
                                                <span className="animal-treatment-next-dose-text">
                                                    Próxima dosis: {treatment.nextDose}
                                                </span>
                                            </div>

                                            {/* Instructions */}
                                            <div className="animal-treatment-instructions">
                                                <strong>Instrucciones:</strong> {treatment.instructions}
                                            </div>
                                        </IonCardContent>
                                    </IonCard>
                                ))
                            ) : (
                                <div className="animal-treatment-no-treatments">
                                    <IonIcon icon={medkit} className="animal-treatment-no-treatments-icon" />
                                    <p className="animal-treatment-no-treatments-text">
                                        No hay tratamientos activos para {animal.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </IonContent>
            </IonPage>
        </>
    );
};

export default AnimalTreatment;
