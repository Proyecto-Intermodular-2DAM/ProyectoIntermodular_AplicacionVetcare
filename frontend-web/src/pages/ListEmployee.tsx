import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonLoading, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/ListEmployee.css';

const ListEmployee: React.FC = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await vetService.getEmployees();
                setEmployees(data || []);
            } catch (err: any) {
                setToastMessage(err.message || 'Error al cargar empleados');
                setShowToast(true);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) return;
        try {
            await vetService.deleteEmployee(id);
            setEmployees(employees.filter(e => e.id !== id));
            setToastMessage('Empleado eliminado correctamente');
            setShowToast(true);
        } catch (err: any) {
            setToastMessage(err.message || 'Error al eliminar empleado');
            setShowToast(true);
        }
    };

    if (loading) {
        return <IonLoading isOpen={true} message="Cargando empleados..." />;
    }

    return (
        <MainLayout>
            <div className="list-employee-container">
                <div className="list-employee-header">
                    <h1>Listado Empleados</h1>
                    <button
                        className="btn-gestion-empleado"
                        onClick={() => navigate('/empleados')}
                    >
                        Gestión Empleado <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="list-tabs">
                    <div className="tab-item">Listado Empleados</div>
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
                            <th className="col-no">ID</th>
                            <th className="col-dni">DNI</th>
                            <th className="col-nombre">Nombre</th>
                            <th className="col-telefono">Teléfono</th>
                            <th className="col-sueldo">Sueldo</th>
                            <th className="col-id">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id}>
                                <td className="col-no">{emp.id.substring(0, 8)}</td>
                                <td className="col-dni">{emp.dni}</td>
                                <td className="col-nombre">{emp.name} {emp.surname}</td>
                                <td className="col-telefono">{emp.phone}</td>
                                <td className="col-sueldo">{emp.salary} €</td>
                                <td className="col-id">
                                    <button 
                                        className="btn-eliminar-small"
                                        onClick={() => handleDelete(emp.id)}
                                    >
                                        Eliminar
                                    </button>
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
                color="primary"
                position="top"
            />
        </MainLayout>
    );
};

export default ListEmployee;
