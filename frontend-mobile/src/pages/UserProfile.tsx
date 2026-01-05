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
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { vetService, Animal } from "../services/vetService";
import { authService } from "../services/authService";
import { useEffect, useState } from "react";
import "../theme/css/UserProfile.css";

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [pets, setPets] = useState<Animal[]>([]);
    const [publicProfile, setPublicProfile] = useState<any>(null);

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Public Profile and Pets in parallel
                const [profile, petsData] = await Promise.all([
                    authService.getPublicUserProfile(),
                    vetService.getMyAnimals()
                ]);

                setPublicProfile(profile);
                setPets(petsData);

            } catch (error) {
                console.error("Error fetching UserProfile data:", error);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

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

                    {/* Pets Section */}
                    <div className="user-profile-pets-section">
                        <h2 className="user-profile-pets-title">Mis Mascotas</h2>

                        <div className="user-profile-pets-list">
                            {pets.map((pet) => (
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
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default UserProfile;
