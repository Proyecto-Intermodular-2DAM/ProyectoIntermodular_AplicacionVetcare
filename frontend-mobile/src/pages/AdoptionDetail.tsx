import React from 'react';
import {
    IonContent,
    IonPage,
    IonButtons,
    IonBackButton,
    IonButton,
    IonHeader,
    IonToolbar
} from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/AdoptionDetail.css';
import TopBar from '../components/TopBar';

const calculateAge = (birthDate: string) => {
    if (!birthDate) return 'Desconocida';
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
        age--;
    }

    if (age < 1) {
        const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
        return months <= 1 ? '1 mes' : `${months} meses`;
    }

    return age === 1 ? '1 año' : `${age} años`;
};

const AdoptionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [adoptionItem, setAdoptionItem] = React.useState<any | null>(null);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchAnimal = async () => {
            if (!id) return;
            try {
                const animal = await vetService.getAnimalById(id);
                console.log("[Diagnostic] Fetched Animal for detail:", animal);
                setAdoptionItem(animal);
            } catch (error) {
                console.error("Error fetching animal details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimal();
    }, [id]);

    if (loading) {
        return (
            <IonPage>
                <TopBar />
                <IonContent className="ion-padding">
                    <div>Loading...</div>
                </IonContent>
            </IonPage>
        );
    }

    if (!adoptionItem) {
        return (
            <IonPage>
                <TopBar />
                <IonContent>
                    <div style={{ padding: 20 }}>Adoption not found</div>
                    <IonButton onClick={() => navigate('/adoptions')}>Back to Adoptions</IonButton>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <TopBar />
            <IonContent className="adoption-detail-content">
                <img
                    src={adoptionItem.animal_image || adoptionItem.image_url || adoptionItem.avatar || 'https://ionicframework.com/docs/img/demos/card-media.png'}
                    alt={adoptionItem.name}
                    className="adoption-detail-image"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://ionicframework.com/docs/img/demos/card-media.png';
                    }}
                />

                <div className="adoption-header-row">
                    <h1 className="adoption-name">{adoptionItem.name}</h1>
                    <IonButton
                        className="adopt-button"
                        shape="round"
                        onClick={() => navigate('/contactUs')}
                    >
                        Solicitar<br />Adopción
                    </IonButton>
                </div>

                <div className="adoption-stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">RAZA</span>
                        <span className="stat-value">{adoptionItem.breed || 'Unknown'}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">SEXO</span>
                        <span className="stat-value">{adoptionItem.sex || 'Unknown'}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">EDAD</span>
                        <span className="stat-value">{calculateAge(adoptionItem.birth_date)}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">PESO</span>
                        <span className="stat-value">{adoptionItem.weight ? `${adoptionItem.weight}kg` : 'Unknown'}</span>
                    </div>
                </div>

                <div className="adoption-info-section">
                    <h3 className="info-title">Información</h3>
                    <p className="info-text">
                        {adoptionItem.information || adoptionItem.description || "No hay información adicional disponible."}
                    </p>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default AdoptionDetail;
