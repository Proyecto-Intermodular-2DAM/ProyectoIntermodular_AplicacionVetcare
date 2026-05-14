import {
    IonPage,
    IonContent,
    IonButton,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonCard,
    IonCardContent,
    IonAvatar,
    IonSpinner,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAnimals } from "../hooks/useVet";
import { useProfile } from "../hooks/useProfile";
import "../theme/css/UserProfile.css";

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { animals: pets, loading: loadingPets } = useAnimals();
    const { profile: publicProfile, loading: loadingProfile, error } = useProfile();

    const loading = loadingPets || loadingProfile;

    // Derived info with fallback
    const userInfo = {
        name: publicProfile?.first_name && publicProfile?.last_name
            ? `${publicProfile.first_name} ${publicProfile.last_name}`
            : `${user?.user_metadata?.name || ''} ${user?.user_metadata?.surname || ''}`.trim() || user?.email || "Usuario de VetCare",
        email: user?.email || "",
        phone: publicProfile?.phone_number || user?.user_metadata?.phone || "",
        dni: publicProfile?.dni || user?.user_metadata?.dni || "",
        profileImage: publicProfile?.user_image || user?.user_metadata?.avatar_url || "https://ionicframework.com/docs/img/demos/avatar.svg"
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleEditProfile = () => {
        navigate("/edit-profile");
    };

    const handlePetClick = (petId: string) => {
        console.log("Navegando a detalles de mascota:", petId);
    };

    return (
        <IonPage className="user-profile-page">
            <IonHeader className="user-profile-header">
                <IonToolbar className="user-profile-toolbar">
                    <IonButtons slot="start">
                        <IonButton onClick={handleGoBack} className="user-profile-back-button">
                            <IonIcon icon={arrowBack} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle className="user-profile-title">Perfil de Usuario</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="user-profile-content">
                <div className="user-profile-container">
                    {/* User Info Section */}
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                            <IonSpinner name="crescent" />
                        </div>
                    ) : (
                        <div className="user-profile-info-section">
                            <div className="user-profile-picture">
                                <img src={userInfo.profileImage} alt={userInfo.name} />
                            </div>
                            <h1 className="user-profile-name">{userInfo.name}</h1>
                            <p className="user-profile-email">{userInfo.email}</p>
                            {userInfo.phone && <p className="user-profile-detail">📞 {userInfo.phone}</p>}
                            {userInfo.dni && <p className="user-profile-detail">🆔 {userInfo.dni}</p>}

                            <IonButton
                                onClick={handleEditProfile}
                                className="user-profile-edit-button"
                                aria-label="Editar Perfil"
                            >
                                Editar Perfil
                            </IonButton>
                        </div>
                    )}

                    {/* Pets Section */}
                    <div className="user-profile-pets-section">
                        <h2 className="user-profile-pets-title">Mis Mascotas</h2>

                        {error && !publicProfile && (
                            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--ion-color-danger)' }}>
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="user-profile-pets-list">
                            {pets?.map((pet) => (
                                <IonCard
                                    key={pet.id}
                                    className="user-profile-pet-card"
                                    onClick={() => handlePetClick(pet.id)}
                                    button
                                >
                                    <IonCardContent className="user-profile-pet-card-content">
                                        <IonAvatar className="user-profile-pet-avatar">
                                            <img src={pet.animal_image || pet.avatar || "https://ionicframework.com/docs/img/demos/avatar.svg"} alt={pet.name} />
                                        </IonAvatar>
                                        <div className="user-profile-pet-info">
                                            <h3 className="user-profile-pet-name">{pet.name}</h3>
                                            <p className="user-profile-pet-breed">{pet.breed || pet.species}</p>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            ))}
                            {!loading && pets?.length === 0 && (
                                <p style={{ textAlign: 'center', color: 'var(--ion-color-medium)' }}>No tienes mascotas registradas.</p>
                            )}
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default UserProfile;
