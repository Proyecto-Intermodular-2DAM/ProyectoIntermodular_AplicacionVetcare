import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
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
            console.log(`${type === 'create' ? 'Creando' : 'Actualizando'} cita:`, {
                nombreCliente, idAnimal, dniCliente, fechaHora, idCita, sala, motivo
            });

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            setMessage(`Cita ${type === 'create' ? 'creada' : 'actualizada'} correctamente`);
            setShowToast(true);
        } catch (err) {
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
                    <input type="text" placeholder="Buscar" />
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
