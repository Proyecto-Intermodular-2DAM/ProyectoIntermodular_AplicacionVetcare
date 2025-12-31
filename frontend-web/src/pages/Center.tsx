import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../theme/css/Employee.css';

const Center: React.FC = () => {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState<string>("");
    const [codigoPostal, setCodigoPostal] = useState<string>("");
    const [direccion, setDireccion] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const markTouched = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const validateCodigoPostal = (cp: string) => {
        // Código postal español: 5 dígitos
        return /^[0-9]{5}$/.test(cp);
    };

    const handleAction = async (type: 'create' | 'update') => {
        setMessage("");

        const allTouched = {
            nombre: true,
            codigoPostal: true,
            direccion: true
        };
        setTouched(allTouched);

        if (!nombre || !codigoPostal || !direccion) {
            setMessage("Por favor, completa todos los campos obligatorios");
            setShowToast(true);
            return;
        }

        if (!validateCodigoPostal(codigoPostal)) {
            setMessage("El código postal no es válido");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            console.log(
                `${type === 'create' ? 'Creando' : 'Actualizando'} registro`,
                { nombre, codigoPostal, direccion }
            );

            await new Promise(resolve => setTimeout(resolve, 1000));

            setMessage(
                type === 'create'
                    ? "Registro creado correctamente"
                    : "Registro actualizado correctamente"
            );
            setShowToast(true);
        } catch {
            setMessage("Error al procesar la solicitud");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="employee-page-container">
                <div className="employee-header">
                    <h1>Gestión Centros</h1>
                    <button
                        className="btn-listado-centros"
                        onClick={() => navigate('/listado-centros')}
                    >
                        Listado Centros<IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="secondary-search-container">
                    <IonIcon icon={searchOutline} className="secondary-search-icon" />
                    <input type="text" placeholder="Buscar" />
                </div>

                <div className="divider"></div>

                <div className="employee-form">

                    <div className="form-group">
                        <label>Nombre</label>
                        {touched.nombre && !nombre && (
                            <div className="field-error-message">
                                El nombre es obligatorio
                            </div>
                        )}
                        <input
                            className={`custom-input ${
                                touched.nombre && !nombre ? 'input-invalid' : ''
                            }`}
                            placeholder="Insertar nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            onBlur={() => markTouched('nombre')}
                        />
                    </div>

                    <div className="form-group">
                        <label>Código Postal</label>
                        {touched.codigoPostal && !validateCodigoPostal(codigoPostal) && (
                            <div className="field-error-message">
                                Código postal no válido (5 dígitos)
                            </div>
                        )}
                        <input
                            className={`custom-input ${
                                touched.codigoPostal && !validateCodigoPostal(codigoPostal)
                                    ? 'input-invalid'
                                    : ''
                            }`}
                            placeholder="Insertar código postal"
                            value={codigoPostal}
                            onChange={(e) => setCodigoPostal(e.target.value)}
                            onBlur={() => markTouched('codigoPostal')}
                        />
                    </div>

                    <div className="form-group">
                        <label>Dirección</label>
                        {touched.direccion && !direccion && (
                            <div className="field-error-message">
                                La dirección es obligatoria
                            </div>
                        )}
                        <textarea
                            className={`custom-input ${
                                touched.direccion && !direccion ? 'input-invalid' : ''
                            }`}
                            placeholder="Insertar dirección"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            onBlur={() => markTouched('direccion')}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            className="btn-action"
                            onClick={() => handleAction('create')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Crear"}
                        </button>
                        <button
                            className="btn-action"
                            onClick={() => handleAction('update')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Actualizar"}
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

export default Center;
