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
    const [psologia, setPsologia] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

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

    const handleAction = async (type: 'create' | 'update') => {
        setMessage("");
        const allTouched = {
            dniCliente: true,
            nombreAnimal: true,
            medicamento: true,
            psologia: true,
            descripcion: true
        };
        setTouched(allTouched);

        if (!dniCliente || !nombreAnimal || !medicamento || !psologia || !descripcion) {
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
            const treatmentData = {
                animal_dni: dniCliente, // Simplified for demo
                animal_name: nombreAnimal,
                description: descripcion,
                medication: medicamento,
                dosage: psologia
            };

            if (type === 'create') {
                await vetService.createTreatment(treatmentData);
                setMessage("Tratamiento creado correctamente");
            } else {
                setMessage("Actualización de tratamiento no implementada");
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
                    <input type="text" placeholder="Buscar" />
                </div>

                <div className="divider"></div>

                <div className="treatment-form">
                    {/* Left Column */}
                    <div className="form-group">
                        <label>DNi Cliente</label>
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

                    {/* Right Column */}
                    <div className="form-group">
                        <label>Medicamento</label>
                        {touched.medicamento && !medicamento && (
                            <div className="field-error-message">Campo obligatorio</div>
                        )}
                        <input
                            className={`custom-input ${touched.medicamento && !medicamento ? 'input-invalid' : ''}`}
                            placeholder="Insertar Medicamento"
                            value={medicamento}
                            onChange={(e) => setMedicamento(e.target.value)}
                            onBlur={() => markTouched('medicamento')}
                        />
                    </div>

                    {/* Left Column */}
                    <div className="form-group">
                        <label>Nombre Animal</label>
                        {touched.nombreAnimal && !nombreAnimal && (
                            <div className="field-error-message">Campo obligatorio</div>
                        )}
                        <input
                            className={`custom-input ${touched.nombreAnimal && !nombreAnimal ? 'input-invalid' : ''}`}
                            placeholder="Insertar Nombre Animal"
                            value={nombreAnimal}
                            onChange={(e) => setNombreAnimal(e.target.value)}
                            onBlur={() => markTouched('nombreAnimal')}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="form-group">
                        <label>Psologia</label>
                        {touched.psologia && !psologia && (
                            <div className="field-error-message">Campo obligatorio</div>
                        )}
                        <input
                            className={`custom-input ${touched.psologia && !psologia ? 'input-invalid' : ''}`}
                            placeholder="Insertar Psologia"
                            value={psologia}
                            onChange={(e) => setPsologia(e.target.value)}
                            onBlur={() => markTouched('psologia')}
                        />
                    </div>

                    {/* Left Column */}
                    <div className="form-group">
                        <label>Descripcion</label>
                        {touched.descripcion && !descripcion && (
                            <div className="field-error-message">Campo obligatorio</div>
                        )}
                        <input
                            className={`custom-input ${touched.descripcion && !descripcion ? 'input-invalid' : ''}`}
                            placeholder="Insertar Descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            onBlur={() => markTouched('descripcion')}
                        />
                    </div>

                    {/* Right Column - Placeholder to keep grid structure parity with image */}
                    <div></div>


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
