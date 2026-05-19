import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/Animal.css';

const Animal: React.FC = () => {
    const navigate = useNavigate();

    const [dniCliente, setDniCliente] = useState<string>("");
    const [nombre, setNombre] = useState<string>("");
    const [especie, setEspecie] = useState<string>("");
    const [estado, setEstado] = useState<string>("INTAKE");
    const [foto, setFoto] = useState<string>("");
    const [idCentro, setIdCentro] = useState<string>("");
    
    const [centers, setCenters] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);

    const [animals, setAnimals] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false); 
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [animalsData, centersData, clientsData] = await Promise.all([
                    vetService.getAnimals(),
                    vetService.getCenters(),
                    vetService.getClients()
                ]);
                setAnimals(animalsData || []);
                setCenters(centersData || []);
                setClients(clientsData || []);
                if (centersData?.length > 0 && !idCentro) {
                    setIdCentro(centersData[0].id);
                }
            } catch (err: any) {
                console.error("Error loading data", err);
            }
        };
        fetchData();
    }, []);

    const handleSelectAnimal = (animal: any) => {
        setDniCliente(animal.client?.dni || "");
        setNombre(animal.name || "");
        setEspecie(animal.species || "");
        setEstado(animal.status || "INTAKE");
        setFoto(animal.animal_image || "");
        setIdCentro(animal.center_id || "");
        setSelectedAnimalId(animal.id);
        setSearchTerm("");
    };

    const filteredAnimals = searchTerm.length > 0
        ? animals.filter(animal => 
            animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            animal.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            animal.id?.toLowerCase().includes(searchTerm.toLowerCase())
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
            nombre: true,
            especie: true,
            estado: true,
            foto: true,
            idCentro: true
        };
        setTouched(allTouched);

        if (!nombre || !especie || !estado || !idCentro) {
            setMessage("Por favor, completa los campos principales (Nombre, Especie, Estado y Centro)");
            setShowToast(true);
            return;
        }

        if (dniCliente && !validateDNI(dniCliente)) {
            setMessage("El DNI introducido no es válido");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            let clientId = null;
            if (dniCliente) {
                const client = clients.find(c => c.dni.toUpperCase() === dniCliente.toUpperCase());
                if (!client) {
                    setMessage("No se encontró ningún cliente con el DNI proporcionado");
                    setShowToast(true);
                    setLoading(false);
                    return;
                }
                clientId = client.id;
            }

            const animalData = {
                client_id: clientId,
                center_id: idCentro,
                name: nombre,
                species: especie,
                status: estado,
                animal_image: foto
            };

            if (type === 'create') {
                await vetService.createAnimal(animalData);
                setMessage("Animal creado correctamente");
            } else {
                if (!selectedAnimalId) {
                    setMessage("Por favor, busca y selecciona un animal para actualizar");
                    setShowToast(true);
                    setLoading(false);
                    return;
                }
                await vetService.updateAnimal(selectedAnimalId, animalData);
                setMessage("Animal actualizado correctamente");
            }
            setShowToast(true);
            if (type === 'create') setTimeout(() => navigate('/listado-animales'), 1500);
        } catch (err: any) {
            setMessage(err.userMessage || "Error al procesar la solicitud");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="animal-page-container">
                <div className="animal-header">
                    <h1>Gestión Animal</h1>
                    <button
                        className="btn-listado-animales"
                        onClick={() => navigate('/listado-animales')}
                    >
                        Listado Animales <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="secondary-search-container">
                    <IonIcon icon={searchOutline} className="secondary-search-icon" />
                    <input 
                        type="text" 
                        placeholder="Buscar animal por nombre, especie o ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {filteredAnimals.length > 0 && (
                        <div className="search-results-dropdown">
                            {filteredAnimals.map(animal => (
                                <div 
                                    key={animal.id} 
                                    className="search-result-item"
                                    onClick={() => handleSelectAnimal(animal)}
                                >
                                    <span className="employee-name">{animal.name}</span>
                                    <span className="employee-detail">{animal.species} | DNI: {animal.client?.dni || 'Global'}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="divider"></div>

                <div className="animal-form">
                    <div className="form-group">
                        <label>DNI Cliente (Opcional)</label>
                        {dniCliente && touched.dniCliente && !validateDNI(dniCliente) && (
                            <div className="field-error-message">DNI no válido (8 números y letra)</div>
                        )}
                        <input
                            className={`custom-input ${dniCliente && touched.dniCliente && !validateDNI(dniCliente) ? 'input-invalid' : ''}`}
                            placeholder="Insertar DNI del Dueño"
                            value={dniCliente}
                            onChange={(e) => setDniCliente(e.target.value)}
                            onBlur={() => markTouched('dniCliente')}
                        />
                    </div>

                    <div className="form-group">
                        <label>Nombre del Animal</label>
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

                    <div className="form-group">
                        <label>Especie</label>
                        {touched.especie && !especie && (
                            <div className="field-error-message">Campo obligatorio</div>
                        )}
                        <input
                            className={`custom-input ${touched.especie && !especie ? 'input-invalid' : ''}`}
                            placeholder="Ej: Perro, Gato..."
                            value={especie}
                            onChange={(e) => setEspecie(e.target.value)}
                            onBlur={() => markTouched('especie')}
                        />
                    </div>

                    <div className="form-group">
                        <label>Estado</label>
                        <select
                            className="custom-input"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                        >
                            <option value="INTAKE">Ingreso</option>
                            <option value="IN_TREATMENT">En Tratamiento</option>
                            <option value="READY_FOR_ADOPTION">Listo para Adopción</option>
                            <option value="RESERVED">Reservado</option>
                            <option value="ADOPTED">Adoptado</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Centro</label>
                        <select
                            className="custom-input"
                            value={idCentro}
                            onChange={(e) => setIdCentro(e.target.value)}
                        >
                            {centers.map(center => (
                                <option key={center.id} value={center.id}>
                                    {center.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Foto (URL)</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar URL de la foto"
                            value={foto}
                            onChange={(e) => setFoto(e.target.value)}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            className="btn-action"
                            onClick={() => handleAction('create')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Crear Animal"}
                        </button>
                        <button
                            className="btn-action"
                            onClick={() => handleAction('update')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Actualizar Animal"}
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

export default Animal;
