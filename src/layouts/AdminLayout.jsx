import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiMenu, FiX, FiHome, FiUsers, FiUserCheck, 
  FiBook, FiBookmark, FiDollarSign, FiSettings,
  FiLogOut, FiGrid, 
} from 'react-icons/fi';
import Swal from 'sweetalert2';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Données factices de l'admin connecté
  const currentAdmin = {
    name: "John Doe",
    role: "Administrateur",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: <FiHome />, label: 'Tableau de bord' },
    { path: '/admin/students', icon: <FiUsers />, label: 'Étudiants' },
    { path: '/admin/users', icon: <FiUserCheck />, label: 'Utilisateurs' },
    { path: '/admin/professors', icon: <FiUserCheck />, label: 'Professeurs' },
    { path: '/admin/subjects', icon: <FiBook />, label: 'Matières' },
    { path: '/admin/mentions', icon: <FiBookmark />, label: 'Mentions' },
    { path: '/admin/fees', icon: <FiDollarSign />, label: 'Frais Scolarité' },
    { path: '/admin/courses', icon: <FiGrid />, label: 'Parcours' },
    { path: '/admin/settings', icon: <FiSettings />, label: 'Paramètres' },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, me déconnecter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Ajouter la logique de déconnexion ici
        navigate('/login');
      }
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className={`fixed left-0 z-40 flex h-screen flex-col bg-indigo-800 text-white
          ${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300`}
      >
        {/* Admin Profile */}
        <div className="border-b border-indigo-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={currentAdmin.avatar}
                alt="Admin"
                className="h-10 w-10 rounded-full bg-indigo-600"
              />
              <div>
                <h2 className="font-semibold">{currentAdmin.name}</h2>
                <p className="text-sm text-indigo-300">{currentAdmin.role}</p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)}>
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-gray-100 transition-colors duration-300
                  ${isActive ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span className="ml-4">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="border-t border-indigo-700 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-4 py-2 text-red-300 transition-colors duration-300 hover:bg-indigo-700"
          >
            <FiLogOut className="text-xl" />
            <span className="ml-4">Déconnexion</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`text-gray-600 ${isSidebarOpen ? 'hidden' : 'block'}`}
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
