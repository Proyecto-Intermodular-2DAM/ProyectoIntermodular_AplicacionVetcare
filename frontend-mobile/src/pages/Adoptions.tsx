import React from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButtons,
    IonBackButton
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import '../theme/css/Adoptions.css';
import TopBar from '../components/TopBar';

export interface AdoptionItem {
    id: number;
    image: string;
    date: string;
    title: string;
    description: string;
    name: string;
    race: string;
    sex: string;
    age: string;
    weight: string;
    detailedDescription: string;
}

export const defaultAdoptions: AdoptionItem[] = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Golden Retriever placeholder
        date: 'October 12, 2024',
        title: 'Adopta a Toby',
        description: 'Toby es un perro que encontraron abandonado...',
        name: 'Toby',
        race: 'Golden Retriever',
        sex: 'Masculino',
        age: '2 años',
        weight: '10KG',
        detailedDescription: 'Toby es un perro que encontraron abandonado en la carretera cuando nació. Es muy cariñoso y busca una familia que lo quiera y que lo traten con cariño.'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        date: 'October 12, 2024',
        title: 'Adopta a Luna',
        description: 'Luna es una perita muy alegra...',
        name: 'Luna',
        race: 'Beagle',
        sex: 'Femenino',
        age: '1 año',
        weight: '8KG',
        detailedDescription: 'Luna es una perrita muy alegre y juguetona. Le encanta correr por el parque y jugar con otros perros.'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        date: 'October 12, 2024',
        title: 'Adopta a Rocky',
        description: 'Rocky es un perro guardián...',
        name: 'Rocky',
        race: 'Bulldog',
        sex: 'Masculino',
        age: '3 años',
        weight: '15KG',
        detailedDescription: 'Rocky es un perro tranquilo y leal. Prefiere los paseos cortos y descansar en el sofá.'
    }
];

const Adoptions: React.FC = () => {
    const history = useHistory();

    return (
        <IonPage>
            <TopBar />
            <IonContent fullscreen>
                <div className="adoptions-container">
                    <div className="adoptions-header">
                        <span>{defaultAdoptions.length} Articles</span>
                        <span className="filter-text">Filter v</span>
                    </div>
                    <h2 className="sort-by-title">Sort by</h2>

                    {defaultAdoptions.map((item) => (
                        <IonCard
                            key={item.id}
                            className="adoption-card"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                if (document.activeElement instanceof HTMLElement) {
                                    document.activeElement.blur();
                                }
                                history.push(`/adoption-detail/${item.id}`);
                            }}
                        >
                            <div className="card-image-container">
                                <img alt={item.title} src={item.image} />
                            </div>
                            <IonCardHeader>
                                <IonCardSubtitle className="adoption-date">{item.date}</IonCardSubtitle>
                                <IonCardTitle className="adoption-title">{item.title}</IonCardTitle>
                            </IonCardHeader>

                            <IonCardContent className="adoption-content">
                                {item.description}
                                <br />
                                <span className="read-more-link">Read more</span>
                            </IonCardContent>
                        </IonCard>
                    ))}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Adoptions;
