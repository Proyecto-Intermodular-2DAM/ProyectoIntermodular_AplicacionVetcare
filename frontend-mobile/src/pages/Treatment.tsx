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
import { arrowForward, medkit } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import TopBar from '../components/TopBar';
import SideMenu from '../components/SideMenu';
import { useAnimals, useTreatments } from '../hooks/useVet';
import '../theme/css/Treatment.css';

const Treatment: React.FC = () => {
    const navigate = useNavigate();
    const { animals: myAnimals, loading: loadingAnimals, error: errorAnimals } = useAnimals();
    const { treatments: myTreatments, loading: loadingTreatments, error: errorTreatments } = useTreatments();

    const loading = loadingAnimals || loadingTreatments;
    const error = errorAnimals || errorTreatments;

    const animalsWithCount = useMemo(() => {
        if (!myAnimals || !myTreatments) return [];

        return myAnimals.map(animal => {
            const animalTreatments = myTreatments.filter(t => t.animal_id === animal.id);
            return {
                ...animal,
                activeTreatments: animalTreatments.length
            };
        });
    }, [myAnimals, myTreatments]);

    const totalAnimals = animalsWithCount.length;
    const animalsInTreatment = animalsWithCount.filter(animal => animal.activeTreatments > 0).length;

    const handleAnimalClick = (animalId: string) => {
        navigate(`/animal-treatment/${animalId}`);
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
                                        <div className="treatment-stat-value">{loading ? '...' : totalAnimals}</div>
                                    </div>
                                    <div className="treatment-stat-divider"></div>
                                    <div className="treatment-stat">
                                        <div className="treatment-stat-label">En tratamiento</div>
                                        <div className="treatment-stat-value">{loading ? '...' : animalsInTreatment}</div>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </div>

                        {/* Animals List */}
                        <div className="treatment-list">
                            {loading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                    <IonSpinner name="crescent" />
                                </div>
                            ) : error ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ion-color-danger)' }}>
                                    <p>{error}</p>
                                </div>
                            ) : animalsWithCount.length > 0 ? (
                                animalsWithCount.map((animal) => (
                                    <IonCard
                                        key={animal.id}
                                        className="treatment-card"
                                        button
                                        onClick={() => handleAnimalClick(animal.id)}
                                    >
                                        <IonCardContent className="treatment-card-content">
                                            <div className="treatment-card-left">
                                                <IonAvatar className="treatment-avatar">
                                                    <img src={animal.animal_image || animal.avatar || "https://ionicframework.com/docs/img/demos/avatar.svg"} alt={animal.name} />
                                                </IonAvatar>
                                                <div className="treatment-info">
                                                    <h2 className="treatment-name">{animal.name}</h2>
                                                    <p className="treatment-breed">{animal.breed || animal.species}</p>
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
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ion-color-medium)' }}>
                                    <p>No tienes mascotas registradas.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </IonContent>
            </IonPage>
        </>
    );
};

export default Treatment;
