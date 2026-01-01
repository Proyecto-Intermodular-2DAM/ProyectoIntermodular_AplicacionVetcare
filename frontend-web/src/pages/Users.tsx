import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonCheckbox } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import RoleSelect from '../components/RoleSelect';
import '../theme/css/ListEmployee.css'; // Reusing common list styles

const Users: React.FC = () => {
    const navigate = useNavigate();

    const [userList, setUserList] = useState([
        { id: 1, dni: '12345678A', nombre: 'Juan Carlos', email: 'jc@gmial.com', fecha: '11/09/2025', role: 'Administrador' },
        { id: 2, dni: '12345678B', nombre: 'Ruben', email: 'ruben@gmail.com', fecha: '02/05/2024', role: 'Recepcionista' },
        { id: 3, dni: '12345678C', nombre: 'Martin', email: 'martin@gmail.com', fecha: '19/06/2015', role: 'Veterinario' },
        { id: 4, dni: '12345678F', nombre: 'Raul', email: 'raul@gmail.com', fecha: '06/01/2016', role: 'Cirujano' },
        { id: 5, dni: '12345678E', nombre: 'Alma', email: 'alma@gmail.com', fecha: '01/05/2020', role: 'Cuidador' },
    ]);

    const handleRoleChange = (id: number, newRole: string) => {
        setUserList(userList.map(u => u.id === id ? { ...u, role: newRole } : u));
    };

    return (
        <MainLayout>
            <div className="list-employee-container">
                <div className="list-employee-header">
                    <h1>Gestión Usuarios</h1>
                    <button
                        className="btn-gestion-empleado"
                        onClick={() => navigate('/ajustes')}
                    >
                        Gestionar Permisos <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="list-tabs">
                    <div className="tab-item selected">Listado Usuarios</div>
                </div>

                <div className="list-controls">
                    <div className="controls-left">
                        <div className="filter-select">
                            <IonIcon icon={calendarOutline} />
                            Last 30 days
                            <IonIcon icon={chevronForwardOutline} style={{ transform: 'rotate(90deg)', fontSize: '10px' }} />
                        </div>
                        <div className="filter-select">
                            <IonIcon icon={filterOutline} />
                            Filter by
                            <IonIcon icon={chevronForwardOutline} style={{ transform: 'rotate(90deg)', fontSize: '10px' }} />
                        </div>
                    </div>

                    <div className="controls-right">
                        <div className="table-search-bar">
                            <IonIcon icon={searchOutline} style={{ marginRight: '8px', color: '#888' }} />
                            <input type="text" placeholder="Buscar la cita (Ctrl + G)" />
                        </div>
                    </div>
                </div>

                <table className="employee-table">
                    <thead>
                        <tr>
                            <th className="col-check">
                                <IonCheckbox mode="md" />
                            </th>
                            <th className="col-no">Id</th>
                            <th className="col-dni">DNI Cliente</th>
                            <th className="col-nombre">Nombre</th>
                            <th className="col-email">Email</th>
                            <th className="col-fecha">Fecha</th>
                            <th className="col-tel">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map((u) => (
                            <tr key={u.id}>
                                <td className="col-check">
                                    <IonCheckbox mode="md" />
                                </td>
                                <td className="col-no">{u.id}</td>
                                <td className="col-dni">{u.dni}</td>
                                <td className="col-nombre">{u.nombre}</td>
                                <td className="col-email">{u.email}</td>
                                <td className="col-fecha">{u.fecha}</td>
                                <td className="col-tel">
                                    <RoleSelect
                                        value={u.role}
                                        onChange={(newRole) => handleRoleChange(u.id, newRole)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
};

export default Users;
