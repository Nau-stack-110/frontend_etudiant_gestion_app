import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  FaTachometerAlt, 
  FaMoneyBillWave, 
  FaListAlt, 
  FaUserGraduate, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt,
  FaCalculator,
  FaChevronLeft,
  FaChevronRight
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
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-2 left-2 z-50 p-2 bg-indigo-600 rounded-lg text-white shadow-lg"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className={`
            fixed md:sticky top-0 left-0 z-40
            flex flex-col h-screen
            bg-gradient-to-b from-indigo-700 to-purple-800 text-white
            transition-all duration-300 ease-in-out shadow-xl
            ${collapsed ? "w-16" : "w-64"}
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-indigo-600">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2"
              >
                {collapsed ? (
                  <FaCalculator className="text-xl text-yellow-400" />
                ) : (
                  <>
                    <FaCalculator className="text-xl text-yellow-400" />
                    <span className="text-base font-bold">Comptabilité</span>
                  </>
                )}
              </motion.div>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:block text-white hover:text-yellow-400 transition-colors"
                title={collapsed ? "Développer" : "Réduire"}
              >
                {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto scrollbar-hide py-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-2 mb-1"
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg transition-all duration-200
                      ${isActive 
                        ? "bg-indigo-500 shadow-md" 
                        : "hover:bg-indigo-600"
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="text-lg text-yellow-400">{item.icon}</div>
                    <span className={`ml-3 text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-40 opacity-100'}`}>
                      {item.name}
                    </span>
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Footer avec bouton de déconnexion */}
            <div className="p-2 border-t border-indigo-600">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center w-full p-2 rounded-lg hover:bg-red-500 transition-colors"
                title="Déconnexion"
              >
                <FaSignOutAlt className="text-lg text-red-400" />
                <span className={`ml-3 text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-40 opacity-100'}`}>
                  Déconnexion
                </span>
              </motion.button>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  );
};

export default SidebarComptable; 