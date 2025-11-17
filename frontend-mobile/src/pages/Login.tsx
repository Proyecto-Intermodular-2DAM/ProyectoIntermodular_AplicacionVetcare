import {
    IonPage,
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonItem,
    IonCheckbox, // Nuevo componente
    IonLabel, // Nuevo componente
    IonGrid, // Nuevo componente
    IonRow, // Nuevo componente
    IonCol, // Nuevo componente
} from "@ionic/react";
import { person, lockClosed, paw } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import "../theme/Login.css";

// Importa el logo si lo necesitas. Usaremos 'paw' por ahora como icono.
// import vector from "./vector.svg"; 

const Login: React.FC = () => {
    const history = useHistory();
    const [email, setEmail] = useState<string>(""); // Cambiado de 'user' a 'email'
    const [pass, setPass] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false); // Nuevo estado

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        console.log("Formulario enviado:", { email, pass, rememberMe });

        // TODO: conectar con backend (AuthService)
        if (email && pass) {
            history.push("/home");
        }
    };

    const handleSignUp = () => {
        console.log("Navegar a Sign up");
        // history.push("/signup"); // Ejemplo de navegación
    };

    const handleRecoverPassword = () => {
        console.log("Navegar a recuperación de contraseña");
        // history.push("/recover-password"); // Ejemplo de navegación
    };

    return (
        <IonPage className="login-page-background">
            <IonContent fullscreen>
                <div className="login-center-container">
                    <IonCard className="login-card">
                        <IonCardContent className="login-card-content">

                            {/* --- Cabecera con Logo y Registro --- */}
                            <header className="login-header-container">
                                <IonIcon icon={paw} className="login-icon" />

                                <h1 className="login-title">Iniciar Sesión</h1>

                                <p className="login-signup-text">
                                    No tienes una cuenta?
                                    <button
                                        type="button"
                                        onClick={handleSignUp}
                                        className="login-signup-button"
                                        aria-label="Sign up for a new account"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            </header>

                            {/* --- Formulario --- */}
                            <form onSubmit={handleLogin}>
                                {/* --- Email --- */}
                                <IonItem className="login-input" lines="none">
                                    <IonIcon slot="start" icon={person} />
                                    <IonInput
                                        label="Email"
                                        labelPlacement="floating"
                                        placeholder="ejemplo@correo.com"
                                        type="email"
                                        value={email}
                                        onIonChange={(e) => setEmail(e.detail.value!)}
                                        required
                                    />
                                </IonItem>

                                {/* --- Contraseña --- */}
                                <IonItem className="login-input" lines="none">
                                    <IonIcon slot="start" icon={lockClosed} />
                                    <IonInput
                                        label="Contraseña"
                                        labelPlacement="floating"
                                        placeholder="Contraseña"
                                        type="password"
                                        value={pass}
                                        onIonChange={(e) => setPass(e.detail.value!)}
                                        required
                                    />
                                </IonItem>

                                {/* --- Recordarme y Recuperar Contraseña --- */}
                                <IonGrid className="ion-no-padding login-options-grid">
                                    <IonRow className="ion-align-items-center">
                                        <IonCol size="6">
                                            <IonItem lines="none" className="ion-no-padding login-remember-me">
                                                <IonCheckbox
                                                    checked={rememberMe}
                                                    onIonChange={(e) => setRememberMe(e.detail.checked)}
                                                    labelPlacement="end"
                                                    aria-label="Recordarme"
                                                    color="primary"
                                                >
                                                    <IonLabel className="login-label">
                                                        Recordarme
                                                    </IonLabel>
                                                </IonCheckbox>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="6" className="ion-text-right">
                                            <IonButton
                                                onClick={handleRecoverPassword}
                                                fill="clear"
                                                color="primary"
                                                size="small"
                                                className="ion-no-padding login-recover-password-button"
                                                aria-label="Recuperar contraseña"
                                            >
                                                Recuperar contraseña
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>

                                {/* --- Botón de Sign in --- */}
                                <IonButton
                                    type="submit"
                                    expand="block"
                                    className="login-button"
                                    aria-label="Sign in"
                                >
                                    Sign in
                                </IonButton>
                            </form>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;