import { Route, Navigate, Routes } from 'react-router-dom';

/* Theme variables */
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Home from '../pages/Home';
import Adoptions from '../pages/Adoptions';
import AdoptionDetail from '../pages/AdoptionDetail';
import EditProfile from '../pages/EditProfile';
import UserProfile from '../pages/UserProfile';
import Citas from '../pages/Citas';
import Historial from '../pages/Historial';
import Treatment from '../pages/Treatment';
import AnimalTreatment from '../pages/AnimalTreatment';
import PasswordRecovery from '../pages/PasswordRecovery';
import SignUpSuccessful from '../pages/SignUpSuccessful';
import SignUpFailed from '../pages/SignUpFailed';
import LegalTerms from '../pages/LegalTerms';
import ContactUs from '../pages/ContactUs';
import ErrorPage from '../pages/ErrorPage';

/* Auth */
import ProtectedRoute from './ProtectedRoute';
import ResetPassword from '../pages/ResetPassword';
import AuthCallback from '../pages/AuthCallback';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/passwordRecovery" element={<PasswordRecovery />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/signUpSuccessful" element={<SignUpSuccessful />} />
      <Route path="/signUpFailed" element={<SignUpFailed />} />
      <Route path="/legal-terms" element={<LegalTerms />} />
      <Route path="/contactUs" element={<ContactUs />} />
      <Route path="/error-page" element={<ErrorPage />} />

      {/* Protected routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adoption"
        element={
          <ProtectedRoute>
            <Adoptions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citas"
        element={
          <ProtectedRoute>
            <Citas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/historial"
        element={
          <ProtectedRoute>
            <Historial />
          </ProtectedRoute>
        }
      />
      <Route
        path="/treatment"
        element={
          <ProtectedRoute>
            <Treatment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/animal-treatment/:animalId"
        element={
          <ProtectedRoute>
            <AnimalTreatment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adoption-detail/:id"
        element={
          <ProtectedRoute>
            <AdoptionDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
