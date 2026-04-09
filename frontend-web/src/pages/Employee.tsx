import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/Employee.css';

const Employee: React.FC = () => {
    const navigate = useNavigate();
    const [dni, setDni] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [salary, setSalary] = useState<string>("");

    const [employees, setEmployees] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    React.useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await vetService.getEmployees();
                setEmployees(data || []);
            } catch (err: any) {
                console.error("Error loading employees", err);
            }
        };
        fetchEmployees();
    }, []);

    const handleSelectEmployee = (emp: any) => {
        setDni(emp.dni || "");
        setName(`${emp.first_name} ${emp.last_name}`);
        setPhone(emp.phone_number || "");
        setSalary(emp.salary?.toString() || "");
        setSelectedEmployeeId(emp.id);
        setSearchTerm("");
    };

    const filteredEmployees = searchTerm.length > 0
        ? employees.filter(emp => 
            `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.dni?.toLowerCase().includes(searchTerm.toLowerCase())
          ).slice(0, 5)
        : [];


    const markTouched = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const validateDNI = (dni: string) => {
        const regex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
        if (!regex.test(dni)) return false;
        const lookup = "TRWAGMYFPDXBNJZSQVHLCKE";
        const number = parseInt(dni.substring(0, 8), 10);
        const letter = dni.charAt(8).toUpperCase();
        return lookup.charAt(number % 23) === letter;
    };

    const validatePhone = (phone: string) => {
        return /^[0-9]{9}$/.test(phone);
    };

    const validateSalary = (salary: string) => {
        const num = parseFloat(salary);
        return !isNaN(num) && num > 0;
    };

    const handleAction = async (type: 'create' | 'update') => {
        setError("");
        const allTouched = { dni: true, name: true, phone: true, salary: true };
        setTouched(allTouched);

        if (!dni || !name || !phone || !salary) {
            setError("Por favor, completa todos los campos obligatorios");
            setShowToast(true);
            return;
        }

        if (!validateDNI(dni)) {
            setError("El DNI introducido no es válido");
            setShowToast(true);
            return;
        }

        if (!validatePhone(phone)) {
            setError("El teléfono debe tener 9 dígitos");
            setShowToast(true);
            return;
        }

        if (!validateSalary(salary)) {
            setError("El sueldo debe ser un número positivo");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            const nameParts = name.trim().split(/\s+/);
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');

            const employeeData = {
                dni,
                first_name: firstName,
                last_name: lastName,
                phone_number: phone,
                salary: parseFloat(salary)
            };


            if (type === 'create') {
                await vetService.createEmployee(employeeData);
                setError("Empleado creado correctamente");
            } else {
                if (!selectedEmployeeId) {
                    setError("Por favor, busca y selecciona un empleado para actualizar");
                    setShowToast(true);
                    setLoading(false);
                    return;
                }
                await vetService.updateEmployee(selectedEmployeeId, employeeData);
                setError("Empleado actualizado correctamente");
            }
            setShowToast(true);
            setTimeout(() => navigate('/listado-empleados'), 1500);
        } catch (err: any) {
            setError(err.userMessage || "Error al procesar la solicitud");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="employee-page-container">
                <div className="employee-header">
                    <h1>Gestión Empleados</h1>
                    <button
                        className="btn-listado-centros"
                        onClick={() => navigate('/listado-empleados')}
                    >
                        Listado Empleados <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="secondary-search-container">
                    <IonIcon icon={searchOutline} className="secondary-search-icon" />
                    <input 
                        type="text" 
                        placeholder="Buscar empleado por Nombre o DNI..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {filteredEmployees.length > 0 && (
                        <div className="search-results-dropdown">
                            {filteredEmployees.map(emp => (
                                <div 
                                    key={emp.id} 
                                    className="search-result-item"
                                    onClick={() => handleSelectEmployee(emp)}
                                >
                                    <span className="employee-name">{emp.first_name} {emp.last_name}</span>
                                    <span className="employee-detail">DNI: {emp.dni} | Tel: {emp.phone_number}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="divider"></div>

                <div className="employee-form">
                    <div className="form-group">
                        <label>DNI</label>
                        {touched.dni && !validateDNI(dni) && (
                            <div className="field-error-message">DNI no válido (8 números y letra)</div>
                        )}
                        <input
                            className={`custom-input ${touched.dni && !validateDNI(dni) ? 'input-invalid' : ''}`}
                            placeholder="Insertar DNI"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            onBlur={() => markTouched('dni')}
                        />
                    </div>

                    <div className="form-group">
                        <label>Nombre</label>
                        {touched.name && !name && (
                            <div className="field-error-message">El nombre es obligatorio</div>
                        )}
                        <input
                            className={`custom-input ${touched.name && !name ? 'input-invalid' : ''}`}
                            placeholder="Insertar nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={() => markTouched('name')}
                        />
                    </div>

                    <div className="form-group">
                        <label>Telefono</label>
                        {touched.phone && !validatePhone(phone) && (
                            <div className="field-error-message">Teléfono no válido (9 dígitos)</div>
                        )}
                        <input
                            className={`custom-input ${touched.phone && !validatePhone(phone) ? 'input-invalid' : ''}`}
                            placeholder="Insertar Telefono"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onBlur={() => markTouched('phone')}
                        />
                    </div>

                    <div className="form-group">
                        <label>Sueldo</label>
                        {touched.salary && !validateSalary(salary) && (
                            <div className="field-error-message">Sueldo debe ser un número positivo</div>
                        )}
                        <input
                            className={`custom-input ${touched.salary && !validateSalary(salary) ? 'input-invalid' : ''}`}
                            placeholder="Insertar Sueldo"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            onBlur={() => markTouched('salary')}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            className="btn-action"
                            onClick={() => handleAction('create')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Crear Empleado"}
                        </button>
                        <button
                            className="btn-action"
                            onClick={() => handleAction('update')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Actualizar Empleado"}
                        </button>
                    </div>
                </div>
            </div>

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={error}
                duration={3000}
                color={error.includes("correctamente") ? "success" : "danger"}
                position="top"
            />
        </MainLayout>
    );
};

export default Employee;
