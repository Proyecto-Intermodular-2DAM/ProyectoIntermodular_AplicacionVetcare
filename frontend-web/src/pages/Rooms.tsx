import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../theme/css/Rooms.css';

const Rooms: React.FC = () => {
    const navigate = useNavigate();

    // State for form fields based on the image provided
    const [dniCliente, setDniCliente] = useState<string>("");
    const [codigoCentro, setCodigoCentro] = useState<string>("");
    const [nombre, setNombre] = useState<string>("");
    const [extraField, setExtraField] = useState<string>(""); // Extra input shown at bottom of image

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);

    const handleAction = async (type: 'create' | 'update') => {
        if (!dniCliente || !codigoCentro || !nombre) {
            setMessage("Por favor, completa los campos principales");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            console.log(`${type === 'create' ? 'Creando' : 'Actualizando'} sala:`, {
                dniCliente, codigoCentro, nombre, extraField
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            setMessage(`Sala ${type === 'create' ? 'creada' : 'actualizada'} correctamente`);
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
                    <input type="text" placeholder="Buscar" />
                </div>

                <div className="divider"></div>

                <div className="rooms-form">
                    <div className="form-group">
                        <label>DNi Cliente</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Codigo"
                            value={dniCliente}
                            onChange={(e) => setDniCliente(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Codigo Centro</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Centro"
                            value={codigoCentro}
                            onChange={(e) => setCodigoCentro(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <div className="form-group" style={{ marginTop: '20px' }}>
                        {/* Empty label input as seen in lower part of the image mockup */}
                        <input
                            className="custom-input"
                            value={extraField}
                            onChange={(e) => setExtraField(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-actions-container">
                    <button
                        className="btn-action"
                        onClick={() => handleAction('create')}
                        disabled={loading}
                    >
                        {loading ? "Procesando..." : "Crear Salas"}
                    </button>
                    <button
                        className="btn-action"
                        onClick={() => handleAction('update')}
                        disabled={loading}
                    >
                        {loading ? "Procesando..." : "Actualizar Salas"}
                    </button>
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
