import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { IonIcon, IonToast } from '@ionic/react';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../theme/css/Animal.css';

const Animal: React.FC = () => {
    const navigate = useNavigate();

    // State for form fields
    const [dniCliente, setDniCliente] = useState<string>("");
    const [nombre, setNombre] = useState<string>("");
    const [especie, setEspecie] = useState<string>("");
    const [estado, setEstado] = useState<string>("");
    const [codigoEdad, setCodigoEdad] = useState<string>("");
    const [sexo, setSexo] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");
    const [foto, setFoto] = useState<string>("");

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
            dniCliente: true,
            nombre: true,
            especie: true,
            estado: true,
            codigoEdad: true,
            sexo: true,
            descripcion: true,
            foto: true
        };
        setTouched(allTouched);

        if (!dniCliente || !nombre || !especie || !estado || !codigoEdad || !sexo || !descripcion || !foto) {
            setMessage("Por favor, completa todos los campos obligatorios");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            console.log(`${type === 'create' ? 'Creando' : 'Actualizando'} animal:`, {
                dniCliente, nombre, especie, estado, codigoEdad, sexo, descripcion, foto
            });

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            setMessage(`Animal ${type === 'create' ? 'creado' : 'actualizado'} correctamente`);
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
                    <input type="text" placeholder="Buscar" />
                </div>

                <div className="divider"></div>

                <div className="animal-form">
                    {/* Left Column */}
                    <div className="form-group">
                        <label>DNI Cliente</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Codigo"
                            value={dniCliente}
                            onChange={(e) => setDniCliente(e.target.value)}
                            onBlur={() => markTouched('dniCliente')}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="form-group">
                        <label>Codigo Edad</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Edad"
                            value={codigoEdad}
                            onChange={(e) => setCodigoEdad(e.target.value)}
                            onBlur={() => markTouched('codigoEdad')}
                        />
                    </div>

                    {/* Left Column */}
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            onBlur={() => markTouched('nombre')}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="form-group">
                        <label>Sexo</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Sexo"
                            value={sexo}
                            onChange={(e) => setSexo(e.target.value)}
                            onBlur={() => markTouched('sexo')}
                        />
                    </div>

                    {/* Left Column */}
                    <div className="form-group">
                        <label>Especie</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Especie"
                            value={especie}
                            onChange={(e) => setEspecie(e.target.value)}
                            onBlur={() => markTouched('especie')}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="form-group">
                        <label>Descripcion</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            onBlur={() => markTouched('descripcion')}
                        />
                    </div>

                    {/* Left Column */}
                    <div className="form-group">
                        <label>Estado</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar Estado"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            onBlur={() => markTouched('estado')}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="form-group">
                        <label>foto</label>
                        <input
                            className="custom-input"
                            placeholder="Insertar foto"
                            value={foto}
                            onChange={(e) => setFoto(e.target.value)}
                            onBlur={() => markTouched('foto')}
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
