import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  FaTachometerAlt, 
  FaMoneyBillWave, 
  FaListAlt, 
  FaUserGraduate, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt,
  FaCalculator
} from 'react-icons/fa';

const SidebarComptable = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/comptable/dashboard' },
    { name: 'Paiements', icon: <FaMoneyBillWave />, path: '/comptable/paiements' },
    { name: 'Tranches', icon: <FaListAlt />, path: '/comptable/tranches' },
    { name: 'Étudiants', icon: <FaUserGraduate />, path: '/comptable/etudiants' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {/* Bouton menu mobile repositionné en haut à gauche */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg text-white"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside
        className={`
          fixed md:relative z-40 flex flex-col justify-between bg-gradient-to-b from-gray-800 to-gray-900 text-white
          min-h-screen transition-all duration-300 ease-in-out
          ${collapsed ? "w-16" : "w-64"}
          ${isMobileMenuOpen ? "left-0" : "-left-full md:left-0"}
        `}
      >
        <div>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2 text-2xl font-bold">
              {collapsed ? (
                <FaCalculator className="text-yellow-400" />
              ) : (
                <>
                  <FaCalculator className="text-yellow-400" />
                  <span className="ml-2">Comptabilité</span>
                </>
              )}
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block text-xl hover:text-blue-400 transition-colors"
              title={collapsed ? "Afficher la sidebar" : "Cacher la sidebar"}
            >
              {collapsed ? <FaBars /> : <FaTimes />}
            </button>
          </div>
          <nav className="mt-4 px-2">
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mb-1"
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                      isActive ? "bg-gray-700 shadow-lg" : ""
                    }`
                  }
                  title={collapsed ? item.name : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="mr-3 text-xl text-blue-400">{item.icon}</div>
                  {!collapsed && <span className="text-sm">{item.name}</span>}
                </NavLink>
              </motion.div>
            ))}
          </nav>
        </div>
        <div className="p-2 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors"
            title="Déconnexion"
          >
            <div className="mr-3 text-xl text-red-400">
              <FaSignOutAlt />
            </div>
            {!collapsed && <span className="text-sm">Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarComptable; 