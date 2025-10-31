import {
    IonPage,
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonItem
} from "@ionic/react";
import { person, lockClosed, paw } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

const Login: React.FC = () => {
    const history = useHistory();
    const [user, setUser] = useState<string>("");
    const [pass, setPass] = useState<string>("");

    const handleLogin = () => {
        // TODO: conectar con backend (AuthService)
        if (user && pass) {
            history.push("/home");
        }
    };

    return (
        <IonPage>
            <IonContent fullscreen className="login-background">
                <div className="login-container">
                    <IonCard className="login-card">
                        <IonCardContent className="login-card-content">
                            <IonIcon icon={paw} className="login-icon" />
                            <h1 className="login-title">Bienvenido</h1>

                            <IonItem className="login-input">
                                <IonIcon slot="start" icon={person} />
                                <IonInput
                                    label="Usuario"
                                    labelPlacement="floating"
                                    placeholder="ejemplo@correo.com"
                                    type="email"
                                    value={user}
                                    onIonChange={(e) => setUser(e.detail.value!)}
                                />
                            </IonItem>

                            <IonItem className="login-input">
                                <IonIcon slot="start" icon={lockClosed} />
                                <IonInput
                                    label="Contraseña"
                                    labelPlacement="floating"
                                    placeholder="Contraseña"
                                    type="password"
                                    value={pass}
                                    onIonChange={(e) => setPass(e.detail.value!)}
                                />
                            </IonItem>

                            <IonButton expand="block" className="login-button" onClick={handleLogin}>
                                Iniciar sesión
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;