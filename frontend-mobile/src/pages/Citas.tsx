import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import TopBar from '../components/TopBar';
import AppointmentCard, { Appointment } from '../components/AppointmentCard';
import '../theme/css/Citas.css';

const Citas: React.FC = () => {
    const mockAppointments: Appointment[] = [
        {
            id: '1',
            title: 'Vacuna de la rabia',
            date: new Date().toISOString(), // Today
            time: '11:30 AM',
            veterinarian: {
                name: 'Elvia Atkins',
                avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg'
            },
            animal: {
                name: 'Toby',
                avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
                type: 'Dog'
            }
        },
        {
            id: '2',
            title: 'Revisión',
            date: '2024-11-05',
            time: '16:30 AM',
            veterinarian: {
                name: 'Elvia Atkins',
                avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg'
            },
            animal: {
                name: 'Toby',
                avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
                type: 'Dog'
            }
        }
    ];

    return (
        <IonPage className="citas-page">
            <TopBar />
            <IonContent className="citas-content" fullscreen>
                <div style={{ padding: '10px' }}>
                    {/* Title or usage of existing structure? 
                 Mockup 2 shows "Vetcare" header (TopBar) and then the cards.
                 It doesn't show a specific page title like "Mis Citas", but I'll stick to just the cards 
                 as per the "second image" visual which is mostly cards. 
             */}
                    {mockAppointments.map(app => (
                        <AppointmentCard key={app.id} appointment={app} />
                    ))}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Citas;
