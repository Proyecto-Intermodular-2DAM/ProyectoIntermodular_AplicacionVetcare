import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonCheckbox, IonToast, IonLoading } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import RoleSelect from '../components/RoleSelect';
import { vetService } from '../services/vetService';
import '../theme/css/ListEmployee.css'; // Reusing common list styles

const Users: React.FC = () => {
    const navigate = useNavigate();
    const [userList, setUserList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('success');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await vetService.getUsers();
                setUserList(data || []);
            } catch (err: any) {
                setToastMessage(err.message || 'Error al cargar usuarios');
                setToastColor('danger');
                setShowToast(true);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleRoleChange = async (id: string, newRole: string) => {
        try {
            await vetService.updateUserRole(id, newRole);
            setUserList(userList.map(u => u.id === id ? { ...u, role: newRole } : u));
            setToastMessage('Rol actualizado correctamente');
            setToastColor('success');
            setShowToast(true);
        } catch (err: any) {
            setToastMessage(err.message || 'Error al actualizar el rol');
            setToastColor('danger');
            setShowToast(true);
        }
    };

    if (loading) {
        return <IonLoading isOpen={true} message="Cargando usuarios..." />;
    }

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
                            <th className="col-dni">DNI</th>
                            <th className="col-nombre">Nombre</th>
                            <th className="col-email">Email</th>
                            <th className="col-fecha">Fecha Reg.</th>
                            <th className="col-tel">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map((u) => (
                            <tr key={u.id}>
                                <td className="col-check">
                                    <IonCheckbox mode="md" />
                                </td>
                                <td className="col-no">{u.id.substring(0, 8)}...</td>
                                <td className="col-dni">{u.dni}</td>
                                <td className="col-nombre">{u.first_name} {u.last_name}</td>
                                <td className="col-email">{u.email}</td>
                                <td className="col-fecha">{new Date(u.created_at).toLocaleDateString()}</td>
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

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={3000}
                color={toastColor}
                position="top"
            />
        </MainLayout>
    );
};

export default Users;
