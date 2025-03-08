import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import GestionEtudiants from './pages/Etudiants/GestionEtudiants';
import GestionPaiements from './pages/Paiements/GestionPaiements';
import GestionUtilisateurs from './pages/Utilisateurs/GestionUtilisateurs';
import Parametres from './pages/Settings/Parametres';
import Profile from './pages/Profile/Profile';
import AdminLayout from './layouts/AdminLayout';

// Comptable imports
import ComptableLayout from './layouts/ComptableLayout';
import ComptableDashboard from './pages/Comptable/Dashboard';
import Paiements from './pages/Comptable/Paiements';
import Tranches from './pages/Comptable/Tranches';
import Etudiants from './pages/Comptable/Etudiants';
import ComptableProfile from './pages/Comptable/Profile';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<Navigate to="/admin" />} />

      {/* Routes Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="etudiants" element={<GestionEtudiants />} />
        <Route path="paiements" element={<GestionPaiements />} />
        <Route path="users" element={<GestionUtilisateurs />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Parametres />} />
      </Route>

      {/* Routes Comptable */}
      <Route path="/comptable" element={<ComptableLayout />}>
        <Route path="dashboard" index element={<ComptableDashboard />} />
        <Route path="paiements" element={<Paiements />} />
        <Route path="tranches" element={<Tranches />} />
        <Route path="etudiants" element={<Etudiants />} />
        <Route path="profile" element={<ComptableProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;




















