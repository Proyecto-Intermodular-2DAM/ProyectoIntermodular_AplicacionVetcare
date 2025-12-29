import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import PasswordRecovery from '../pages/PasswordRecovery';
import ErrorPage from '../pages/ErrorPage';
import Employee from '../pages/Employee';
import ListEmployee from '../pages/ListEmployee';

const AppRouter: React.FC = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/passwordRecovery" element={<PasswordRecovery />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/empleados" element={<Employee />} />
            <Route path="/listado-empleados" element={<ListEmployee />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    </BrowserRouter>
);

export default AppRouter;
