import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import apiClient from '../services/apiClient';
import '../theme/css/Employee.css';

const Center: React.FC = () => {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState<string>("");
    const [codigoPostal, setCodigoPostal] = useState<string>("");
    const [direccion, setDireccion] = useState<string>("");

    const [centers, setCenters] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    React.useEffect(() => {
        const fetchCenters = async () => {
            try {
                const data = await vetService.getCenters();
                setCenters(data || []);
            } catch (err: any) {
                console.error("Error loading centers", err);
            }
        };
        fetchCenters();
    }, []);

    const handleSelectCenter = (center: any) => {
        setNombre(center.name || "");
        setCodigoPostal(center.postcode || "");
        setDireccion(center.address || "");
        setSelectedCenterId(center.id);
        setSearchTerm("");
    };

    const filteredCenters = searchTerm.length > 0
        ? centers.filter(center => 
            center.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            center.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            center.postcode?.toLowerCase().includes(searchTerm.toLowerCase())
          ).slice(0, 5)
        : [];

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
            const centerData = {
                name: nombre,
                postcode: codigoPostal,
                address: direccion
            };

            if (type === 'create') {
                await vetService.createCenter(centerData); 
                setMessage("Registro creado correctamente");
            } else {
                if (!selectedCenterId) {
                    setMessage("Por favor, busca y selecciona un centro para actualizar");
                    setShowToast(true);
                    setLoading(false);
                    return;
                }
                await vetService.updateCenter(selectedCenterId, centerData);
                setMessage("Registro actualizado correctamente");
            }
            setShowToast(true);
            setTimeout(() => navigate('/listado-centros'), 1500);
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
                    <input 
                        type="text" 
                        placeholder="Buscar centro por nombre, dirección o CP..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {filteredCenters.length > 0 && (
                        <div className="search-results-dropdown">
                            {filteredCenters.map(center => (
                                <div 
                                    key={center.id} 
                                    className="search-result-item"
                                    onClick={() => handleSelectCenter(center)}
                                >
                                    <span className="employee-name">{center.name}</span>
                                    <span className="employee-detail">{center.address} | CP: {center.postcode}</span>
                                </div>
                            ))}
                        </div>
                    )}
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
