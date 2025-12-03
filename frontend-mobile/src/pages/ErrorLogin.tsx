import React from 'react';
import { IonContent, IonPage, IonButton, IonIcon } from '@ionic/react';
import { paw, closeOutline } from 'ionicons/icons';
import '../theme/ErrorLogin.css';
import { useHistory } from 'react-router-dom';

const ErrorLogin: React.FC = () => {
    const history = useHistory();

    return (
        <IonPage>
            <IonContent className="error-login-page" fullscreen>
                <div className="error-login-container">
                    <div className="error-card">
                        <IonIcon icon={paw} className="paw-icon" />
                        <h1 className="error-title">Error al registrar</h1>
                        <p className="error-message">
                            Ha habido un error al registrar el usuario,
                            <br />
                            vuelve a intentarlo mas tarde.
                        </p>

                        <div className="error-icon-container">
                            <div className="error-circle">
                                <IonIcon icon={closeOutline} className="close-icon" />
                            </div>
                        </div>

                        <IonButton
                            className="sign-in-button"
                            expand="block"
                            onClick={() => history.push('/login')}
                        >
                            Sign in
                        </IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ErrorLogin;
