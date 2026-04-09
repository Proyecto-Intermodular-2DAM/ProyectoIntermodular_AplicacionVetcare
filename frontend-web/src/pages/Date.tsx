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
    const [fechaHora, setFechaHora] = useState<string>("");
    const [idCita, setIdCita] = useState<string>("");
    const [sala, setSala] = useState<string>("");
    const [motivo, setMotivo] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const [appointments, setAppointments] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

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
        setNombreCliente(apt.client ? `${apt.client.first_name} ${apt.client.last_name}` : "");
        setIdAnimal(apt.animal_id || "");
        setDniCliente(apt.client?.dni || "");
        setFechaHora(new Date(apt.appointment_date).toLocaleDateString() + " " + apt.appointment_time);
        setSala(apt.room_id || ""); // Or room name if available
        setMotivo(apt.reason || "");
        setIdCita(apt.id);
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

    const handleAction = async (type: 'create' | 'update') => {
        setMessage("");
        const allTouched = {
            nombreCliente: true,
            idAnimal: true,
            dniCliente: true,
            fechaHora: true,
            idCita: true,
            sala: true,
            motivo: true
        };
        setTouched(allTouched);

        if (!nombreCliente || !idAnimal || !dniCliente || !fechaHora || !idCita || !sala || !motivo) {
            setMessage("Por favor, completa todos los campos obligatorios");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            const appointmentData = {
                // In a real app, you'd map these to the DB schema
                appointment_date: new Date().toISOString().split('T')[0], // Simplified
                appointment_time: "10:00", // Simplified
                reason: motivo,
                animal_id: idAnimal,
                // client_id would be needed too
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
                        <label>ID Animal</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar ID Animal"
                            value={idAnimal}
                            onChange={(e) => setIdAnimal(e.target.value)}
                            onBlur={() => markTouched('idAnimal')}
                        />
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
                        <label>Fecha/Hora</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Fecha"
                            value={fechaHora}
                            onChange={(e) => setFechaHora(e.target.value)}
                            onBlur={() => markTouched('fechaHora')}
                        />
                    </div>

                    {/* Row 3 */}
                    <div className="form-group">
                        <label>ID Cita</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar ID Cita"
                            value={idCita}
                            onChange={(e) => setIdCita(e.target.value)}
                            onBlur={() => markTouched('idCita')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Sala</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Sala"
                            value={sala}
                            onChange={(e) => setSala(e.target.value)}
                            onBlur={() => markTouched('sala')}
                        />
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
