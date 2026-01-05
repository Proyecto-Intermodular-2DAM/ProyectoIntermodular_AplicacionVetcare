import React from 'react';
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
    IonSpinner,
} from '@ionic/react';
import { medkit, time, calendar } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import SideMenu from '../components/SideMenu';
import { vetService, Animal as ServiceAnimal, Treatment as ServiceTreatment } from '../services/vetService';
import '../theme/css/AnimalTreatment.css';

interface Treatment {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    times: string;
    nextDose: string;
    instructions: string;
}

interface Animal {
    id: string;
    name: string;
    breed: string;
    image: string;
    activeTreatments: number;
    treatments: Treatment[];
}

const AnimalTreatment: React.FC = () => {
    const { animalId } = useParams<{ animalId: string }>();
    const [animal, setAnimal] = React.useState<Animal | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAnimalAndTreatments = async () => {
            if (!animalId) return;
            try {
                const animals = await vetService.getMyAnimals();
                const treatments = await vetService.getMyTreatments();

                console.log("[Diagnostic] All user animals:", animals);
                console.log("[Diagnostic] All user treatments:", treatments);

                const foundAnimal = animals.find((a: ServiceAnimal) => a.id === animalId);
                if (foundAnimal) {
                    const animalTreatments = treatments.filter((t: ServiceTreatment) => t.animal_id === animalId);
                    setAnimal({
                        id: foundAnimal.id,
                        name: foundAnimal.name,
                        breed: foundAnimal.breed || (foundAnimal as any).species || 'Desconocida',
                        image: foundAnimal.animal_image || (foundAnimal as any).avatar || "https://ionicframework.com/docs/img/demos/avatar.svg",
                        activeTreatments: animalTreatments.length,
                        treatments: animalTreatments.map((t: ServiceTreatment) => ({
                            id: t.id,
                            name: t.medication || t.description || 'Tratamiento',
                            dosage: t.dosage || 'Consultar',
                            frequency: 'N/A',
                            times: 'Ver detalles',
                            nextDose: t.date || 'Pendiente',
                            instructions: t.description || 'Sin instrucciones adicionales'
                        }))
                    });
                }
            } catch (error) {
                console.error("Error fetching animal treatments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimalAndTreatments();
    }, [animalId]);

    console.log("AnimalID Params:", animalId);
    console.log("Current Animal State:", animal);

    if (loading) {
        return (
            <>
                <SideMenu />
                <IonPage id="main-content">
                    <TopBar />
                    <IonContent>
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            <IonSpinner name="crescent" />
                        </div>
                    </IonContent>
                </IonPage>
            </>
        );
    }

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
