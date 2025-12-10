import React from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { paw } from 'ionicons/icons';
import '../theme/css/LegalTerms.css';
import TopBar from '../components/TopBar';

const LegalTerms: React.FC = () => {
    return (
        <IonPage>
            <TopBar />

            <IonContent className="legal-terms-page" fullscreen>
                <div className="legal-title-container">
                    <h1 className="legal-main-title">Condiciones<br />legales</h1>
                    <IonIcon icon={paw} className="legal-paw-icon" />
                </div>

                <div className="legal-content-container">
                    <div className="legal-section-title">1. Información General</div>
                    <p className="legal-text">
                        La presente aplicación móvil VetCare (en adelante, “la App”) es operada por VetCare, con domicilio en Elche (Alicante), España, y tiene como finalidad ofrecer servicios veterinarios, agendar citas, compartir información sobre salud animal y facilitar la comunicación entre clientes y profesionales veterinarios.
                    </p>
                    <p className="legal-text">
                        El uso de la App implica la aceptación plena y sin reservas de estos Términos y Condiciones. Si el usuario no está de acuerdo con alguna de las disposiciones aquí establecidas, deberá abstenerse de utilizar la App.
                    </p>

                    <div className="legal-section-title">2. Uso de la Aplicación</div>
                    <p className="legal-text">
                        El usuario se compromete a utilizar la App de forma lícita, conforme a la legislación española vigente, a la buena fe y al orden público.
                    </p>
                    <ul className="legal-list">
                        <li>El usuario se compromete a utilizar la App de forma lícita, conforme a la legislación española vigente, a la buena fe y al orden público.</li>
                        <li>Está prohibido utilizar la App para fines fraudulentos, lesivos o que puedan dañar la imagen o reputación de VetCare.</li>
                        <li>El acceso a algunos servicios puede requerir el registro del usuario, quien deberá proporcionar información veraz, actualizada y completa.</li>
                    </ul>

                    <div className="legal-section-title">3. Servicios Ofrecidos</div>
                    <p className="legal-text">
                        A través de la App, VetCare puede ofrecer:
                    </p>
                    <ul className="legal-list">
                        <li>Reserva y gestión de citas veterinarias.</li>
                        <li>Acceso al historial médico de mascotas (según disponibilidad).</li>
                        <li>Información educativa sobre el cuidado animal.</li>
                        <li>Comunicación directa con profesionales veterinarios.</li>
                    </ul>
                    <p className="legal-text">
                        Los servicios pueden variar sin previo aviso, y VetCare se reserva el derecho de modificarlos, suspenderlos o cancelarlos en cualquier momento.
                    </p>

                    <div className="legal-section-title">4. Propiedad Intelectual</div>
                    <p className="legal-text">
                        Todos los contenidos, diseños, logotipos, textos, imágenes y bases de datos presentes en la App son propiedad exclusiva de VetCare o de sus licenciantes, y están protegidos por la normativa española y europea en materia de propiedad intelectual e industrial. Queda estrictamente prohibida su reproducción, distribución o modificación sin autorización previa por escrito.
                    </p>

                    <div className="legal-section-title">5. Protección de Datos Personales</div>
                    <p className="legal-text">
                        El tratamiento de los datos personales de los usuarios se realizará conforme a la Política de Privacidad de VetCare, en cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).
                    </p>
                    <p className="legal-text">
                        El usuario consiente expresamente que sus datos sean utilizados con el fin de gestionar los servicios solicitados y mejorar la experiencia de uso de la App.
                    </p>
                    <p className="legal-text">
                        Para ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación o portabilidad, el usuario puede enviar una solicitud al correo vetcare2000@gmail.com.
                    </p>

                    <div className="legal-section-title">6. Responsabilidad</div>
                    <p className="legal-text">
                        VetCare no garantiza la disponibilidad continua de la App ni se hace responsable de interrupciones temporales, errores técnicos o pérdida de información derivada del uso de la misma. Asimismo, no se responsabiliza de los daños o perjuicios derivados del uso indebido de la App o de la información proporcionada por terceros.
                    </p>

                    <div className="legal-section-title">7. Modificaciones</div>
                    <p className="legal-text">
                        VetCare podrá modificar los presentes Términos y Condiciones en cualquier momento. Las modificaciones serán publicadas en la App, y se entenderá que el usuario acepta dichos cambios si continúa utilizando los servicios después de su publicación.
                    </p>

                    <div className="legal-section-title">8. Legislación y Jurisdicción</div>
                    <p className="legal-text">
                        Estos Términos y Condiciones se rigen por la legislación española. En caso de controversia, las partes se someterán a los Juzgados y Tribunales de Elche (Alicante), salvo que la normativa de consumo establezca otro fuero aplicable.
                    </p>

                    <div className="legal-section-title">9. Contacto</div>
                    <p className="legal-text">
                        Para cualquier consulta relacionada con estos Términos y Condiciones, el usuario puede comunicarse con nosotros a través del correo electrónico vetcare2000@gmail.com o del teléfono 666 66 66 66
                    </p>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LegalTerms;
