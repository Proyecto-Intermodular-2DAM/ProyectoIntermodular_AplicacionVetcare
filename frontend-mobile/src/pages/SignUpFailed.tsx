import {
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonButton
} from "@ionic/react";
import { paw, closeCircle } from "ionicons/icons";
import "../theme/css/SignUp.css";
import { useNavigate } from "react-router-dom";

const SignUpFailed: React.FC = () => {

    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login");
    };

    return (
        <IonPage className="login-page-background">
            <IonContent fullscreen>
                <div className="login-center-container">
                    <IonCard className="login-card">
                        <IonCardContent className="login-card-content">

                            <header className="login-header-container">
                                <IonIcon icon={paw} className="login-icon" />
                                <h1 className="login-title">Error al Registrarse</h1>

                                <p className="login-signup-text">
                                    Ha habido un error al registrar el usuario,
                                    vuelve a intentarlo más tarde.
                                </p>

                                <IonIcon icon={closeCircle} className="signup-failed" />
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

export default SignUpFailed;