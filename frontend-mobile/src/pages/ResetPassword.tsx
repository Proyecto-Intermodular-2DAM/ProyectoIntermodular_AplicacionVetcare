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
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "../theme/css/Login.css";
import { useNavigate } from "react-router-dom";

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Check if we have a valid session (user clicked the reset link)
        supabase.auth.onAuthStateChange((event: string) => {
            if (event === "PASSWORD_RECOVERY") {
                // User is in password recovery mode
                console.log("Password recovery mode activated");
            }
        });
    }, []);

    const markTouched = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const validatePassword = (password: string) => {
        // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Mark all as touched
        setTouched({ newPassword: true, confirmPassword: true });

        // Validation
        if (!newPassword || !confirmPassword) {
            setError("Por favor, completa todos los campos obligatorios");
            setShowToast(true);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            setShowToast(true);
            return;
        }

        if (!validatePassword(newPassword)) {
            setError("La contraseña no cumple con los requisitos de seguridad");
            setShowToast(true);
            return;
        }

        setLoading(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) {
                setError(updateError.message || "Error al actualizar la contraseña");
                setShowToast(true);
            } else {
                setSuccess(true);
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (err) {
            setError("Error inesperado al actualizar la contraseña");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <IonPage className="login-page-background">
            <IonContent fullscreen>
                <div className="login-center-container">
                    <IonCard className="login-card">
                        <IonCardContent className="login-card-content">

                            <header className="login-header-container">
                                <IonIcon icon={paw} className="login-icon" />
                                <h1 className="login-title">Restablecer contraseña</h1>

                                {!success ? (
                                    <p className="login-signup-text">
                                        Ingresa tu nueva contraseña
                                    </p>
                                ) : (
                                    <p className="login-signup-text">
                                        ¡Contraseña actualizada con éxito!
                                        Redirigiendo al inicio de sesión...
                                    </p>
                                )}
                            </header>

                            {!success && (
                                <form onSubmit={handleResetPassword}>
                                    {/* --- Nueva contraseña --- */}
                                    {touched.newPassword && !validatePassword(newPassword) && (
                                        <div className="field-error-message">
                                            Min 8 caracteres, A/a, 123 y @$!%*?&
                                        </div>
                                    )}
                                    <IonItem className={`login-input ${touched.newPassword && !validatePassword(newPassword) ? 'ion-invalid ion-touched' : ''}`} lines="none">
                                        <IonInput
                                            label="Nueva contraseña"
                                            labelPlacement="floating"
                                            placeholder="Nueva contraseña"
                                            type="password"
                                            value={newPassword}
                                            onIonInput={(e) => setNewPassword(e.detail.value ?? '')}
                                            onIonBlur={() => markTouched('newPassword')}
                                            required
                                        />
                                    </IonItem>

                                    {/* --- Confirmar contraseña --- */}
                                    {touched.confirmPassword && (confirmPassword !== newPassword) && (
                                        <div className="field-error-message">Las contraseñas no coinciden</div>
                                    )}
                                    <IonItem className={`login-input ${touched.confirmPassword && (confirmPassword !== newPassword) ? 'ion-invalid ion-touched' : ''}`} lines="none">
                                        <IonInput
                                            label="Confirmar contraseña"
                                            labelPlacement="floating"
                                            placeholder="Confirmar contraseña"
                                            type="password"
                                            value={confirmPassword}
                                            onIonInput={(e) => setConfirmPassword(e.detail.value ?? '')}
                                            onIonBlur={() => markTouched('confirmPassword')}
                                            required
                                        />
                                    </IonItem>

                                    <IonButton
                                        type="submit"
                                        expand="block"
                                        className="login-button"
                                        disabled={loading}
                                    >
                                        {loading ? <IonSpinner name="crescent" /> : "Actualizar contraseña"}
                                    </IonButton>
                                </form>
                            )}

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

export default ResetPassword;
