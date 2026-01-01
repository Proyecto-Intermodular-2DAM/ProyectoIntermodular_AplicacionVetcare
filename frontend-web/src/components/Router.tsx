import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import PasswordRecovery from '../pages/PasswordRecovery';
import ErrorPage from '../pages/ErrorPage';
import Employee from '../pages/Employee';
import Appointment from '../pages/Appointment';
import DatePage from '../pages/Date';
import Center from '../pages/Center';
import Animal from '../pages/Animal';
import Rooms from '../pages/Rooms';
import Treatment from '../pages/Treatment';
import ListEmployee from '../pages/ListEmployee';
import ListAppoinment from '../pages/ListAppoinment';
import ListDate from '../pages/ListDate';
import ListAnimal from '../pages/ListAnimal';
import ListRooms from '../pages/ListRooms';
import ListTreatment from '../pages/ListTreatment';
import Adoption from '../pages/Adoption';
import ListAdoption from '../pages/ListAdoption';
import Clients from '../pages/Clients';
import ListClients from '../pages/ListClients';
import Roles from '../pages/Roles';
import Users from '../pages/Users';
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
            <Route path="/animales" element={<Animal />} />
            <Route path="/gestion-animal" element={<Animal />} />
            <Route path="/salas" element={<Rooms />} />
            <Route path="/gestion-salas" element={<Rooms />} />
            <Route path="/tratamientos" element={<Treatment />} />
            <Route path="/gestion-tratamiento" element={<Treatment />} />
            <Route path="/historial-adopciones" element={<Adoption />} />
            <Route path="/gestion-adopcion" element={<Adoption />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/gestion-clientes" element={<Clients />} />
            <Route path="/usuarios" element={<Users />} />
            <Route path="/ajustes" element={<Roles />} />
            <Route path="/citas" element={<DatePage />} />
            <Route path="/date" element={<DatePage />} />
            <Route path="/listado-empleados" element={<ListEmployee />} />
            <Route path="/listado-citas" element={<ListDate />} />
            <Route path="/listado-animales" element={<ListAnimal />} />
            <Route path="/listado-salas" element={<ListRooms />} />
            <Route path="/listado-tratamientos" element={<ListTreatment />} />
            <Route path="/listado-adopcion" element={<ListAdoption />} />
            <Route path="/listado-clientes" element={<ListClients />} />
            <Route path="/listado-centros" element={<ListCenter />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    </BrowserRouter>
);

export default AppRouter;
