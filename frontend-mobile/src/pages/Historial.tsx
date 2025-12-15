import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import TopBar from '../components/TopBar';
import AppointmentCard, { Appointment } from '../components/AppointmentCard';
import '../theme/css/Citas.css';

const Historial: React.FC = () => {
    // Mock data for past appointments
    const pastAppointments: Appointment[] = [
        {
            id: '1',
            title: 'Revisión anual',
            date: '2024-10-15',
            time: '10:00 AM',
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
            title: 'Vacuna antirrábica',
            date: '2024-09-20',
            time: '14:30 PM',
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
            id: '3',
            title: 'Chequeo general',
            date: '2024-08-10',
            time: '09:15 AM',
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
                    {pastAppointments.map(app => (
                        <AppointmentCard key={app.id} appointment={app} />
                    ))}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Historial;
