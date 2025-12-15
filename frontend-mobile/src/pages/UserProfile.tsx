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
import { useHistory } from "react-router-dom";
import "../theme/css/UserProfile.css";

interface Pet {
    id: number;
    name: string;
    breed: string;
    image: string;
}

const UserProfile: React.FC = () => {
    const history = useHistory();

    // Mock user data
    const user = {
        name: "Melissa Peters",
        email: "melpeters@gmail.com",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    };

    // Mock pets data
    const pets: Pet[] = [
        {
            id: 1,
            name: "Max",
            breed: "Golden Retriever",
            image: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=200&h=200&fit=crop"
        },
        {
            id: 2,
            name: "Peluso",
            breed: "Gato Siamés",
            image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop"
        }
    ];

    const handleGoBack = () => {
        history.goBack();
    };

    const handleEditProfile = () => {
        history.push("/edit-profile");
    };

    const handlePetClick = (petId: number) => {
        console.log("Navegando a detalles de mascota:", petId);
        // TODO: Navegar a página de detalles de mascota
        // history.push(`/pet-details/${petId}`);
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
                            <img src={user.profileImage} alt={user.name} />
                        </div>
                        <h1 className="user-profile-name">{user.name}</h1>
                        <p className="user-profile-email">{user.email}</p>

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
                                            <img src={pet.image} alt={pet.name} />
                                        </IonAvatar>
                                        <div className="user-profile-pet-info">
                                            <h3 className="user-profile-pet-name">{pet.name}</h3>
                                            <p className="user-profile-pet-breed">{pet.breed}</p>
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
