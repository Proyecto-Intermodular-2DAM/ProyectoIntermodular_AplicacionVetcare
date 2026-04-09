import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/Adoption.css';

const Adoption: React.FC = () => {
    const navigate = useNavigate();

    // State for form fields based on mockup
    const [dniCliente, setDniCliente] = useState<string>("");
    const [nombreAnimal, setNombreAnimal] = useState<string>("");
    const [descripcionLeft, setDescripcionLeft] = useState<string>("");
    const [descripcionRight, setDescripcionRight] = useState<string>("");
    const [psologia, setPsologia] = useState<string>("");

    const [adoptions, setAdoptions] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedAdoptionId, setSelectedAdoptionId] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    React.useEffect(() => {
        const fetchAdoptions = async () => {
            try {
                const data = await vetService.getAdoptionHistory();
                setAdoptions(data || []);
            } catch (err: any) {
                console.error("Error loading adoptions", err);
            }
        };
        fetchAdoptions();
    }, []);

    const handleSelectAdoption = (adoption: any) => {
        setDniCliente(adoption.client?.dni || "");
        setNombreAnimal(adoption.animal?.name || "");
        setPsologia(""); // Mapping logic depending on DB schema
        const comments = adoption.comments || "";
        const parts = comments.split(" - ");
        setDescripcionLeft(parts[0] || "");
        setDescripcionRight(parts[1] || "");
        setSelectedAdoptionId(adoption.id);
        setSearchTerm("");
    };

    const filteredAdoptions = searchTerm.length > 0
        ? adoptions.filter(a => 
            a.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.animal?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.client?.dni?.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleAction = async (type: 'create' | 'update') => {
        setMessage("");
        const allTouched = {
            dniCliente: true,
            nombreAnimal: true,
            descripcionLeft: true,
            descripcionRight: true,
            psologia: true
        };
        setTouched(allTouched);

        if (!dniCliente || !nombreAnimal || !descripcionLeft || !descripcionRight || !psologia) {
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
            const adoptionData = {
                client_dni: dniCliente,
                animal_name: nombreAnimal,
                comments: `${descripcionLeft} - ${descripcionRight}`,
                adoption_date: new Date().toISOString()
            };

            if (type === 'create') {
                await vetService.createAdoption(adoptionData);
                setMessage("Adopción creada correctamente");
            } else {
                if (!selectedAdoptionId) {
                    setMessage("Por favor, busca y selecciona una adopción para actualizar");
                    setShowToast(true);
                    setLoading(false);
                    return;
                }
                await vetService.updateAdoption(selectedAdoptionId, adoptionData);
                setMessage("Adopción actualizada correctamente");
            }
            setShowToast(true);
            if (type === 'create') setTimeout(() => navigate('/listado-adopcion'), 1500);
        } catch (err: any) {
            setMessage(err.userMessage || "Error al procesar la solicitud");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="adoption-page-container">
                <div className="adoption-header">
                    <h1>Gestión Adopción</h1>
                    <button
                        className="btn-listado-adopcion"
                        onClick={() => navigate('/listado-adopcion')}
                    >
                        Listado Adopción <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="secondary-search-container">
                    <IonIcon icon={searchOutline} className="secondary-search-icon" />
                    <input 
                        type="text" 
                        placeholder="Buscar adopción por ID, animal o DNI..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {filteredAdoptions.length > 0 && (
                        <div className="search-results-dropdown">
                            {filteredAdoptions.map(a => (
                                <div 
                                    key={a.id} 
                                    className="search-result-item"
                                    onClick={() => handleSelectAdoption(a)}
                                >
                                    <span className="employee-name">Animal: {a.animal?.name || 'N/A'}</span>
                                    <span className="employee-detail">DNI: {a.client?.dni || 'N/A'} | ID: {a.id.substring(0, 8)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="divider"></div>

                <div className="adoption-form">
                    {/* Top Row */}
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
                        <label>Descripción</label>
                        {touched.descripcionRight && !descripcionRight && (
                            <div className="field-error-message">Campo obligatorio</div>
                        )}
                        <input
                            className={`custom-input ${touched.descripcionRight && !descripcionRight ? 'input-invalid' : ''}`}
                            placeholder="Insertar Descripción"
                            value={descripcionRight}
                            onChange={(e) => setDescripcionRight(e.target.value)}
                            onBlur={() => markTouched('descripcionRight')}
                        />
                    </div>

                    {/* Mid Row */}
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
                    <div className="form-group">
                        <label>Psología</label>
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

                    {/* Bottom Row */}
                    <div className="form-group">
                        <label>Descripcion</label>
                        {touched.descripcionLeft && !descripcionLeft && (
                            <div className="field-error-message">Campo obligatorio</div>
                        )}
                        <input
                            className={`custom-input ${touched.descripcionLeft && !descripcionLeft ? 'input-invalid' : ''}`}
                            placeholder="Insertar Descripcion"
                            value={descripcionLeft}
                            onChange={(e) => setDescripcionLeft(e.target.value)}
                            onBlur={() => markTouched('descripcionLeft')}
                        />
                    </div>
                    <div></div> {/* Empty for alignment */}

                    <div className="form-actions">
                        <button
                            className="btn-action"
                            onClick={() => handleAction('create')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Crear Adopción"}
                        </button>
                        <button
                            className="btn-action"
                            onClick={() => handleAction('update')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Actualizar Adopción"}
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

export default Adoption;
