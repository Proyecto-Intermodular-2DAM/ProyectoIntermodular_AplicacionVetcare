import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import PasswordRecovery from '../pages/PasswordRecovery';
import ErrorPage from '../pages/ErrorPage';
import Employee from '../pages/Employee';
import Appointment from '../pages/Appointment';
import Center from '../pages/Center';
import ListEmployee from '../pages/ListEmployee';
import ListAppoinment from '../pages/ListAppoinment';
import ListCenter from '../pages/ListCenter';

const AppRouter: React.FC = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/passwordRecovery" element={<PasswordRecovery />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/empleados" element={<Employee />} />
            <Route path="/centros" element={<Center />} />
            <Route path="/citas" element={<Appointment />} />
            <Route path="/listado-empleados" element={<ListEmployee />} />
            <Route path="/listado-citas" element={<ListAppoinment />} />
            <Route path="/listado-centros" element={<ListCenter />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    </BrowserRouter>
);

export default AppRouter;
