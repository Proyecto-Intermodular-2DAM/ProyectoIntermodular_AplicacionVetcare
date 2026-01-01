import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../theme/css/Treatment.css';

const Treatment: React.FC = () => {
    const navigate = useNavigate();

    // State for form fields
    const [dniCliente, setDniCliente] = useState<string>("");
    const [nombreAnimal, setNombreAnimal] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");
    const [medicamento, setMedicamento] = useState<string>("");
    const [psologia, setPsologia] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);

    const handleAction = async (type: 'create' | 'update') => {
        if (!dniCliente || !nombreAnimal || !medicamento) {
            setMessage("Por favor, completa los campos obligatorios");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            console.log(`${type === 'create' ? 'Creando' : 'Actualizando'} tratamiento:`, {
                dniCliente, nombreAnimal, descripcion, medicamento, psologia
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            setMessage(`Tratamiento ${type === 'create' ? 'creado' : 'actualizado'} correctamente`);
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
            <div className="treatment-page-container">
                <div className="treatment-header">
                    <h1>Gestión Tratamiento</h1>
                    <button
                        className="btn-listado-tratamientos"
                        onClick={() => navigate('/listado-tratamientos')}
                    >
                        Listado Tratamientos <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>

                <div className="secondary-search-container">
                    <IonIcon icon={searchOutline} className="secondary-search-icon" />
                    <input type="text" placeholder="Buscar" />
                </div>

                <div className="divider"></div>

                <div className="treatment-form">
                    {/* Left Column */}
                    <div className="form-group">
                        <label>DNi Cliente</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar DNI Cliente"
                            value={dniCliente}
                            onChange={(e) => setDniCliente(e.target.value)}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="form-group">
                        <label>Medicamento</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Medicamento"
                            value={medicamento}
                            onChange={(e) => setMedicamento(e.target.value)}
                        />
                    </div>

                    {/* Left Column */}
                    <div className="form-group">
                        <label>Nombre Animal</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Nombre Animal"
                            value={nombreAnimal}
                            onChange={(e) => setNombreAnimal(e.target.value)}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="form-group">
                        <label>Psologia</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Psologia"
                            value={psologia}
                            onChange={(e) => setPsologia(e.target.value)}
                        />
                    </div>

                    {/* Left Column */}
                    <div className="form-group">
                        <label>Descripcion</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                    </div>

                    {/* Right Column - Placeholder to keep grid structure parity with image */}
                    <div></div>


                    <div className="form-actions">
                        <button
                            className="btn-action"
                            onClick={() => handleAction('create')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Crear Tratamiento"}
                        </button>
                        <button
                            className="btn-action"
                            onClick={() => handleAction('update')}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Actualizar Tratamiento"}
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

export default Treatment;
