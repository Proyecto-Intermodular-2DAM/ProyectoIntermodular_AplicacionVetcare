import React, { useMemo } from 'react';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import TopBar from '../components/TopBar';
import AppointmentCard from '../components/AppointmentCard';
import { useAppointments } from '../hooks/useVet';
import '../theme/css/Citas.css';

const Citas: React.FC = () => {
    const { appointments, loading, error } = useAppointments();

    const upcomingAppointments = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return appointments?.filter(app => {
            const appDate = new Date(app.date);
            return appDate >= today;
        }) || [];
    }, [appointments]);

    return (
        <IonPage className="citas-page">
            <TopBar />
            <IonContent className="citas-content" fullscreen>
                <div style={{ padding: '10px' }}>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            <IonSpinner name="crescent" />
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ion-color-danger)' }}>
                            <p>{error}</p>
                        </div>
                    ) : upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map(app => (
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
