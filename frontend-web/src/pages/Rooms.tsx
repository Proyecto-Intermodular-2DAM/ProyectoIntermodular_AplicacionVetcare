import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/Rooms.css';

const Rooms: React.FC = () => {
    const navigate = useNavigate();

    // State for form fields based on the image provided
    const [dniCliente, setDniCliente] = useState<string>("");
    const [codigoCentro, setCodigoCentro] = useState<string>("");
    const [nombre, setNombre] = useState<string>("");
    const [extraField, setExtraField] = useState<string>(""); // Extra input shown at bottom of image

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
        const allTouched = { dniCliente: true, codigoCentro: true, nombre: true };
        setTouched(allTouched);

        if (!dniCliente || !codigoCentro || !nombre) {
            setMessage("Por favor, completa los campos principales");
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
            const roomData = {
                center_code: codigoCentro,
                name: nombre,
                size_m2: parseFloat(extraField) || 0
            };

            if (type === 'create') {
                await vetService.createRoom(roomData);
                setMessage("Sala creada correctamente");
            } else {
                setMessage("Actualización de sala no implementada por falta de ID");
            }
            setShowToast(true);
            if (type === 'create') setTimeout(() => navigate('/listado-salas'), 1500);
        } catch (err: any) {
            setMessage(err.userMessage || "Error al procesar la solicitud");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="rooms-page-container">
                <div className="rooms-header">
                    <h1>Gestión Salas</h1>
                    <button
                        className="btn-listado-salas"
                        onClick={() => navigate('/listado-salas')}
                    >
                        Listado Salas <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="secondary-search-container">
                    <IonIcon icon={searchOutline} className="secondary-search-icon" />
                    <input type="text" placeholder="Buscar" />
                </div>

                <div className="divider"></div>

                <div className="rooms-form">
                    <div className="form-group">
                        <label>DNi Cliente</label>
                        {touched.dniCliente && !validateDNI(dniCliente) && (
                            <div className="field-error-message">DNI no válido (8 números y letra)</div>
                        )}
                        <input
                            className={`custom-input ${touched.dniCliente && !validateDNI(dniCliente) ? 'input-invalid' : ''}`}
                            placeholder="Insertar Codigo"
                            value={dniCliente}
                            onChange={(e) => setDniCliente(e.target.value)}
                            onBlur={() => markTouched('dniCliente')}
                        />
                    </div>

                    <div className="form-group">
                        <label>Codigo Centro</label>
                        {touched.codigoCentro && !codigoCentro && (
                            <div className="field-error-message">Campo obligatorio</div>
                        )}
                        <input
                            className={`custom-input ${touched.codigoCentro && !codigoCentro ? 'input-invalid' : ''}`}
                            placeholder="Insertar Centro"
                            value={codigoCentro}
                            onChange={(e) => setCodigoCentro(e.target.value)}
                            onBlur={() => markTouched('codigoCentro')}
                        />
                    </div>

                    <div className="form-group">
                        <label>Nombre</label>
                        {touched.nombre && !nombre && (
                            <div className="field-error-message">Campo obligatorio</div>
                        )}
                        <input
                            className={`custom-input ${touched.nombre && !nombre ? 'input-invalid' : ''}`}
                            placeholder="Insertar Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            onBlur={() => markTouched('nombre')}
                        />
                    </div>

                    <div className="form-group" style={{ marginTop: '20px' }}>
                        {/* Empty label input as seen in lower part of the image mockup */}
                        <input
                            className="custom-input"
                            value={extraField}
                            onChange={(e) => setExtraField(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-actions-container">
                    <button
                        className="btn-action"
                        onClick={() => handleAction('create')}
                        disabled={loading}
                    >
                        {loading ? "Procesando..." : "Crear Salas"}
                    </button>
                    <button
                        className="btn-action"
                        onClick={() => handleAction('update')}
                        disabled={loading}
                    >
                        {loading ? "Procesando..." : "Actualizar Salas"}
                    </button>
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

export default Rooms;
