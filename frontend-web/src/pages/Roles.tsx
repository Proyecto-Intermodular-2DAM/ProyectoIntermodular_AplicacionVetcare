import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import '../theme/css/Roles.css';

const Roles: React.FC = () => {
    // State for inputs
    const [empleado, setEmpleado] = useState("");
    const [idEmpleado, setIdEmpleado] = useState("");

    // State for permissions checkboxes
    const [permissions, setPermissions] = useState({
        consultar: false,
        insertar: false,
        eliminar: false,
        modificar: false,
        ejecutar: false
    });

    // State for access checkboxes
    const [access, setAccess] = useState({
        empleados: false,
        citas: false,
        animales: false,
        salas: false,
        tratamiento: false
    });

    const handlePermissionChange = (field: keyof typeof permissions) => {
        setPermissions({ ...permissions, [field]: !permissions[field] });
    };

    const handleAccessChange = (field: keyof typeof access) => {
        setAccess({ ...access, [field]: !access[field] });
    };

    return (
        <MainLayout>
            <div className="roles-page-container">
                <div className="roles-section">
                    <h1>Gestionar Permisos</h1>

                    <div className="roles-form-top">
                        <div className="form-group">
                            <label>Empleado</label>
                            <input
                                className="custom-input"
                                placeholder="Empleado"
                                value={empleado}
                                onChange={(e) => setEmpleado(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Id Empleado</label>
                            <input
                                className="custom-input"
                                placeholder="Id Empleado"
                                value={idEmpleado}
                                onChange={(e) => setIdEmpleado(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="permissions-grid">
                        <div className="permission-item">
                            <label>Consultar</label>
                            <input
                                type="checkbox"
                                className="permission-checkbox"
                                checked={permissions.consultar}
                                onChange={() => handlePermissionChange('consultar')}
                            />
                        </div>
                        <div className="permission-item">
                            <label>Insertar</label>
                            <input
                                type="checkbox"
                                className="permission-checkbox"
                                checked={permissions.insertar}
                                onChange={() => handlePermissionChange('insertar')}
                            />
                        </div>
                        <div className="permission-item">
                            <label>Eliminar</label>
                            <input
                                type="checkbox"
                                className="permission-checkbox"
                                checked={permissions.eliminar}
                                onChange={() => handlePermissionChange('eliminar')}
                            />
                        </div>
                        <div className="permission-item">
                            <label>Modificar</label>
                            <input
                                type="checkbox"
                                className="permission-checkbox"
                                checked={permissions.modificar}
                                onChange={() => handlePermissionChange('modificar')}
                            />
                        </div>
                        <div className="permission-item">
                            <label>Ejecutar</label>
                            <input
                                type="checkbox"
                                className="permission-checkbox"
                                checked={permissions.ejecutar}
                                onChange={() => handlePermissionChange('ejecutar')}
                            />
                        </div>
                    </div>
                </div>

                <div className="roles-section">
                    <h2>Gestionar Accesos</h2>
                    <div className="access-grid">
                        <div className="permission-item">
                            <label>Empleados</label>
                            <input
                                type="checkbox"
                                className="permission-checkbox"
                                checked={access.empleados}
                                onChange={() => handleAccessChange('empleados')}
                            />
                        </div>
                        <div className="permission-item">
                            <label>Citas</label>
                            <input
                                type="checkbox"
                                className="permission-checkbox"
                                checked={access.citas}
                                onChange={() => handleAccessChange('citas')}
                            />
                        </div>
                        <div className="permission-item">
                            <label>Animales</label>
                            <input
                                type="checkbox"
                                className="permission-checkbox"
                                checked={access.animales}
                                onChange={() => handleAccessChange('animales')}
                            />
                        </div>
                        <div className="permission-item">
                            <label>Salas</label>
                            <input
                                type="checkbox"
                                className="permission-checkbox"
                                checked={access.salas}
                                onChange={() => handleAccessChange('salas')}
                            />
                        </div>
                        <div className="permission-item">
                            <label>Tratamiento</label>
                            <input
                                type="checkbox"
                                className="permission-checkbox"
                                checked={access.tratamiento}
                                onChange={() => handleAccessChange('tratamiento')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Roles;
