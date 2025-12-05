import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonMenu, IonContent, IonList, IonItem, IonLabel, IonMenuToggle, IonIcon } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, call, documentText, logOut, close } from 'ionicons/icons';

/* Theme variables */
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import LegalTerms from './pages/LegalTerms';
import Signup from './pages/Signup';
import Home from './pages/Home';
import SideMenu from './components/SideMenu';


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



setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <SideMenu />
      <IonRouterOutlet id="main-content">
        <Route path="/login" component={Login} exact />
        <Route path="/error-page" component={ErrorPage} exact />
        <Route path="/legal-terms" component={LegalTerms} exact />
        <Route path="/signup" component={Signup} exact />
        <Route path="/home" component={Home} exact />
        <Route path="/passwordRecovery" component={PasswordRecovery} exact />
        <Route path="/signUpSuccessful" component={SignUpSuccessful} exact />
        <Route path="/signUpFailed" component={SignUpFailed} exact />
        <Redirect exact from="/" to="/login" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
