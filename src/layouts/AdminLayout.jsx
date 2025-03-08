import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import adminImage from '../assets/Linux.png';

const AdminLayout = () => {
  const admin = {
    name: "John Doe",
    image: adminImage
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      {/* Zone de contenu principale */}
      <main className="flex-1 p-4">
        {/* Header affichant le profil de l'administrateur avec redirection vers /admin/profile */}
        <header className="flex justify-end items-center mb-4">
          <NavLink to="profile" className="flex items-center space-x-2 hover:opacity-80">
            <img
              src={admin.image}
              alt="Profil Admin"
              className="w-10 h-10 rounded-full border border-gray-300"
            />
            <span className="font-semibold text-gray-800 hidden sm:inline">{admin.name}</span>
          </NavLink>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 