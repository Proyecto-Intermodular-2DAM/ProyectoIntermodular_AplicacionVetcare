import {
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonButton
} from "@ionic/react";
import { paw, checkmarkCircle } from "ionicons/icons";
import "../theme/SignUp.css";
import { useHistory } from "react-router-dom";

const SignUpSuccessful: React.FC = () => {

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
                                <h1 className="login-title">Registro Exitoso</h1>

                                <IonIcon icon={checkmarkCircle} className="signup-success" />
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

export default SignUpSuccessful;