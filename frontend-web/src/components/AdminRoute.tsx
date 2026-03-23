import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IonLoading } from '@ionic/react';

const AdminRoute: React.FC = () => {
    const { profile, loading } = useAuth();

    if (loading) {
        return <IonLoading isOpen={true} message="Verificando permisos..." />;
    }

    if (!profile || profile.role !== 'ADMIN') {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
