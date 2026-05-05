import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/Date.css';

const DatePage: React.FC = () => {
    const navigate = useNavigate();

    // State for form fields
    const [nombreCliente, setNombreCliente] = useState<string>("");
    const [idAnimal, setIdAnimal] = useState<string>("");
    const [dniCliente, setDniCliente] = useState<string>("");
    const [fecha, setFecha] = useState<string>("");
    const [hora, setHora] = useState<string>("");
    const [idCentro, setIdCentro] = useState<string>("");
    const [idSala, setIdSala] = useState<string>("");
    const [motivo, setMotivo] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [centers, setCenters] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [allClients, setAllClients] = useState<any[]>([]);
    const [allAnimals, setAllAnimals] = useState<any[]>([]);

    const [appointments, setAppointments] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [aptData, centerData, roomData, clientData, animalData] = await Promise.all([
                    vetService.getAppointments(),
                    vetService.getCenters(),
                    vetService.getRooms(),
                    vetService.getClients(),
                    vetService.getAnimals()
                ]);
                setAppointments(aptData || []);
                setCenters(centerData || []);
                setRooms(roomData || []);
                setAllClients(clientData || []);
                setAllAnimals(animalData || []);
                
                if (centerData?.length > 0) setIdCentro(centerData[0].id);
                if (roomData?.length > 0) setIdSala(roomData[0].id);
            } catch (err: any) {
                console.error("Error loading data", err);
            }
        };
        fetchData();
    }, []);

    React.useEffect(() => {
        if (dniCliente.length >= 8) {
            const client = allClients.find(c => c.dni?.toUpperCase() === dniCliente.toUpperCase());
            if (client) {
                setNombreCliente(`${client.first_name} ${client.last_name}`);
                
                // Auto-select animal if there's only one
                const clientAnimals = allAnimals.filter(a => a.client_id === client.id);
                if (clientAnimals.length === 1) {
                    setIdAnimal(clientAnimals[0].id);
                }
            }
        }
    }, [dniCliente, allClients, allAnimals]);

    const handleSelectAppointment = (apt: any) => {
        setNombreCliente(apt.client ? `${apt.client.first_name} ${apt.client.last_name}` : "");
        setIdAnimal(apt.animal_id || "");
        setDniCliente(apt.client?.dni || "");
        setFecha(apt.appointment_date || "");
        setHora(apt.appointment_time || "");
        
        // Find room and its center
        const room = rooms.find(r => r.id === apt.room_id);
        if (room) {
            setIdCentro(room.center_id || "");
            setIdSala(room.id);
        } else {
            setIdCentro("");
            setIdSala("");
        }
        
        setMotivo(apt.reason || "");
        setSelectedAppointmentId(apt.id);
        setSearchTerm("");
    };

    const getFilteredAnimals = () => {
        const client = allClients.find(c => c.dni?.toUpperCase() === dniCliente.toUpperCase());
        if (!client) return [];
        return allAnimals.filter(a => a.client_id === client.id);
    };

    const filteredAppointments = searchTerm.length > 0
        ? appointments.filter(apt => 
            apt.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.animal?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${apt.client?.first_name} ${apt.client?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
          ).slice(0, 5)
        : [];

    const markTouched = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleAction = async (type: 'create' | 'update') => {
        setMessage("");
        const allTouched = {
            nombreCliente: true,
            dniCliente: true,
            idAnimal: true,
            fecha: true,
            hora: true,
            idSala: true
        };
        setTouched(allTouched);

        const missingFields = [];
        if (!nombreCliente) missingFields.push("Cliente");
        if (!dniCliente) missingFields.push("DNI");
        if (!idAnimal) missingFields.push("Animal");
        if (!fecha) missingFields.push("Fecha");
        if (!hora) missingFields.push("Hora");
        if (!idSala) missingFields.push("Sala");

        if (missingFields.length > 0) {
            setMessage(`Por favor, completa los campos: ${missingFields.join(", ")}`);
            setShowToast(true);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Resolve Client ID from DNI
            const client = allClients.find(c => c.dni?.toUpperCase() === dniCliente.toUpperCase());
            if (!client) {
                setMessage("No se encontró el cliente con ese DNI");
                setShowToast(true);
                setLoading(false);
                return;
            }

            // animalId is already the ID since we use a select dropdown now
            const animalId = idAnimal;
            
            if (!animalId) {
                setMessage("Por favor, selecciona un animal");
                setShowToast(true);
                setLoading(false);
                return;
            }

            const appointmentData = {
                appointment_date: fecha,
                appointment_time: hora,
                reason: motivo,
                client_id: client.id,
                animal_id: animalId,
                room_id: idSala
            };

            if (type === 'create') {
                await vetService.createAppointment(appointmentData);
                setMessage("Cita creada correctamente");
            } else {
                if (!selectedAppointmentId) {
                    setMessage("Por favor, busca y selecciona una cita para actualizar");
                    setShowToast(true);
                    setLoading(false);
                    return;
                }
                await vetService.updateAppointment(selectedAppointmentId, appointmentData);
                setMessage("Cita actualizada correctamente");
            }
            setShowToast(true);
            setTimeout(() => navigate('/listado-citas'), 1500);
        } catch (err: any) {
            setMessage("Error al procesar la solicitud");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="date-page-container">
                <div className="date-header">
                    <h1>Gestión Citas</h1>
                    <button
                        className="btn-listado-citas"
                        onClick={() => navigate('/listado-citas')}
                    >
                        Listado Citas <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="secondary-search-container">
                    <IonIcon icon={searchOutline} className="secondary-search-icon" />
                    <input 
                        type="text" 
                        placeholder="Buscar cita por ID, Animal o Cliente..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {filteredAppointments.length > 0 && (
                        <div className="search-results-dropdown">
                            {filteredAppointments.map(apt => (
                                <div 
                                    key={apt.id} 
                                    className="search-result-item"
                                    onClick={() => handleSelectAppointment(apt)}
                                >
                                    <span className="employee-name">Animal: {apt.animal?.name || 'N/A'}</span>
                                    <span className="employee-detail">ID: {apt.id.substring(0, 8)} | Cliente: {apt.client ? `${apt.client.first_name} ${apt.client.last_name}` : 'N/A'}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="divider"></div>

                <div className="date-form">
                    {/* Row 1 */}
                    <div className="form-group">
                        <label>Nombre Cliente</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Nombre Cliente"
                            value={nombreCliente}
                            onChange={(e) => setNombreCliente(e.target.value)}
                            onBlur={() => markTouched('nombreCliente')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Animal</label>
                        <select
                            className="custom-input"
                            value={idAnimal}
                            onChange={(e) => setIdAnimal(e.target.value)}
                            onBlur={() => markTouched('idAnimal')}
                        >
                            <option value="">Seleccionar Animal</option>
                            {getFilteredAnimals().map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Row 2 */}
                    <div className="form-group">
                        <label>DNI Cliente</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar DNI Cliente"
                            value={dniCliente}
                            onChange={(e) => setDniCliente(e.target.value)}
                            onBlur={() => markTouched('dniCliente')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Fecha</label>
                        <input
                            type="date"
                            className="custom-input"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            onBlur={() => markTouched('fecha')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Hora</label>
                        <input
                            type="time"
                            className="custom-input"
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                            onBlur={() => markTouched('hora')}
                        />
                    </div>

                    {/* Row 3 */}
                    <div className="form-group">
                        <label>Centro</label>
                        <select
                            className="custom-input"
                            value={idCentro}
                            onChange={(e) => {
                                setIdCentro(e.target.value);
                                setIdSala(""); // Reset room when center changes
                            }}
                        >
                            <option value="">Seleccionar Centro</option>
                            {centers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Sala</label>
                        <select
                            className="custom-input"
                            value={idSala}
                            onChange={(e) => setIdSala(e.target.value)}
                            onBlur={() => markTouched('idSala')}
                        >
                            <option value="">Seleccionar Sala</option>
                            {rooms
                                .filter(r => !idCentro || r.center_id === idCentro)
                                .map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Row 4 - Full Width */}
                    <div className="form-group full-width">
                        <label>Motivo</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Motivo"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            onBlur={() => markTouched('motivo')}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            className="btn-action"
                            onClick={() => handleAction('create')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Crear Citas"}
                        </button>
                        <button
                            className="btn-action"
                            onClick={() => handleAction('update')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Actualizar Citas"}
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

export default DatePage;
