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
import { medkit, time, calendar, briefcase } from 'ionicons/icons';
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

    const getFrequencyInfo = (treatment: ServiceTreatment) => {
        if (treatment.frequency_hours) return { value: treatment.frequency_hours, unit: 'horas', type: 'hours' as const };
        if (treatment.frequency_days) return { value: treatment.frequency_days, unit: 'días', type: 'days' as const };
        if (treatment.frequency_months) return { value: treatment.frequency_months, unit: 'meses', type: 'months' as const };
        if (treatment.frequency_years) return { value: treatment.frequency_years, unit: 'años', type: 'years' as const };
        return null;
    };

    const calculateSchedule = (createdAt: string, treatment: ServiceTreatment) => {
        const freq = getFrequencyInfo(treatment);
        if (!freq) return 'Horario no definido';

        const start = new Date(createdAt);

        // For hours, show 24h cycle
        if (freq.type === 'hours') {
            const hours = [];
            for (let i = 0; i < 24; i += freq.value) {
                const d = new Date(start.getTime() + i * 3600000);
                hours.push(d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
            }
            return hours.join(', ');
        }

        // For days/months/years, just show the time
        return start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    const calculateNextDose = (createdAt: string, treatment: ServiceTreatment) => {
        const freq = getFrequencyInfo(treatment);
        if (!freq) return 'Pendiente';

        const start = new Date(createdAt);
        const now = new Date();

        let next = new Date(start);

        // Add frequency until we're in the future
        if (freq.type === 'hours') {
            while (next <= now) {
                next.setHours(next.getHours() + freq.value);
            }
        } else if (freq.type === 'days') {
            while (next <= now) {
                next.setDate(next.getDate() + freq.value);
            }
        } else if (freq.type === 'months') {
            while (next <= now) {
                next.setMonth(next.getMonth() + freq.value);
            }
        } else if (freq.type === 'years') {
            while (next <= now) {
                next.setFullYear(next.getFullYear() + freq.value);
            }
        }

        const timeStr = next.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const isToday = next.toDateString() === now.toDateString();

        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const isTomorrow = next.toDateString() === tomorrow.toDateString();

        if (isToday) return `Hoy a las ${timeStr}`;
        if (isTomorrow) return `Mañana a las ${timeStr}`;

        return next.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) + ' a las ' + timeStr;
    };

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
                        treatments: animalTreatments.map((t: ServiceTreatment) => {
                            const freq = getFrequencyInfo(t);
                            return {
                                id: t.id,
                                name: t.medication || t.description || 'Tratamiento',
                                dosage: t.dosage || 'Consultar',
                                frequency: freq ? `Cada ${freq.value} ${freq.unit}` : 'N/A',
                                times: calculateSchedule(t.created_at || t.date || new Date().toISOString(), t),
                                nextDose: calculateNextDose(t.created_at || t.date || new Date().toISOString(), t),
                                instructions: t.description || 'Sin instrucciones adicionales'
                            };
                        })
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
                                            <div className="animal-treatment-card-subtitle">
                                                <IonIcon icon={briefcase} className="animal-treatment-subtitle-icon" />
                                                {treatment.dosage} - {treatment.frequency}
                                            </div>
                                            <div className="animal-treatment-card-subtitle">
                                                <IonIcon icon={time} className="animal-treatment-subtitle-icon" />
                                                {treatment.times}
                                            </div>
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
                                                Instrucciones: {treatment.instructions}
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
