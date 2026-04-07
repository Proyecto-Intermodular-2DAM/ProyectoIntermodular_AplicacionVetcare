import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IonLoading } from '@ionic/react';

const ProtectedRoute: React.FC = () => {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return <IonLoading isOpen={true} message="Verificando sesión..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role check: Only non-Clients can access the admin panel
    if (profile && profile.role === 'Cliente') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
