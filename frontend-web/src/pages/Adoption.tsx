import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../theme/css/Adoption.css';

const Adoption: React.FC = () => {
    const navigate = useNavigate();

    // State for form fields based on mockup
    const [dniCliente, setDniCliente] = useState<string>("");
    const [nombreAnimal, setNombreAnimal] = useState<string>("");
    const [descripcionLeft, setDescripcionLeft] = useState<string>("");
    const [descripcionRight, setDescripcionRight] = useState<string>("");
    const [psologia, setPsologia] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);

    const handleAction = async (type: 'create' | 'update') => {
        if (!dniCliente || !nombreAnimal) {
            setMessage("Por favor, completa los campos obligatorios");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            console.log(`${type === 'create' ? 'Creando' : 'Actualizando'} adopción:`, {
                dniCliente, nombreAnimal, descripcionLeft, descripcionRight, psologia
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            setMessage(`Adopción ${type === 'create' ? 'creada' : 'actualizada'} correctamente`);
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
                    <input type="text" placeholder="Buscar" />
                </div>

                <div className="divider"></div>

                <div className="adoption-form">
                    {/* Top Row */}
                    <div className="form-group">
                        <label>DNI Cliente</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar DNI Cliente"
                            value={dniCliente}
                            onChange={(e) => setDniCliente(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Descripción"
                            value={descripcionRight}
                            onChange={(e) => setDescripcionRight(e.target.value)}
                        />
                    </div>

                    {/* Mid Row */}
                    <div className="form-group">
                        <label>Nombre Animal</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Nombre Animal"
                            value={nombreAnimal}
                            onChange={(e) => setNombreAnimal(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Psología</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Psologia"
                            value={psologia}
                            onChange={(e) => setPsologia(e.target.value)}
                        />
                    </div>

                    {/* Bottom Row */}
                    <div className="form-group">
                        <label>Descripcion</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Descripcion"
                            value={descripcionLeft}
                            onChange={(e) => setDescripcionLeft(e.target.value)}
                        />
                    </div>
                    <div></div> {/* Empty for alignment */}

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
