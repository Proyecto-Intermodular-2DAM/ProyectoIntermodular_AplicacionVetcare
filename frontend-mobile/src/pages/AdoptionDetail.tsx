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

const AdoptionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [adoptionItem, setAdoptionItem] = React.useState<any | null>(null);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchAnimal = async () => {
            if (!id) return;
            try {
                const animal = await vetService.getAnimalById(parseInt(id));
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
                    src={adoptionItem.image_url || adoptionItem.avatar || 'https://ionicframework.com/docs/img/demos/card-media.png'}
                    alt={adoptionItem.name}
                    className="adoption-detail-image"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://ionicframework.com/docs/img/demos/card-media.png';
                    }}
                />

                <div className="adoption-header-row">
                    <h1 className="adoption-name">{adoptionItem.name}</h1>
                    <IonButton className="adopt-button" shape="round">
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
                        <span className="stat-label">NACIMIENTO</span>
                        <span className="stat-value">{adoptionItem.birth_date || 'Unknown'}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">PESO</span>
                        <span className="stat-value">{adoptionItem.weight ? `${adoptionItem.weight}kg` : 'Unknown'}</span>
                    </div>
                </div>

                <div className="adoption-info-section">
                    <h3 className="info-title">Información</h3>
                    <p className="info-text">
                        {adoptionItem.description || "No description available."}
                    </p>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default AdoptionDetail;
