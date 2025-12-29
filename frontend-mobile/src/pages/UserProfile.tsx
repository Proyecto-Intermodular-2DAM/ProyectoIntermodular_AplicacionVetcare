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
import { useEffect, useState } from "react";
import "../theme/css/UserProfile.css";

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [pets, setPets] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);

    // Derived user info from Auth Metadata
    const userInfo = {
        name: `${user?.user_metadata?.name || ''} ${user?.user_metadata?.surname || ''}`.trim() || user?.email || "Usuario de VetCare",
        email: user?.email || "",
        profileImage: user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    };

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const data = await vetService.getMyAnimals();
                setPets(data);
            } catch (error) {
                console.error("Error fetching pets:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPets();
        }
    }, [user]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleEditProfile = () => {
        navigate("/edit-profile");
    };

    const handlePetClick = (petId: number) => {
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
                                            <img src={pet.avatar || "https://ionicframework.com/docs/img/demos/avatar.svg"} alt={pet.name} />
                                        </IonAvatar>
                                        <div className="user-profile-pet-info">
                                            <h3 className="user-profile-pet-name">{pet.name}</h3>
                                            <p className="user-profile-pet-breed">{pet.breed || pet.type}</p>
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
