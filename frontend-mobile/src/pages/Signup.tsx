import {
    IonPage,
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonItem,
    IonSpinner,
    IonToast,
} from "@ionic/react";
import { paw } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../services/authService";
import "../theme/css/Signup.css";

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [dni, setDni] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [pass, setPass] = useState<string>("");
    const [confirmPass, setConfirmPass] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);

    // Validation states
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const markTouched = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const validateEmail = (email: string) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const validateDNI = (dni: string) => {
        const regex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
        if (!regex.test(dni)) return false;
        const lookup = "TRWAGMYFPDXBNJZSQVHLCKE";
        const number = parseInt(dni.substring(0, 8), 10);
        const letter = dni.charAt(8).toUpperCase();
        return lookup.charAt(number % 23) === letter;
    };

    const validatePassword = (password: string) => {
        // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Mark all fields as touched
        const allTouched: Record<string, boolean> = {
            name: true, surname: true, email: true, dni: true, phone: true, pass: true, confirmPass: true
        };
        setTouched(allTouched);

        // Validation
        if (!name || !surname || !email || !dni || !phone || !pass || !confirmPass) {
            setError("Por favor, completa todos los campos obligatorios");
            setShowToast(true);
            return;
        }

        if (!validateEmail(email)) {
            setError("Por favor, introduce un email válido");
            setShowToast(true);
            return;
        }

        if (!validateDNI(dni)) {
            setError("El DNI introducido no es válido");
            setShowToast(true);
            return;
        }

        if (!validatePassword(pass)) {
            setError("La contraseña no cumple con los requisitos de seguridad");
            setShowToast(true);
            return;
        }

        if (pass !== confirmPass) {
            setError("Las contraseñas no coinciden. Por favor, asegúrate de que coinciden.");
            setShowToast(true);
            return;
        }

        setLoading(true);

        try {
            const { error: authError } = await authService.signUp({
                email,
                password: pass,
                name,
                surname,
                dni,
                phone,
            });

            if (authError) {
                setError(authError.message || "Error al registrarse");
                setShowToast(true);
                return;
            }

            navigate("/signUpSuccessful");
        } catch (err) {
            setError("Error inesperado al registrarse");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        navigate("/login");
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
                                        Iniciar sesión
                                    </button>
                                </p>
                            </header>

                            {/* --- Formulario --- */}
                            <form onSubmit={handleSignup} noValidate>
                                {/* --- Nombre --- */}
                                {touched.name && !name && (
                                    <div className="field-error-message">El nombre es obligatorio</div>
                                )}
                                <IonItem className={`signup-input ${touched.name && !name ? 'ion-invalid ion-touched' : ''}`} lines="none">
                                    <IonInput
                                        label="Nombre"
                                        labelPlacement="floating"
                                        placeholder="Nombre"
                                        type="text"
                                        value={name}
                                        onIonInput={(e: any) => setName(e.detail.value!)}
                                        onIonBlur={() => markTouched('name')}
                                        required
                                    />
                                </IonItem>

                                {/* --- Apellidos --- */}
                                {touched.surname && !surname && (
                                    <div className="field-error-message">Los apellidos son obligatorios</div>
                                )}
                                <IonItem className={`signup-input ${touched.surname && !surname ? 'ion-invalid ion-touched' : ''}`} lines="none">
                                    <IonInput
                                        label="Apellidos"
                                        labelPlacement="floating"
                                        placeholder="Apellidos"
                                        type="text"
                                        value={surname}
                                        onIonInput={(e: any) => setSurname(e.detail.value!)}
                                        onIonBlur={() => markTouched('surname')}
                                        required
                                    />
                                </IonItem>

                                {/* --- Correo --- */}
                                {touched.email && !validateEmail(email) && (
                                    <div className="field-error-message">Introduce un correo válido</div>
                                )}
                                <IonItem className={`signup-input ${touched.email && !validateEmail(email) ? 'ion-invalid ion-touched' : ''}`} lines="none">
                                    <IonInput
                                        label="Correo"
                                        labelPlacement="floating"
                                        placeholder="Correo"
                                        type="email"
                                        value={email}
                                        onIonInput={(e: any) => setEmail(e.detail.value!)}
                                        onIonBlur={() => markTouched('email')}
                                        required
                                    />
                                </IonItem>

                                {/* --- DNI --- */}
                                {touched.dni && !validateDNI(dni) && (
                                    <div className="field-error-message">DNI no válido (8 números y letra)</div>
                                )}
                                <IonItem className={`signup-input ${touched.dni && !validateDNI(dni) ? 'ion-invalid ion-touched' : ''}`} lines="none">
                                    <IonInput
                                        label="DNI"
                                        labelPlacement="floating"
                                        placeholder="12345678X"
                                        type="text"
                                        value={dni}
                                        onIonInput={(e: any) => setDni(e.detail.value!)}
                                        onIonBlur={() => markTouched('dni')}
                                        required
                                    />
                                </IonItem>

                                {/* --- Número de Teléfono --- */}
                                {touched.phone && !phone && (
                                    <div className="field-error-message">El teléfono es obligatorio</div>
                                )}
                                <IonItem className={`signup-input ${touched.phone && !phone ? 'ion-invalid ion-touched' : ''}`} lines="none">
                                    <IonInput
                                        label="Número de teléfono"
                                        labelPlacement="floating"
                                        placeholder="Número de teléfono"
                                        type="tel"
                                        value={phone}
                                        onIonInput={(e: any) => setPhone(e.detail.value!)}
                                        onIonBlur={() => markTouched('phone')}
                                        required
                                    />
                                </IonItem>

                                {/* --- Contraseña --- */}
                                {touched.pass && !validatePassword(pass) && (
                                    <div className="field-error-message">
                                        Min 8 caracteres, A/a, 123 y @$!%*?&
                                    </div>
                                )}
                                <IonItem className={`signup-input ${touched.pass && !validatePassword(pass) ? 'ion-invalid ion-touched' : ''}`} lines="none">
                                    <IonInput
                                        label="Contraseña"
                                        labelPlacement="floating"
                                        placeholder="Contraseña"
                                        type="password"
                                        value={pass}
                                        onIonInput={(e: any) => setPass(e.detail.value!)}
                                        onIonBlur={() => markTouched('pass')}
                                        required
                                    />
                                </IonItem>

                                {/* --- Repetir Contraseña --- */}
                                {touched.confirmPass && confirmPass !== pass && (
                                    <div className="field-error-message">Las contraseñas no coinciden</div>
                                )}
                                <IonItem className={`signup-input ${touched.confirmPass && (confirmPass !== pass) ? 'ion-invalid ion-touched' : ''}`} lines="none">
                                    <IonInput
                                        label="Repetir contraseña"
                                        labelPlacement="floating"
                                        placeholder="Repetir contraseña"
                                        type="password"
                                        value={confirmPass}
                                        onIonInput={(e: any) => setConfirmPass(e.detail.value!)}
                                        onIonBlur={() => markTouched('confirmPass')}
                                        required
                                    />
                                </IonItem>

                                {/* --- Botón de Registrarse --- */}
                                <IonButton
                                    type="submit"
                                    expand="block"
                                    className="signup-button"
                                    aria-label="Registrarse"
                                    disabled={loading}
                                >
                                    {loading ? <IonSpinner name="crescent" /> : "Registrarse"}
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

export default Signup;