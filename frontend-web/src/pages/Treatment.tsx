import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/Treatment.css';

const Treatment: React.FC = () => {
    const navigate = useNavigate();

    // State for form fields
    const [dniCliente, setDniCliente] = useState<string>("");
    const [nombreAnimal, setNombreAnimal] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");
    const [medicamento, setMedicamento] = useState<string>("");
    const [posologia, setPosologia] = useState<string>("");
    const [idEmpleado, setIdEmpleado] = useState<string>("");

    const [appointmentsList, setAppointmentsList] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);

    const [treatments, setTreatments] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [trData, aptData, empData] = await Promise.all([
                    vetService.getTreatments(),
                    vetService.getAppointments(),
                    vetService.getEmployees()
                ]);
                setTreatments(trData || []);
                setAppointmentsList(aptData || []);
                setEmployees(empData || []);
                if (empData?.length > 0 && !idEmpleado) {
                    setIdEmpleado(empData[0].id);
                }
            } catch (err: any) {
                console.error("Error loading data", err);
            }
        };
        fetchData();
    }, []);

    const handleSelectTreatment = (treatment: any) => {
        setDniCliente(treatment.appointment?.client?.dni || "");
        setNombreAnimal(treatment.appointment?.animal?.name || "");
        setDescripcion(treatment.description || "");
        setMedicamento(treatment.medication || "");
        setPosologia(treatment.dosage || "");
        setIdEmpleado(treatment.employee_id || "");
        setSelectedTreatmentId(treatment.id);
        setSearchTerm("");
    };

    const filteredTreatments = searchTerm.length > 0
        ? treatments.filter(t => 
            t.medication?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.appointment?.animal?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.id?.toLowerCase().includes(searchTerm.toLowerCase())
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

        const allTouched = {
            dniCliente: true,
            nombreAnimal: true,
            medicamento: true,
            posologia: true,
            descripcion: true,
            idEmpleado: true
        };
        setTouched(allTouched);

        if (!dniCliente || !nombreAnimal || !medicamento || !posologia || !descripcion || !idEmpleado) {
            setMessage("Por favor, completa todos los campos obligatorios");
            setShowToast(true);
            return;
        }

        if (!validateDNI(dniCliente)) {
            setMessage("El DNI introducido no es válido");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            // Find Appointment
            const appointment = appointmentsList.find(a => 
                a.client?.dni.toUpperCase() === dniCliente.toUpperCase() &&
                a.animal?.name.toLowerCase() === nombreAnimal.toLowerCase()
            );

            if (!appointment) {
                setMessage("No se encontró una cita para este cliente y animal");
                setShowToast(true);
                setLoading(false);
                return;
            }

            const treatmentData = {
                appointment_id: appointment.id,
                employee_id: idEmpleado,
                description: descripcion,
                medication: medicamento,
                dosage: posologia
            };

            if (type === 'create') {
                await vetService.createTreatment(treatmentData);
                setMessage("Tratamiento creado correctamente");
            } else {
                if (!selectedTreatmentId) {
                    setMessage("Por favor, busca y selecciona un tratamiento para actualizar");
                    setShowToast(true);
                    setLoading(false);
                    return;
                }
                await vetService.updateTreatment(selectedTreatmentId, treatmentData);
                setMessage("Tratamiento actualizado correctamente");
            }
            setShowToast(true);
            if (type === 'create') setTimeout(() => navigate('/listado-tratamientos'), 1500);
        } catch (err: any) {
            setMessage(err.userMessage || "Error al procesar la solicitud");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="treatment-page-container">
                <div className="treatment-header">
                    <h1>Gestión Tratamiento</h1>
                    <button
                        className="btn-listado-tratamientos"
                        onClick={() => navigate('/listado-tratamientos')}
                    >
                        Listado Tratamientos <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="secondary-search-container">
                    <IonIcon icon={searchOutline} className="secondary-search-icon" />
                    <input 
                        type="text" 
                        placeholder="Buscar tratamiento por medicamento, animal o ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {filteredTreatments.length > 0 && (
                        <div className="search-results-dropdown">
                            {filteredTreatments.map(t => (
                                <div 
                                    key={t.id} 
                                    className="search-result-item"
                                    onClick={() => handleSelectTreatment(t)}
                                >
                                    <span className="employee-name">{t.medication}</span>
                                    <span className="employee-detail">Animal: {t.appointment?.animal?.name || 'N/A'} | ID: {t.id.substring(0, 8)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="divider"></div>

                <div className="treatment-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>DNI Cliente</label>
                            {touched.dniCliente && !validateDNI(dniCliente) && (
                                <div className="field-error-message">DNI no válido (8 números y letra)</div>
                            )}
                            <input
                                className={`custom-input ${touched.dniCliente && !validateDNI(dniCliente) ? 'input-invalid' : ''}`}
                                placeholder="Insertar DNI Cliente"
                                value={dniCliente}
                                onChange={(e) => setDniCliente(e.target.value)}
                                onBlur={() => markTouched('dniCliente')}
                            />
                        </div>

                        <div className="form-group">
                            <label>Nombre Animal</label>
                            {touched.nombreAnimal && !nombreAnimal && (
                                <div className="field-error-message">Campo obligatorio</div>
                            )}
                            <input
                                className={`custom-input ${touched.nombreAnimal && !nombreAnimal ? 'input-invalid' : ''}`}
                                placeholder="Nombre del animal"
                                value={nombreAnimal}
                                onChange={(e) => setNombreAnimal(e.target.value)}
                                onBlur={() => markTouched('nombreAnimal')}
                            />
                        </div>

                        <div className="form-group">
                            <label>Veterinario</label>
                            <select
                                className="custom-input"
                                value={idEmpleado}
                                onChange={(e) => setIdEmpleado(e.target.value)}
                            >
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.first_name} {emp.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Medicamento</label>
                            {touched.medicamento && !medicamento && (
                                <div className="field-error-message">Campo obligatorio</div>
                            )}
                            <input
                                className={`custom-input ${touched.medicamento && !medicamento ? 'input-invalid' : ''}`}
                                placeholder="Nombre del medicamento"
                                value={medicamento}
                                onChange={(e) => setMedicamento(e.target.value)}
                                onBlur={() => markTouched('medicamento')}
                            />
                        </div>

                        <div className="form-group">
                            <label>Posología</label>
                            {touched.posologia && !posologia && (
                                <div className="field-error-message">Campo obligatorio</div>
                            )}
                            <input
                                className={`custom-input ${touched.posologia && !posologia ? 'input-invalid' : ''}`}
                                placeholder="Ej: 1 pastilla cada 8h"
                                value={posologia}
                                onChange={(e) => setPosologia(e.target.value)}
                                onBlur={() => markTouched('posologia')}
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Descripción del Tratamiento</label>
                            {touched.descripcion && !descripcion && (
                                <div className="field-error-message">Campo obligatorio</div>
                            )}
                            <textarea
                                className={`custom-input ${touched.descripcion && !descripcion ? 'input-invalid' : ''}`}
                                placeholder="Detalles del tratamiento..."
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                onBlur={() => markTouched('descripcion')}
                            />
                        </div>
                    </div>


                    <div className="form-actions">
                        <button
                            className="btn-action"
                            onClick={() => handleAction('create')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Crear Tratamiento"}
                        </button>
                        <button
                            className="btn-action"
                            onClick={() => handleAction('update')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Actualizar Tratamiento"}
                        </button>
                    </div>
                </div>
            </div>

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={message}
                duration={3000}
                color={message.includes("correctamente") ? "success" : "danger"}
                position="top"
            />
        </MainLayout>
    );
};

export default Treatment;
