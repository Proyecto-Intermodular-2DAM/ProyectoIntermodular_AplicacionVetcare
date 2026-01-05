
import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import TopBar from '../components/TopBar';
import AppointmentCard, { Appointment } from '../components/AppointmentCard';
import { vetService } from '../services/vetService';
import '../theme/css/Citas.css';

const Citas: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await vetService.getMyAppointments();
                // Filter for upcoming appointments (today or future)
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const upcoming = data.filter(app => {
                    const appDate = new Date(app.date);
                    return appDate >= today;
                });
                setAppointments(upcoming as Appointment[]);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <IonPage className="citas-page">
            <TopBar />
            <IonContent className="citas-content" fullscreen>
                <div style={{ padding: '10px' }}>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            <IonSpinner name="crescent" />
                        </div>
                    ) : appointments.length > 0 ? (
                        appointments.map(app => (
                            <AppointmentCard key={app.id} appointment={app} />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ion-color-medium)' }}>
                            <p>No tienes citas programadas.</p>
                        </div>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Citas;
