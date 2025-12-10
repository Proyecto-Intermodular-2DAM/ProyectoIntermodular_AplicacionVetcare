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
import { useHistory } from "react-router-dom";
import { useState } from "react";
import "../theme/css/EditProfile.css";

const EditProfile: React.FC = () => {
    const history = useHistory();
    const [name, setName] = useState<string>("Melissa Paters");
    const [email, setEmail] = useState<string>("melpeters@gmail.com");
    const [password, setPassword] = useState<string>("••••••••••••");
    const [profileImage, setProfileImage] = useState<string>("");

    const handleGoBack = () => {
        history.goBack();
    };

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Guardando cambios:", { name, email, password });
        // TODO: conectar con backend para actualizar perfil
        alert("Cambios guardados exitosamente");
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
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
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

                        {/* Email Field */}
                        <div className="edit-profile-field">
                            <label className="edit-profile-label">Email</label>
                            <IonItem className="edit-profile-input" lines="none">
                                <IonInput
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onIonChange={(e: any) => setEmail(e.detail.value!)}
                                    required
                                />
                            </IonItem>
                        </div>

                        {/* Password Field */}
                        <div className="edit-profile-field">
                            <label className="edit-profile-label">Contraseña</label>
                            <IonItem className="edit-profile-input" lines="none">
                                <IonInput
                                    placeholder="Contraseña"
                                    type="password"
                                    value={password}
                                    onIonChange={(e: any) => setPassword(e.detail.value!)}
                                    required
                                />
                            </IonItem>
                        </div>

                        {/* Save Button */}
                        <IonButton
                            type="submit"
                            expand="block"
                            className="edit-profile-save-button"
                            aria-label="Guardar cambios"
                        >
                            Guardar cambios
                        </IonButton>
                    </form>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default EditProfile;
