import {
    IonPage,
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    IonItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
} from "@ionic/react";
import { arrowBack, camera } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import "../theme/css/EditProfile.css";

const EditProfile: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [dni, setDni] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [profileImage, setProfileImage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Load initial data
    useState(() => {
        if (user) {
            setName(user.user_metadata?.name || user.user_metadata?.first_name || "");
            setSurname(user.user_metadata?.surname || user.user_metadata?.last_name || "");
            setEmail(user.email || "");
            setPhone(user.user_metadata?.phone || user.user_metadata?.phone_number || "");
            setDni(user.user_metadata?.dni || "");
            setProfileImage(user.user_metadata?.avatar_url || user.user_metadata?.user_image || "");
        }
    });

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const updates: any = {
            name,
            surname,
            phone,
            dni,
            avatar_url: profileImage
        };

        if (password && password.trim() !== "") {
            updates.password = password;
        }

        const { error } = await authService.updateProfile(updates);
        setLoading(false);

        if (error) {
            alert("Error al actualizar perfil: " + error.message);
        } else {
            alert("Cambios guardados exitosamente");
            navigate(-1);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <IonPage className="edit-profile-page">
            <IonHeader className="edit-profile-header">
                <IonToolbar className="edit-profile-toolbar">
                    <IonButtons slot="start">
                        <IonButton onClick={handleGoBack} className="edit-profile-back-button">
                            <IonIcon icon={arrowBack} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle className="edit-profile-title">Editar Perfil</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="edit-profile-content">
                <div className="edit-profile-container">
                    <form onSubmit={handleSaveChanges}>
                        {/* Profile Picture */}
                        <div className="edit-profile-picture-container">
                            <div className="edit-profile-picture">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" />
                                ) : (
                                    <div className="edit-profile-picture-placeholder">
                                        <img
                                            src="https://ionicframework.com/docs/img/demos/avatar.svg"
                                            alt="Profile placeholder"
                                        />
                                    </div>
                                )}
                                <label htmlFor="profile-upload" className="edit-profile-camera-button">
                                    <IonIcon icon={camera} />
                                </label>
                                <input
                                    id="profile-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: "none" }}
                                />
                            </div>
                        </div>

                        {/* Name Field */}
                        <div className="edit-profile-field">
                            <label className="edit-profile-label">Nombre</label>
                            <IonItem className="edit-profile-input" lines="none">
                                <IonInput
                                    placeholder="Nombre"
                                    type="text"
                                    value={name}
                                    onIonChange={(e: any) => setName(e.detail.value!)}
                                    required
                                />
                            </IonItem>
                        </div>

                        {/* Surname Field */}
                        <div className="edit-profile-field">
                            <label className="edit-profile-label">Apellidos</label>
                            <IonItem className="edit-profile-input" lines="none">
                                <IonInput
                                    placeholder="Apellidos"
                                    type="text"
                                    value={surname}
                                    onIonChange={(e: any) => setSurname(e.detail.value!)}
                                    required
                                />
                            </IonItem>
                        </div>

                        {/* Phone Field */}
                        <div className="edit-profile-field">
                            <label className="edit-profile-label">Teléfono</label>
                            <IonItem className="edit-profile-input" lines="none">
                                <IonInput
                                    placeholder="Teléfono"
                                    type="tel"
                                    value={phone}
                                    onIonChange={(e: any) => setPhone(e.detail.value!)}
                                    required
                                />
                            </IonItem>
                        </div>

                        {/* DNI Field */}
                        <div className="edit-profile-field">
                            <label className="edit-profile-label">DNI</label>
                            <IonItem className="edit-profile-input" lines="none">
                                <IonInput
                                    placeholder="DNI"
                                    type="text"
                                    value={dni}
                                    onIonChange={(e: any) => setDni(e.detail.value!)}
                                    required
                                />
                            </IonItem>
                        </div>

                        {/* Email Field */}
                        <div className="edit-profile-field">
                            <label className="edit-profile-label">Email</label>
                            <IonItem className="edit-profile-input" lines="none">
                                <IonInput
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    readonly // Email usually shouldn't be changed easily in basic profile edit
                                />
                            </IonItem>
                        </div>

                        {/* Password Field */}
                        <div className="edit-profile-field">
                            <label className="edit-profile-label">Nueva Contraseña (Opcional)</label>
                            <IonItem className="edit-profile-input" lines="none">
                                <IonInput
                                    placeholder="Dejar en blanco para mantener"
                                    type="password"
                                    value={password}
                                    onIonChange={(e: any) => setPassword(e.detail.value!)}
                                />
                            </IonItem>
                        </div>

                        {/* Save Button */}
                        <IonButton
                            type="submit"
                            expand="block"
                            className="edit-profile-save-button"
                            aria-label="Guardar cambios"
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar cambios"}
                        </IonButton>
                    </form>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default EditProfile;
