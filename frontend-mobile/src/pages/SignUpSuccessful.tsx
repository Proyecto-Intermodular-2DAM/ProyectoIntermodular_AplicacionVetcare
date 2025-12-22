import {
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonButton
} from "@ionic/react";
import { paw, checkmarkCircle } from "ionicons/icons";
import "../theme/css/SignUp.css";
import { useNavigate } from "react-router-dom";

const SignUpSuccessful: React.FC = () => {

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
                                <h1 className="login-title">Registro Exitoso</h1>

                                <IonIcon icon={checkmarkCircle} className="signup-success" />

                                <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--color-primary-design)' }}>
                                    Hemos enviado un correo de verificación a tu bandeja de entrada.
                                    Por favor, confirma tu cuenta antes de iniciar sesión.
                                </p>
                            </header>

                            <IonButton expand="block" className="login-button" onClick={goToLogin}>
                                Iniciar Sesión
                            </IonButton>

                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SignUpSuccessful;