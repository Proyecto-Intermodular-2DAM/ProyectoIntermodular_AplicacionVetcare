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
    const [dniAdopter, setDniAdopter] = useState<string>("");
    const [nombreAnimal, setNombreAnimal] = useState<string>("");
    const [idProcessedBy, setIdProcessedBy] = useState<string>("");
    const [comments, setComments] = useState<string>("");
    const [adoptionDate, setAdoptionDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const [clients, setClients] = useState<any[]>([]);
    const [animals, setAnimals] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);

    const [adoptions, setAdoptions] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedAdoptionId, setSelectedAdoptionId] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [ahData, cliData, aniData, empData] = await Promise.all([
                    vetService.getAdoptionHistory(),
                    vetService.getClients(),
                    vetService.getAnimals(),
                    vetService.getEmployees()
                ]);
                setAdoptions(ahData || []);
                setClients(cliData || []);
                setAnimals(aniData || []);
                setEmployees(empData || []);
                if (empData?.length > 0 && !idProcessedBy) {
                    setIdProcessedBy(empData[0].id);
                }
            } catch (err: any) {
                console.error("Error loading data", err);
            }
        };
        fetchData();
    }, []);

    const handleSelectAdoption = (adoption: any) => {
        setDniAdopter(adoption.new_owner?.dni || "");
        setNombreAnimal(adoption.animal?.name || "");
        setIdProcessedBy(adoption.processed_by || "");
        setComments(adoption.comments || "");
        setAdoptionDate(adoption.adoption_date ? adoption.adoption_date.split('T')[0] : "");
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
            dniAdopter: true,
            nombreAnimal: true,
            idProcessedBy: true,
            comments: true,
            adoptionDate: true
        };
        setTouched(allTouched);

        if (!dniAdopter || !nombreAnimal || !idProcessedBy || !comments || !adoptionDate) {
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
            // Find Animal
            const animal = animals.find(a => a.name.toLowerCase() === nombreAnimal.toLowerCase());
            // Find New Owner (Client)
            const newOwner = clients.find(c => c.dni.toUpperCase() === dniAdopter.toUpperCase());

            if (!animal) {
                setMessage("No se encontró el animal '" + nombreAnimal + "'");
                setShowToast(true);
                setLoading(false);
                return;
            }
            if (!newOwner) {
                setMessage("No se encontró el adoptante con DNI " + dniAdopter);
                setShowToast(true);
                setLoading(false);
                return;
            }

            const adoptionData = {
                animal_id: animal.id,
                new_owner_id: newOwner.id,
                processed_by: idProcessedBy,
                adoption_date: adoptionDate,
                comments: comments
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
                    <div className="form-grid">
                        <div className="form-group">
                            <label>DNI Adoptante</label>
                            {touched.dniAdopter && !validateDNI(dniAdopter) && (
                                <div className="field-error-message">DNI no válido</div>
                            )}
                            <input
                                className={`custom-input ${touched.dniAdopter && !validateDNI(dniAdopter) ? 'input-invalid' : ''}`}
                                placeholder="DNI del nuevo dueño"
                                value={dniAdopter}
                                onChange={(e) => setDniAdopter(e.target.value)}
                                onBlur={() => markTouched('dniAdopter')}
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
                            <label>Procesado por</label>
                            <select
                                className="custom-input"
                                value={idProcessedBy}
                                onChange={(e) => setIdProcessedBy(e.target.value)}
                            >
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.first_name} {emp.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Fecha de Adopción</label>
                            <input
                                type="date"
                                className="custom-input"
                                value={adoptionDate}
                                onChange={(e) => setAdoptionDate(e.target.value)}
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Comentarios</label>
                            {touched.comments && !comments && (
                                <div className="field-error-message">Campo obligatorio</div>
                            )}
                            <textarea
                                className={`custom-input ${touched.comments && !comments ? 'input-invalid' : ''}`}
                                placeholder="Detalles de la adopción..."
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                onBlur={() => markTouched('comments')}
                            />
                        </div>
                    </div>

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
