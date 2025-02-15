import { Outlet, NavLink } from 'react-router-dom';
import SidebarComptable from '../components/SidebarComptable';
import adminImage from '../assets/Linux.png';

const ComptableLayout = () => {
  // Pour la simulation, les informations du comptable connecté
  const accountant = {
    name: "Alice Comptable",
    image: adminImage
  };

  return (
    <div className="flex flex-col md:flex-row">
      <SidebarComptable />
      <main className="flex-1 p-4 bg-gray-100 min-h-screen">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
            Dashboard Comptable
          </div>
          <NavLink to="/comptable/profile" className="flex items-center space-x-2 hover:opacity-80">
            <img
              src={accountant.image}
              alt="Profil Comptable"
              className="w-10 h-10 rounded-full border border-gray-300"
            />
            <span className="font-semibold text-gray-800 hidden sm:inline">
              {accountant.name}
            </span>
          </NavLink>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default ComptableLayout; 