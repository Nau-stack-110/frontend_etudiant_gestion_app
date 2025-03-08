import { AiFillSetting } from "react-icons/ai"; 
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  FaTachometerAlt, 
  FaUserGraduate,
  FaMoneyBillWave,
  FaUsers, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt,
  FaUniversity,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Tableau de bord', icon: <FaTachometerAlt />, path: '.' },
    { name: 'Étudiants', icon: <FaUserGraduate />, path: 'etudiants' },
    { name: 'Paiements', icon: <FaMoneyBillWave />, path: 'paiements' },
    { name: 'Utilisateurs', icon: <FaUsers />, path: 'users' },
    { name: 'Paramètres', icon: <AiFillSetting />, path: 'settings' },
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
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 rounded-lg text-white shadow-lg"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </motion.button>

      <AnimatePresence>
        <motion.aside
          initial={{ x: collapsed ? -240 : 0 }}
          animate={{ x: 0 }}
          exit={{ x: -240 }}
          className={`fixed md:sticky top-0 left-0 z-40 h-screen bg-gradient-to-b from-indigo-700 to-indigo-900 text-white transition-all duration-300 ease-in-out
            ${collapsed ? "w-20" : "w-64"} 
            ${isMobileMenuOpen ? "left-0" : "-left-full md:left-0"}`}
        >
          {/* Header */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-indigo-600">
              <motion.div 
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1 }}
                className="flex items-center space-x-3"
              >
                <FaUniversity className="text-2xl text-white" />
                <span className={`font-bold text-xl whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0' : 'w-40'}`}>
                  GestEtu Pro
                </span>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:block text-white hover:bg-indigo-600 p-2 rounded-lg transition-colors"
              >
                {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
              </motion.button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mb-1"
                >
                  <NavLink
                    to={item.path}
                    end={item.path === '.'}
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "bg-indigo-500 shadow-lg" 
                          : "hover:bg-indigo-600"
                      }`
                    }
                  >
                    <div className="text-xl">{item.icon}</div>
                    <span className={`ml-3 text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0' : 'w-40'}`}>
                      {item.name}
                    </span>
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Footer avec bouton de déconnexion */}
            <div className="p-4 border-t border-indigo-600">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center w-full p-3 rounded-lg hover:bg-red-500 transition-colors"
              >
                <FaSignOutAlt className="text-xl" />
                <span className={`ml-3 text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0' : 'w-40'}`}>
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

export default Sidebar; 