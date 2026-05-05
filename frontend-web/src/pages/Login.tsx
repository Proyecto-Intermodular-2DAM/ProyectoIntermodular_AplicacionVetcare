import {
    IonPage,
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonItem,
    IonCheckbox,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonToast,
} from "@ionic/react";
import { person, lockClosed, paw } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../services/authService";
import "../theme/css/Login.css";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [pass, setPass] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);

    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Load saved email on mount
    useState(() => {
        const savedEmail = localStorage.getItem('remembered_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    });

    const validateEmail = (email: string) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const markTouched = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all as touched on submit
        setTouched({ email: true, pass: true });

        if (!validateEmail(email)) {
            setError("Por favor, introduce un email válido");
            setShowToast(true);
            return;
        }

        if (!pass) {
            setError("Por favor, introduce tu contraseña");
            setShowToast(true);
            return;
        }

        // Handle "Remember Me"
        if (rememberMe) {
            localStorage.setItem('remembered_email', email);
        } else {
            localStorage.removeItem('remembered_email');
        }

        setError("");
        setLoading(true);

        try {
            await authService.signIn(email, pass);
            const profile = await authService.getUserProfile();

            if (profile && profile.role === 'Cliente') {
                await authService.signOut();
                setError("Acceso denegado. Los clientes deben usar la aplicación móvil.");
                setShowToast(true);
                setLoading(false);
                return;
            }

            navigate("/home");
        } catch (err: any) {
            setError(err.message || "Error inesperado al iniciar sesión");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = () => {
        navigate("/signup");
    };

    const handleRecoverPassword = () => {

        console.log("Navegar a recuperación de contraseña");
        navigate("/passwordRecovery");
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
                                        Registrarse
                                    </button>
                                </p>
                            </header>

                            {/* --- Formulario --- */}
                            <form onSubmit={handleLogin} noValidate>
                                {/* --- Email --- */}
                                {touched.email && !validateEmail(email) && (
                                    <div className="field-error-message">Email no válido</div>
                                )}
                                <IonItem className={`login-input ${touched.email && !validateEmail(email) ? 'ion-invalid ion-touched' : ''}`} lines="none">
                                    <IonIcon slot="start" icon={person} />
                                    <IonInput
                                        label="Email"
                                        labelPlacement="floating"
                                        placeholder="ejemplo@correo.com"
                                        type="email"
                                        value={email}
                                        onIonInput={(e) => setEmail(e.detail.value ?? '')}
                                        onIonBlur={() => markTouched('email')}
                                        required
                                    />
                                </IonItem>

                                {/* --- Contraseña --- */}
                                {touched.pass && !pass && (
                                    <div className="field-error-message">La contraseña es obligatoria</div>
                                )}
                                <IonItem className={`login-input ${touched.pass && !pass ? 'ion-invalid ion-touched' : ''}`} lines="none">
                                    <IonIcon slot="start" icon={lockClosed} />
                                    <IonInput
                                        label="Contraseña"
                                        labelPlacement="floating"
                                        placeholder="Contraseña"
                                        type="password"
                                        value={pass}
                                        onIonInput={(e) => setPass(e.detail.value ?? '')}
                                        onIonBlur={() => markTouched('pass')}
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
                                    disabled={loading}
                                >
                                    {loading ? <IonSpinner name="crescent" /> : "Sign in"}
                                </IonButton>
                            </form>

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

export default Login;