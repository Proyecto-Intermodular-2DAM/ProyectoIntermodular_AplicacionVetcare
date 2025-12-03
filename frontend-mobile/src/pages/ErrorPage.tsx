import React from 'react';
import { IonContent, IonPage, IonButton, IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';
import '../theme/ErrorPage.css';
import { useHistory } from 'react-router-dom';

const ErrorPage: React.FC = () => {
    const history = useHistory();

    return (
        <IonPage>
            <IonContent className="error-page-content" fullscreen>
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

                    <IonButton
                        className="primary-button"
                        expand="block"
                        onClick={() => history.push('/home')}
                    >
                        Volver al menú principal
                    </IonButton>

                    <IonButton
                        className="secondary-button"
                        expand="block"
                        fill="outline"
                        onClick={() => console.log('Contactanos clicked')}
                    >
                        Contactanos
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ErrorPage;
