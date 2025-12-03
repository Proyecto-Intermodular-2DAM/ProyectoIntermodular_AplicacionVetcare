import {
    IonPage,
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonItem,
} from "@ionic/react";
import { paw } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import "../theme/Signup.css";

const Signup: React.FC = () => {
    const history = useHistory();
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [dni, setDni] = useState<string>("");
    const [pass, setPass] = useState<string>("");
    const [confirmPass, setConfirmPass] = useState<string>("");

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Formulario de registro enviado:", { name, surname, email, dni, pass, confirmPass });

        if (pass !== confirmPass) {
            alert("Las contraseñas no coinciden");
            return;
        }

        // TODO: conectar con backend (AuthService) para registro
        if (name && surname && email && dni && pass) {
            history.push("/home");
        }
    };

    const handleLogin = () => {
        history.push("/login");
    };

    return (
        <IonPage className="signup-page-background">
            <IonContent fullscreen>
                <div className="signup-center-container">
                    <IonCard className="signup-card">
                        <IonCardContent className="signup-card-content">

                            {/* --- Cabecera con Logo y Login --- */}
                            <header className="signup-header-container">
                                <IonIcon icon={paw} className="signup-icon" />

                                <h1 className="signup-title">Registrarse</h1>

                                <p className="signup-login-text">
                                    Ya tienes una cuenta?
                                    <button
                                        type="button"
                                        onClick={handleLogin}
                                        className="signup-login-button"
                                        aria-label="Sign in to your account"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            </header>

                            {/* --- Formulario --- */}
                            <form onSubmit={handleSignup}>
                                {/* --- Nombre --- */}
                                <IonItem className="signup-input" lines="none">
                                    <IonInput
                                        label="Nombre"
                                        labelPlacement="floating"
                                        placeholder="Nombre"
                                        type="text"
                                        value={name}
                                        onIonChange={(e: any) => setName(e.detail.value!)}
                                        required
                                    />
                                </IonItem>

                                {/* --- Apellidos --- */}
                                <IonItem className="signup-input" lines="none">
                                    <IonInput
                                        label="Apellidos"
                                        labelPlacement="floating"
                                        placeholder="Apellidos"
                                        type="text"
                                        value={surname}
                                        onIonChange={(e: any) => setSurname(e.detail.value!)}
                                        required
                                    />
                                </IonItem>

                                {/* --- Correo --- */}
                                <IonItem className="signup-input" lines="none">
                                    <IonInput
                                        label="Correo"
                                        labelPlacement="floating"
                                        placeholder="Correo"
                                        type="email"
                                        value={email}
                                        onIonChange={(e: any) => setEmail(e.detail.value!)}
                                        required
                                    />
                                </IonItem>

                                {/* --- DNI --- */}
                                <IonItem className="signup-input" lines="none">
                                    <IonInput
                                        label="DNI"
                                        labelPlacement="floating"
                                        placeholder="DNI"
                                        type="text"
                                        value={dni}
                                        onIonChange={(e: any) => setDni(e.detail.value!)}
                                        required
                                    />
                                </IonItem>

                                {/* --- Contraseña --- */}
                                <IonItem className="signup-input" lines="none">
                                    <IonInput
                                        label="Contraseña"
                                        labelPlacement="floating"
                                        placeholder="Contraseña"
                                        type="password"
                                        value={pass}
                                        onIonChange={(e: any) => setPass(e.detail.value!)}
                                        required
                                    />
                                </IonItem>

                                {/* --- Repetir Contraseña --- */}
                                <IonItem className="signup-input" lines="none">
                                    <IonInput
                                        label="Repetir contraseña"
                                        labelPlacement="floating"
                                        placeholder="Repetir contraseña"
                                        type="password"
                                        value={confirmPass}
                                        onIonChange={(e: any) => setConfirmPass(e.detail.value!)}
                                        required
                                    />
                                </IonItem>

                                {/* --- Botón de Registrarse --- */}
                                <IonButton
                                    type="submit"
                                    expand="block"
                                    className="signup-button"
                                    aria-label="Registrarse"
                                >
                                    Registrarse
                                </IonButton>
                            </form>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Signup;