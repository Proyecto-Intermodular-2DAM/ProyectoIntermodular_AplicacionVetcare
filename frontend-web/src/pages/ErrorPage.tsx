import React from 'react';
import { IonContent, IonPage, IonButton, IonIcon, IonCard } from '@ionic/react';
import { close } from 'ionicons/icons';
import '../theme/css/ErrorPage.css';
import '../theme/css/Login.css';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <IonPage className="error-page-background">
            <IonContent fullscreen>
                <div className="error-center-container">
                    <IonCard className="error-card">
                        <div className="error-page-container">
                            <div className="dead-face-icon">
                                <div className="eyes-container">
                                    <IonIcon icon={close} className="eye-cross" />
                                    <IonIcon icon={close} className="eye-cross" />
                                </div>
                                <div className="mouth-line"></div>
                            </div>

                            <h1 className="error-page-title">Ha habido un error...</h1>

                            <p className="error-page-message">
                                La página a la que estás intentando entrar no está disponible.
                                Vuelve a intentarlo o vuelve al menú principal.
                            </p>

                            <div className="error-actions">
                                <IonButton
                                    className="contact-button"
                                    fill="outline"
                                    onClick={() => console.log('Contactanos clicked')}
                                >
                                    Contactanos
                                </IonButton>

                                <IonButton
                                    className="home-button"
                                    onClick={() => navigate('/home')}
                                >
                                    Volver al menú principal
                                </IonButton>
                            </div>
                        </div>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ErrorPage;
