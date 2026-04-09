import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/Clients.css';

const Clients: React.FC = () => {
    const navigate = useNavigate();

    // State for form fields as per image
    const [dniCliente, setDniCliente] = useState<string>("");
    const [nombreCliente, setNombreCliente] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telefono, setTelefono] = useState<string>("");

    const [clients, setClients] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    React.useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await vetService.getClients();
                setClients(data || []);
            } catch (err: any) {
                console.error("Error loading clients", err);
            }
        };
        fetchClients();
    }, []);

    const handleSelectClient = (client: any) => {
        setDniCliente(client.dni || "");
        setNombreCliente(`${client.first_name || ""} ${client.last_name || ""}`.trim());
        setEmail(client.email || "");
        setTelefono(client.phone || "");
        setSelectedClientId(client.id);
        setSearchTerm("");
    };

    const filteredClients = searchTerm.length > 0
        ? clients.filter(c => 
            c.dni?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
            const clientData = {
                dni: dniCliente,
                first_name: nombreCliente,
                email: email,
                phone: telefono,
                role: 'Cliente'
            };

            if (type === 'create') {
                await vetService.createClient(clientData);
                setMessage("Cliente creado correctamente");
            } else {
                if (!selectedClientId) {
                    setMessage("Por favor, busca y selecciona un cliente para actualizar");
                    setShowToast(true);
                    setLoading(false);
                    return;
                }
                await vetService.updateClient(selectedClientId, clientData);
                setMessage("Cliente actualizado correctamente");
            }
            setShowToast(true);
            if (type === 'create') setTimeout(() => navigate('/listado-clientes'), 1500);
        } catch (err: any) {
            setMessage(err.userMessage || "Error al procesar la solicitud");
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
                    <input 
                        type="text" 
                        placeholder="Buscar cliente por DNI, nombre o email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {filteredClients.length > 0 && (
                        <div className="search-results-dropdown">
                            {filteredClients.map(client => (
                                <div 
                                    key={client.id} 
                                    className="search-result-item"
                                    onClick={() => handleSelectClient(client)}
                                >
                                    <span className="employee-name">{client.first_name} {client.last_name}</span>
                                    <span className="employee-detail">DNI: {client.dni} | Email: {client.email}</span>
                                </div>
                            ))}
                        </div>
                    )}
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
