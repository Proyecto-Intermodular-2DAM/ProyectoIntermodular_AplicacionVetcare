import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../services/vetService';
import '../theme/css/Employee.css';

const Appointment: React.FC = () => {
    const navigate = useNavigate();

    const [idCita, setIdCita] = useState<string>(""); //TODO cambiar tipo a id
    const [idAnimal, setIdAnimal] = useState<string>(""); //TODO cambiar tipo a id
    const [dniCli, setDniCli] = useState<string>("");
    const [fechaHora, setFechaHora] = useState<string>(""); //TODO cambiar tipo a fecha
    const [sala, setSala] = useState<string>("");
    const [motivo, setMotivo] = useState<string>("");

    const [appointments, setAppointments] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    React.useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await vetService.getAppointments();
                setAppointments(data || []);
            } catch (err: any) {
                console.error("Error loading appointments", err);
            }
        };
        fetchAppointments();
    }, []);

    const handleSelectAppointment = (apt: any) => {
        setIdCita(apt.id || "");
        setIdAnimal(apt.animal_id || "");
        setDniCli(apt.client?.dni || "");
        setFechaHora(apt.appointment_date || "");
        setSala(apt.room_id || "");
        setMotivo(apt.reason || "");
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
            idCita: true,
            idAnimal: true,
            dniCli: true,
            fechaHora: true,
            sala: true,
            motivo: true
        };
        setTouched(allTouched);

        if (!idCita || !idAnimal || !dniCli || !fechaHora || !sala || !motivo) {
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
            const appointmentData = {
                reason: motivo,
                animal_id: idAnimal,
                appointment_date: fechaHora,
                room_id: sala
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

                    <div className="form-group">
                        <label>ID Cita</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar ID de la cita"
                            value={idCita}
                            onChange={(e) => setIdCita(e.target.value)}
                            onBlur={() => markTouched('idCita')}
                        />
                    </div>

                    <div className="form-group">
                        <label>ID Animal</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar ID del animal"
                            value={idAnimal}
                            onChange={(e) => setIdAnimal(e.target.value)}
                            onBlur={() => markTouched('idAnimal')}
                        />
                    </div>

                    <div className="form-group">
                        <label>DNI Cliente</label>
                        {touched.dniCli && !validateDNI(dniCli) && (
                            <div className="field-error-message">DNI no válido</div>
                        )}
                        <input
                            className={`custom-input ${
                                touched.dniCli && !validateDNI(dniCli) ? 'input-invalid' : ''
                            }`}
                            placeholder="Insertar DNI del cliente"
                            value={dniCli}
                            onChange={(e) => setDniCli(e.target.value)}
                            onBlur={() => markTouched('dniCli')}
                        />
                    </div>

                    <div className="form-group">
                        <label>Fecha y Hora</label>
                        <input
                            type="date"
                            className="custom-input"
                            value={fechaHora}
                            onChange={(e) => setFechaHora(e.target.value)}
                            onBlur={() => markTouched('fechaHora')}
                        />
                    </div>

                    <div className="form-group">
                        <label>Sala</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar sala"
                            value={sala}
                            onChange={(e) => setSala(e.target.value)}
                            onBlur={() => markTouched('sala')}
                        />
                    </div>

                    <div className="form-group">
                        <label>Motivo</label>
                        <textarea
                            className="custom-input"
                            placeholder="Insertar motivo de la cita"
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
