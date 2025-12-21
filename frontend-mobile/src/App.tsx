import { Route, Navigate, BrowserRouter, Routes } from 'react-router-dom';
import { IonApp, setupIonicReact } from '@ionic/react';

/* Theme variables */
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import LegalTerms from './pages/LegalTerms';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Adoptions from './pages/Adoptions';
import SideMenu from './components/SideMenu';
import EditProfile from './pages/EditProfile';
import UserProfile from './pages/UserProfile';
import Citas from './pages/Citas';
import Historial from './pages/Historial';
import Treatment from './pages/Treatment';
import AnimalTreatment from './pages/AnimalTreatment';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './theme/theme.css';
import './theme/index.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';
import PasswordRecovery from './pages/PasswordRecovery';
import SignUpSuccessful from './pages/SignUpSuccessful';
import SignUpFailed from './pages/SignUpFailed';
import ContactUs from './pages/ContactUs';



setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <BrowserRouter>
      <SideMenu />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/error-page" element={<ErrorPage />} />
        <Route path="/legal-terms" element={<LegalTerms />} />
        <Route path="/adoption" element={<Adoptions />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/passwordRecovery" element={<PasswordRecovery />} />
        <Route path="/signUpSuccessful" element={<SignUpSuccessful />} />
        <Route path="/signUpFailed" element={<SignUpFailed />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/citas" element={<Citas />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/treatment" element={<Treatment />} />
        <Route path="/animal-treatment/:animalId" element={<AnimalTreatment />} />
      </Routes>
    </BrowserRouter>
  </IonApp>
);

export default App;
