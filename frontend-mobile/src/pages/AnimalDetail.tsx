import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import "../theme/css/AnimalDetail.css";

const AnimalDetail: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAdopt = () => {
    navigate("/contactUs");
  };

  return (
    <IonPage className="animal-detail-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleGoBack}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Vetcare</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="animal-detail-container">

          {/* Imagen */}
          <div className="animal-image-container">
            <img
              src="https://images.unsplash.com/photo-1558788353-f76d92427f16"
              alt="Toby"
            />
          </div>

          {/* Nombre + botón */}
          <div className="animal-header">
            <h2 className="animal-name">Toby</h2>
            <IonButton
              className="adopt-button"
              shape="round"
              onClick={handleAdopt}
            >
              Solicitar Adopción
            </IonButton>
          </div>

          {/* Chips de información */}
          <div className="animal-info-chips">
            <IonChip>
              <IonLabel>
                <strong>RAZA</strong><br />
                Golden Retriever
              </IonLabel>
            </IonChip>

            <IonChip>
              <IonLabel>
                <strong>SEXO</strong><br />
                Masculino
              </IonLabel>
            </IonChip>

            <IonChip>
              <IonLabel>
                <strong>EDAD</strong><br />
                2 años
              </IonLabel>
            </IonChip>

            <IonChip>
              <IonLabel>
                <strong>PESO</strong><br />
                10 KG
              </IonLabel>
            </IonChip>
          </div>

          {/* Información */}
          <div className="animal-description">
            <h3>Información</h3>
            <p>
              Toby es un perro que encontraron abandonado en la carretera cuando nació.
              Es muy cariñoso y busca una familia que lo quiera y que lo trate con cariño.
            </p>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default AnimalDetail;
