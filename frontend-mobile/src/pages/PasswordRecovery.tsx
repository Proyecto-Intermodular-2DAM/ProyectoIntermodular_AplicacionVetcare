import {
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonButton
} from "@ionic/react";
import { paw } from "ionicons/icons";
import "../theme/Login.css";
import { useHistory } from "react-router-dom";

const PasswordRecovery: React.FC = () => {

    const history = useHistory();

    const goToLogin = () => {
        history.push("/login");
    };

    return (
        <IonPage className="login-page-background">
            <IonContent fullscreen>
                <div className="login-center-container">
                    <IonCard className="login-card">
                        <IonCardContent className="login-card-content">
                            
                            <header className="login-header-container">
                                <IonIcon icon={paw} className="login-icon" />
                                <h1 className="login-title">Recuperar contraseña</h1>

                                <p className="login-signup-text">
                                    ¡Listo! Te enviamos un Gmail con el enlace
                                    para restablecer tu contraseña.

                                </p>

                                <p className="login-signup-text">
                                    Revisa tu bandeja de entrada o la carpeta
                                    de spam si no lo ves enseguida.
                                </p>
                            </header>

                            <IonButton expand="block" className="login-button" onClick={goToLogin}>
                                Sign in
                            </IonButton>
                            
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default PasswordRecovery;
