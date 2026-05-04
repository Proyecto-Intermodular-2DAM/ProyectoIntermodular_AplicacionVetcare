import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/Employee.css';

const Appointment: React.FC = () => {
    const navigate = useNavigate();

    const [idAnimal, setIdAnimal] = useState<string>(""); 
    const [dniCli, setDniCli] = useState<string>("");
    const [fecha, setFecha] = useState<string>("");
    const [hora, setHora] = useState<string>("");
    const [idSala, setIdSala] = useState<string>("");
    const [motivo, setMotivo] = useState<string>("");
    const [estado, setEstado] = useState<string>("PENDING");

    const [clients, setClients] = useState<any[]>([]);
    const [animalsList, setAnimalsList] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);

    const [appointments, setAppointments] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [aptData, cliData, aniData, roomData] = await Promise.all([
                    vetService.getAppointments(),
                    vetService.getClients(),
                    vetService.getAnimals(),
                    vetService.getRooms()
                ]);
                setAppointments(aptData || []);
                setClients(cliData || []);
                setAnimalsList(aniData || []);
                setRooms(roomData || []);
                if (roomData?.length > 0 && !idSala) {
                    setIdSala(roomData[0].id);
                }
            } catch (err: any) {
                console.error("Error loading data", err);
            }
        };
        fetchData();
    }, []);

    const handleSelectAppointment = (apt: any) => {
        setIdAnimal(apt.animal?.name || "");
        setDniCli(apt.client?.dni || "");
        setFecha(apt.appointment_date || "");
        setHora(apt.appointment_time || "");
        setIdSala(apt.room_id || "");
        setMotivo(apt.reason || "");
        setEstado(apt.status || "PENDING");
        setSelectedAppointmentId(apt.id);
        setSearchTerm("");
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
            idAnimal: true,
            dniCli: true,
            fecha: true,
            hora: true,
            idSala: true,
            motivo: true
        };
        setTouched(allTouched);

        if (!idAnimal || !dniCli || !fecha || !hora || !idSala || !motivo) {
            setMessage("Por favor, completa todos los campos obligatorios");
            setShowToast(true);
            return;
        }

        if (!validateDNI(dniCli)) {
            setMessage("El DNI del cliente no es válido");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            // Resolve Client
            const client = clients.find(c => c.dni.toUpperCase() === dniCli.toUpperCase());
            if (!client) {
                setMessage("No se encontró el cliente con ese DNI");
                setShowToast(true);
                setLoading(false);
                return;
            }

            // Resolve Animal (owned by this client)
            const animal = animalsList.find(a => 
                a.client_id === client.id && 
                a.name.toLowerCase() === idAnimal.toLowerCase()
            );
            
            if (!animal) {
                setMessage("No se encontró el animal '" + idAnimal + "' para este cliente");
                setShowToast(true);
                setLoading(false);
                return;
            }

            const appointmentData = {
                reason: motivo,
                client_id: client.id,
                animal_id: animal.id,
                appointment_date: fecha,
                appointment_time: hora,
                room_id: idSala,
                status: estado
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
                    <h1>Gestión Citas</h1>
                    <button
                        className="btn-listado-centros"
                        onClick={() => navigate('/listado-citas')}
                    >
                        Listado Citas <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="secondary-search-container">
                    <IonIcon icon={searchOutline} className="secondary-search-icon" />
                    <input 
                        type="text" 
                        placeholder="Buscar cita por ID, animal o cliente..." 
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
                                    <span className="employee-detail">Cliente: {apt.client ? `${apt.client.first_name} ${apt.client.last_name}` : 'N/A'} | ID: {apt.id.substring(0, 8)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="divider"></div>

                <div className="employee-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>DNI Cliente</label>
                            {touched.dniCli && !validateDNI(dniCli) && (
                                <div className="field-error-message">DNI no válido</div>
                            )}
                            <input
                                className={`custom-input ${touched.dniCli && !validateDNI(dniCli) ? 'input-invalid' : ''}`}
                                placeholder="DNI del cliente"
                                value={dniCli}
                                onChange={(e) => setDniCli(e.target.value)}
                                onBlur={() => markTouched('dniCli')}
                            />
                        </div>

                        <div className="form-group">
                            <label>Nombre Animal</label>
                            {touched.idAnimal && !idAnimal && (
                                <div className="field-error-message">Campo obligatorio</div>
                            )}
                            <input
                                className={`custom-input ${touched.idAnimal && !idAnimal ? 'input-invalid' : ''}`}
                                placeholder="Nombre del animal"
                                value={idAnimal}
                                onChange={(e) => setIdAnimal(e.target.value)}
                                onBlur={() => markTouched('idAnimal')}
                            />
                        </div>

                        <div className="form-group">
                            <label>Fecha</label>
                            {touched.fecha && !fecha && (
                                <div className="field-error-message">Campo obligatorio</div>
                            )}
                            <input
                                type="date"
                                className={`custom-input ${touched.fecha && !fecha ? 'input-invalid' : ''}`}
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                onBlur={() => markTouched('fecha')}
                            />
                        </div>

                        <div className="form-group">
                            <label>Hora</label>
                            {touched.hora && !hora && (
                                <div className="field-error-message">Campo obligatorio</div>
                            )}
                            <input
                                type="time"
                                className={`custom-input ${touched.hora && !hora ? 'input-invalid' : ''}`}
                                value={hora}
                                onChange={(e) => setHora(e.target.value)}
                                onBlur={() => markTouched('hora')}
                            />
                        </div>

                        <div className="form-group">
                            <label>Sala</label>
                            <select
                                className="custom-input"
                                value={idSala}
                                onChange={(e) => setIdSala(e.target.value)}
                            >
                                {rooms.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Estado</label>
                            <select
                                className="custom-input"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                            >
                                <option value="PENDING">Pendiente</option>
                                <option value="CONFIRMED">Confirmada</option>
                                <option value="COMPLETED">Completada</option>
                                <option value="CANCELLED">Cancelada</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Motivo</label>
                            {touched.motivo && !motivo && (
                                <div className="field-error-message">Campo obligatorio</div>
                            )}
                            <textarea
                                className={`custom-input ${touched.motivo && !motivo ? 'input-invalid' : ''}`}
                                placeholder="Motivo de la cita"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                onBlur={() => markTouched('motivo')}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            className="btn-action"
                            onClick={() => handleAction('create')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Crear Cita"}
                        </button>
                        <button
                            className="btn-action"
                            onClick={() => handleAction('update')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Actualizar Cita"}
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

export default Appointment;
