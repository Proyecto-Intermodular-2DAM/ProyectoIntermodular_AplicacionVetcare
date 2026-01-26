import React from 'react';
import {
    IonContent,
    IonPage,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonSpinner
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { useAdoptionAnimals } from '../hooks/useVet';
import '../theme/css/Adoptions.css';
import TopBar from '../components/TopBar';

const Adoptions: React.FC = () => {
    const navigate = useNavigate();
    const { animals: adoptions, loading, error } = useAdoptionAnimals();

    return (
        <IonPage>
            <TopBar />
            <IonContent fullscreen>
                <div className="adoptions-container">
                    <div className="adoptions-header">
                        <span>{adoptions?.length || 0} {adoptions?.length === 1 ? 'Pet' : 'Pets'} Available</span>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            <IonSpinner name="crescent" />
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ion-color-danger)' }}>
                            <p>{error}</p>
                        </div>
                    ) : adoptions && adoptions.length > 0 ? (
                        adoptions.map((item) => (
                            <IonCard
                                key={item.id}
                                className="adoption-card"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    if (document.activeElement instanceof HTMLElement) {
                                        document.activeElement.blur();
                                    }
                                    navigate(`/adoption-detail/${item.id}`);
                                }}
                            >
                                <div className="card-image-container">
                                    <img
                                        alt={item.name}
                                        src={item.animal_image || item.avatar || 'https://ionicframework.com/docs/img/demos/card-media.png'}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://ionicframework.com/docs/img/demos/card-media.png';
                                        }}
                                    />
                                </div>
                                <IonCardHeader>
                                    <IonCardSubtitle className="adoption-date">{item.breed || item.species || 'Unknown Breed'}</IonCardSubtitle>
                                    <IonCardTitle className="adoption-title">Adopta a {item.name}</IonCardTitle>
                                </IonCardHeader>

                                <IonCardContent className="adoption-content">
                                    {item.information || item.description || `Conoce a ${item.name}, busca un hogar lleno de amor.`}
                                    <br />
                                    <span className="read-more-link">Leer más</span>
                                </IonCardContent>
                            </IonCard>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ion-color-medium)' }}>
                            <p>No hay mascotas disponibles para adopción en este momento.</p>
                        </div>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Adoptions;
