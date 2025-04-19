import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import Students from './pages/Admin/Students';
import Users from './pages/Admin/Users';
import Professors from './pages/Admin/Professors';
import Subjects from './pages/Admin/Subjects';
import Mentions from './pages/Admin/Mentions';
import Fees from './pages/Admin/Fees';
import Courses from './pages/Admin/Courses';
import Settings from './pages/Admin/Settings';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<Navigate to="/admin/dashboard" />} />

      {/* Routes Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="users" element={<Users />} />
        <Route path="professors" element={<Professors />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="mentions" element={<Mentions />} />
        <Route path="fees" element={<Fees />} />
        <Route path="courses" element={<Courses />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;




















