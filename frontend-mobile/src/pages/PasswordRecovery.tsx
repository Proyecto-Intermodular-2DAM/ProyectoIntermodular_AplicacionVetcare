import {
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonButton,
    IonInput,
    IonItem,
    IonSpinner,
    IonToast,
} from "@ionic/react";
import { paw } from "ionicons/icons";
import { useState } from "react";
import { authService } from "../services/authService";
import "../theme/css/Login.css";
import { useNavigate } from "react-router-dom";

const PasswordRecovery: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);

    const handlePasswordRecovery = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email) {
            setError("Por favor, ingresa tu correo electrónico");
            setShowToast(true);
            setLoading(false);
            return;
        }

        try {
            const { error: authError } = await authService.resetPassword(email);

            if (authError) {
                setError(authError.message || "Error al enviar el correo de recuperación");
                setShowToast(true);
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError("Error inesperado al enviar el correo");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

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
                                <h1 className="login-title">Recuperar contraseña</h1>

                                {!success ? (
                                    <p className="login-signup-text">
                                        Ingresa tu correo electrónico y te enviaremos
                                        un enlace para restablecer tu contraseña.
                                    </p>
                                ) : (
                                    <>
                                        <p className="login-signup-text">
                                            ¡Listo! Te enviamos un correo con el enlace
                                            para restablecer tu contraseña.
                                        </p>
                                        <p className="login-signup-text">
                                            Revisa tu bandeja de entrada o la carpeta
                                            de spam si no lo ves enseguida.
                                        </p>
                                    </>
                                )}
                            </header>

                            {!success && (
                                <form onSubmit={handlePasswordRecovery}>
                                    <IonItem className="login-input" lines="none">
                                        <IonInput
                                            label="Email"
                                            labelPlacement="floating"
                                            placeholder="ejemplo@correo.com"
                                            type="email"
                                            value={email}
                                            onIonChange={(e: CustomEvent) => setEmail(e.detail.value ?? '')}
                                            required
                                        />
                                    </IonItem>

                                    <IonButton
                                        type="submit"
                                        expand="block"
                                        className="login-button"
                                        disabled={loading}
                                    >
                                        {loading ? <IonSpinner name="crescent" /> : "Enviar enlace"}
                                    </IonButton>
                                </form>
                            )}

                            <IonButton
                                expand="block"
                                className="login-button"
                                onClick={goToLogin}
                                fill={success ? "solid" : "outline"}
                            >
                                {success ? "Ir a Sign in" : "Volver a Sign in"}
                            </IonButton>

                            {/* Toast for error messages */}
                            <IonToast
                                isOpen={showToast}
                                onDidDismiss={() => setShowToast(false)}
                                message={error}
                                duration={3000}
                                color="danger"
                                position="top"
                            />

                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default PasswordRecovery;