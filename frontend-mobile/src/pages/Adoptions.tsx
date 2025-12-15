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
import '../theme/css/Adoptions.css';
import TopBar from '../components/TopBar';

interface AdoptionItem {
    id: number;
    image: string;
    date: string;
    title: string;
    description: string;
}

const defaultAdoptions: AdoptionItem[] = [
    {
        id: 1,
        image: 'https://ionicframework.com/docs/img/demos/card-media.png',
        date: 'October 12, 2024',
        title: 'Adopta a Max',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores...'
    },
    {
        id: 2,
        image: 'https://ionicframework.com/docs/img/demos/card-media.png',
        date: 'October 12, 2024',
        title: 'Adopta a Luna',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores...'
    },
    {
        id: 3,
        image: 'https://ionicframework.com/docs/img/demos/card-media.png',
        date: 'October 12, 2024',
        title: 'Adopta a Rocky',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores...'
    }
];

const Adoptions: React.FC = () => {
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
                        <IonCard key={item.id} className="adoption-card">
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
                                <a href="#" className="read-more-link">Read more</a>
                            </IonCardContent>
                        </IonCard>
                    ))}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Adoptions;
