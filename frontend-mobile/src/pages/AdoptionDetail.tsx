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
import { useParams } from 'react-router-dom';
import { defaultAdoptions } from './Adoptions';
import '../theme/css/AdoptionDetail.css';
import TopBar from '../components/TopBar';

const AdoptionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const adoptionItem = defaultAdoptions.find(item => item.id === parseInt(id));

    if (!adoptionItem) {
        return (
            <IonPage>
                <TopBar />
                <IonContent>
                    <div style={{ padding: 20 }}>Adoption not found</div>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <TopBar />
            <IonContent className="adoption-detail-content">
                <img src={adoptionItem.image} alt={adoptionItem.name} className="adoption-detail-image" />

                <div className="adoption-header-row">
                    <h1 className="adoption-name">{adoptionItem.name}</h1>
                    <IonButton className="adopt-button" shape="round">
                        Solicitar<br />Adopción
                    </IonButton>
                </div>

                <div className="adoption-stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">RAZA</span>
                        <span className="stat-value">{adoptionItem.race}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">SEXO</span>
                        <span className="stat-value">{adoptionItem.sex}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">EDAD</span>
                        <span className="stat-value">{adoptionItem.age}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">PESO</span>
                        <span className="stat-value">{adoptionItem.weight}</span>
                    </div>
                </div>

                <div className="adoption-info-section">
                    <h3 className="info-title">Información</h3>
                    <p className="info-text">
                        {adoptionItem.detailedDescription}
                    </p>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default AdoptionDetail;
