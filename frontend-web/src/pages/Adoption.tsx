import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/Adoption.css';

const Adoption: React.FC = () => {
    const navigate = useNavigate();

    const [dniAdopter, setDniAdopter] = useState<string>("");
    const [idAnimal, setIdAnimal] = useState<string>("");
    const [nombreAnimal, setNombreAnimal] = useState<string>("");
    const [adoptionDate, setAdoptionDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [statusAnimal, setStatusAnimal] = useState<string>("ADOPTED");

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

            } catch (err: any) {
                console.error("Error loading data", err);
            }
        };
        fetchData();
    }, []);

    const handleSelectAdoption = (adoption: any) => {
        setDniAdopter(adoption.client?.dni || "");
        setIdAnimal(adoption.animal_id || "");
        setNombreAnimal(adoption.animal?.name || "");
        // Handle both possible field names for date
        const rawDate = adoption.adoption_date || adoption.date;
        setAdoptionDate(rawDate ? rawDate.split('T')[0] : "");
        setStatusAnimal(adoption.animal?.status || "ADOPTED");
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
            idAnimal: true,
            adoptionDate: true,
            statusAnimal: true
        };
        setTouched(allTouched);

        if (!dniAdopter || !idAnimal || !adoptionDate || !statusAnimal) {
            setMessage("Por favor, completa todos los campos obligatorios");
            setShowToast(true);
            return;
        }

        if (!validateDNI(dniAdopter)) {
            setMessage("El DNI introducido no es válido");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            const animal = animals.find(a => a.id === idAnimal);
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
                adopter_id: newOwner.id,
                date: adoptionDate,
                adoption_date: adoptionDate
            };

            if (type === 'create') {
                await vetService.createAdoption(adoptionData);
                // Also update animal status
                await vetService.updateAnimal(idAnimal, { status: statusAnimal });
                setMessage("Adopción creada y estado de animal actualizado correctamente");
            } else {
                if (!selectedAdoptionId) {
                    setMessage("Por favor, busca y selecciona una adopción para actualizar");
                    setShowToast(true);
                    setLoading(false);
                    return;
                }
                await vetService.updateAdoption(selectedAdoptionId, adoptionData);
                // Also update animal status
                await vetService.updateAnimal(idAnimal, { status: statusAnimal });
                setMessage("Adopción y estado de animal actualizados correctamente");
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
                            <label>Animal (Listo para adoptar)</label>
                            {touched.idAnimal && !idAnimal && (
                                <div className="field-error-message">Campo obligatorio</div>
                            )}
                            <select
                                className={`custom-input ${touched.idAnimal && !idAnimal ? 'input-invalid' : ''}`}
                                value={idAnimal}
                                onChange={(e) => {
                                    setIdAnimal(e.target.value);
                                    const selected = animals.find(a => a.id === e.target.value);
                                    if (selected) setNombreAnimal(selected.name);
                                }}
                                onBlur={() => markTouched('idAnimal')}
                            >
                                <option value="">Seleccionar Animal</option>
                                {animals
                                    .filter(a => a.status === 'READY_FOR_ADOPTION' || a.id === idAnimal)
                                    .map(a => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))
                                }
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

                        <div className="form-group">
                            <label>Nuevo Estado del Animal</label>
                            <select
                                className="custom-input"
                                value={statusAnimal}
                                onChange={(e) => setStatusAnimal(e.target.value)}
                            >
                                <option value="READY_FOR_ADOPTION">Listo para adoptar</option>
                                <option value="RESERVED">Reservado</option>
                                <option value="ADOPTED">Adoptado</option>
                            </select>
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
