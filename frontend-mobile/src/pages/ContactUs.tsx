import {
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
} from "@ionic/react";
import { paw, mailOutline, callOutline } from "ionicons/icons";
import "../theme/css/ContactUs.css";
import { useHistory } from "react-router-dom";

const ContactUs: React.FC = () => {

    const history = useHistory();

    return (
        <IonPage className="login-page-background">
            <IonContent fullscreen>
                <div className="login-center-container">
                    <IonCard className="login-card">
                        <IonCardContent className="login-card-content">
                            
                            <header className="login-header-container">
                                <h1 className="login-title">Contactanos</h1>
                                <IonIcon icon={paw} className="login-icon" />


                            <IonCard  className="cards">
                                <IonIcon icon={mailOutline} className="card-icon" />
                                vetcare2000@gmail.com
                            </IonCard>

                            <IonCard  className="cards">
                                <IonIcon icon={callOutline} className="card-icon" />
                                +34 666 66 66 66
                            </IonCard>
                            </header>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ContactUs;