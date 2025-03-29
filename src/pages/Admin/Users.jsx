import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiMail, FiLock, FiUser } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState('all');

  // Données factices pour la démonstration
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@univ.mg",
      role: "Admin",
      status: "Actif",
      lastLogin: "2024-03-20 10:30",
      permissions: ["all"]
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@univ.mg",
      role: "Secrétaire",
      status: "Actif",
      lastLogin: "2024-03-19 15:45",
      permissions: ["read", "write"]
    },
    // ... autres utilisateurs
  ];

  const handleAddUser = () => {
    Swal.fire({
      title: 'Ajouter un Utilisateur',
      html: `
        <div class="space-y-4">
          <input id="name" class="swal2-input" placeholder="Nom complet">
          <input id="email" class="swal2-input" type="email" placeholder="Email">
          <select id="role" class="swal2-input">
            <option value="admin">Administrateur</option>
            <option value="secretary">Secrétaire</option>
            <option value="manager">Gestionnaire</option>
          </select>
          <div class="flex flex-col gap-2">
            <label class="flex items-center">
              <input type="checkbox" class="swal2-checkbox" value="read">
              <span class="ml-2">Lecture</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" class="swal2-checkbox" value="write">
              <span class="ml-2">Écriture</span>
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        // Logique d'ajout de l'utilisateur
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
        <button
          onClick={handleAddUser}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <FiPlus className="mr-2 inline-block" /> Nouvel Utilisateur
        </button>
      </motion.div>

      {/* Filtres et Recherche */}
      <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            className="w-full rounded-lg border pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border px-4 py-2"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="all">Tous les rôles</option>
          <option value="admin">Administrateur</option>
          <option value="secretary">Secrétaire</option>
          <option value="manager">Gestionnaire</option>
        </select>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Dernière Connexion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="rounded-full bg-blue-100 p-2">
                        <FiUser className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs
                    ${user.status === 'Actif' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.lastLogin}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex space-x-3">
                    <button className="text-blue-600 hover:text-blue-900">
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-md">
        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            Affichage de 1 à 6 sur 20 utilisateurs
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
          >
            Précédent
          </button>
          <button
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            onClick={() => setCurrentPage(page => page + 1)}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;