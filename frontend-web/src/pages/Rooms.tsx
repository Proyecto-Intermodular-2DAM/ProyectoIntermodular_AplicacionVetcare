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
    const [nombre, setNombre] = useState<string>("");
    const [idCentro, setIdCentro] = useState<string>("");
    const [centers, setCenters] = useState<any[]>([]);

    const [rooms, setRooms] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomsData, centersData] = await Promise.all([
                    vetService.getRooms(),
                    vetService.getCenters()
                ]);
                setRooms(roomsData || []);
                setCenters(centersData || []);
                if (centersData?.length > 0 && !idCentro) {
                    setIdCentro(centersData[0].id);
                }
            } catch (err: any) {
                console.error("Error loading data", err);
            }
        };
        fetchData();
    }, []);

    const handleSelectRoom = (room: any) => {
        setNombre(room.name || "");
        setIdCentro(room.center_id || "");
        setSelectedRoomId(room.id);
        setSearchTerm("");
    };

    const filteredRooms = searchTerm.length > 0
        ? rooms.filter(room =>
            room.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.center_code?.toLowerCase().includes(searchTerm.toLowerCase())
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
        const allTouched = { nombre: true, idCentro: true };
        setTouched(allTouched);

        if (!nombre || !idCentro) {
            setMessage("Por favor, completa los campos principales");
            setShowToast(true);
            return;
        }

        // Check for duplicate name in the same center
        const isDuplicate = rooms.some(r => 
            r.center_id === idCentro && 
            r.name.trim().toLowerCase() === nombre.trim().toLowerCase() &&
            r.id !== selectedRoomId
        );

        if (isDuplicate) {
            setMessage("Ya existe una sala con este nombre en el centro seleccionado");
            setShowToast(true);
            return;
        }

        // Check if center exists
        const selectedCenter = centers.find(c => c.id === idCentro);
        if (!selectedCenter) {
            setMessage("El centro seleccionado no existe");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            const roomData = {
                center_id: idCentro,
                name: nombre
            };

            if (type === 'create') {
                await vetService.createRoom(roomData);
                setMessage("Sala creada correctamente");
            } else {
                if (!selectedRoomId) {
                    setMessage("Por favor, busca y selecciona una sala para actualizar");
                    setShowToast(true);
                    setLoading(false);
                    return;
                }
                await vetService.updateRoom(selectedRoomId, roomData);
                setMessage("Sala actualizada correctamente");
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
                    <input
                        type="text"
                        placeholder="Buscar sala por nombre o centro..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {filteredRooms.length > 0 && (
                        <div className="search-results-dropdown">
                            {filteredRooms.map(room => (
                                <div
                                    key={room.id}
                                    className="search-result-item"
                                    onClick={() => handleSelectRoom(room)}
                                >
                                    <span className="employee-name">{room.name}</span>
                                    <span className="employee-detail">Centro: {room.center_code} | Tamaño: {room.size_m2}m²</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="divider"></div>

                <div className="rooms-form">
                    <div className="form-group">
                        <label>Nombre de la Sala</label>
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

                    <div className="form-actions-container">
                        <button
                            className="btn-action"
                            onClick={() => handleAction('create')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Crear Sala"}
                        </button>
                        <button
                            className="btn-action"
                            onClick={() => handleAction('update')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Actualizar Sala"}
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

export default Rooms;
