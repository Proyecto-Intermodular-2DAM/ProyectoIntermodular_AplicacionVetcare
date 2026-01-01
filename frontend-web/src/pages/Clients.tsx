import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../theme/css/Clients.css';

const Clients: React.FC = () => {
    const navigate = useNavigate();

    // State for form fields as per image
    const [dniCliente, setDniCliente] = useState<string>("");
    const [nombreCliente, setNombreCliente] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telefono, setTelefono] = useState<string>("");

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

    const validatePhone = (phone: string) => {
        return /^[0-9]{9}$/.test(phone);
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleAction = async (type: 'create' | 'update') => {
        setMessage("");
        const allTouched = { dniCliente: true, nombreCliente: true, email: true, telefono: true };
        setTouched(allTouched);

        if (!dniCliente || !nombreCliente || !email || !telefono) {
            setMessage("Por favor, completa todos los campos obligatorios");
            setShowToast(true);
            return;
        }

        if (!validateDNI(dniCliente)) {
            setMessage("El DNI introducido no es válido");
            setShowToast(true);
            return;
        }

        if (!validatePhone(telefono)) {
            setMessage("El teléfono debe tener 9 dígitos");
            setShowToast(true);
            return;
        }

        if (!validateEmail(email)) {
            setMessage("El email introducido no es válido");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            console.log(`${type === 'create' ? 'Creando' : 'Actualizando'} cliente:`, {
                dniCliente, nombreCliente, email, telefono
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            setMessage(`Cliente ${type === 'create' ? 'creado' : 'actualizado'} correctamente`);
            setShowToast(true);
        } catch (err) {
            setMessage("Error al procesar la solicitud");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="clients-page-container">
                <div className="clients-header">
                    <h1>Gestión Clientes</h1>
                    <button
                        className="btn-listado-clientes"
                        onClick={() => navigate('/listado-clientes')}
                    >
                        Listado Clientes <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="secondary-search-container">
                    <IonIcon icon={searchOutline} className="secondary-search-icon" />
                    <input type="text" placeholder="Buscar" />
                </div>

                <div className="divider"></div>

                <div className="clients-form">
                    {/* Row 1 */}
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
                    <div className="form-group">
                        <label>Telefono</label>
                        {touched.telefono && !validatePhone(telefono) && (
                            <div className="field-error-message">Teléfono no válido (9 dígitos)</div>
                        )}
                        <input
                            className={`custom-input ${touched.telefono && !validatePhone(telefono) ? 'input-invalid' : ''}`}
                            placeholder="Insertar Telefono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            onBlur={() => markTouched('telefono')}
                        />
                    </div>

                    {/* Row 2 */}
                    <div className="form-group">
                        <label>Nombre Cliente</label>
                        {touched.nombreCliente && !nombreCliente && (
                            <div className="field-error-message">El nombre es obligatorio</div>
                        )}
                        <input
                            className={`custom-input ${touched.nombreCliente && !nombreCliente ? 'input-invalid' : ''}`}
                            placeholder="Insertar Nombre Cliente"
                            value={nombreCliente}
                            onChange={(e) => setNombreCliente(e.target.value)}
                            onBlur={() => markTouched('nombreCliente')}
                        />
                    </div>
                    {/* Empty placeholder field on the right as per image */}
                    <div className="form-group">
                        <div className="custom-input" style={{ visibility: 'hidden' }}></div>
                    </div>

                    {/* Row 3 */}
                    <div className="form-group">
                        <label>Email</label>
                        {touched.email && !validateEmail(email) && (
                            <div className="field-error-message">Email no válido</div>
                        )}
                        <input
                            className={`custom-input ${touched.email && !validateEmail(email) ? 'input-invalid' : ''}`}
                            placeholder="Insertar Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => markTouched('email')}
                        />
                    </div>
                    <div></div>

                    {/* Submit row as bottom spacer/extra field as seen in mockup */}
                    <div className="form-group" style={{ gridColumn: 'span 1', marginTop: '20px' }}>
                        <div className="custom-input" style={{ visibility: 'hidden' }}></div>
                    </div>

                    <div className="form-actions">
                        <button
                            className="btn-action"
                            onClick={() => handleAction('create')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Crear Clientes"}
                        </button>
                        <button
                            className="btn-action"
                            onClick={() => handleAction('update')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Actualizar Clientes"}
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

export default Clients;
