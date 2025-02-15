import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';
import { FaEdit, FaTrash, FaFileExcel, FaFilePdf } from 'react-icons/fa';

const GestionUtilisateurs = () => {
  // Exemple de données pour des utilisateurs universitaires
  const initialUsers = [
    { id: 1, name: 'Alice Martin', email: 'alice@univ.fr', role: 'Admin', status: 'Actif' },
    { id: 2, name: 'Bob Dupont', email: 'bob@univ.fr', role: 'Comptable', status: 'Actif' },
    { id: 3, name: 'Charlie Durand', email: 'charlie@univ.fr', role: 'Étudiant', status: 'Actif' },
    { id: 4, name: 'Diane Petit', email: 'diane@univ.fr', role: 'Étudiant', status: 'Actif' },
    { id: 5, name: 'Eve Bernard', email: 'eve@univ.fr', role: 'Étudiant', status: 'Actif' },
    { id: 6, name: 'Fabrice Legrand', email: 'fabrice@univ.fr', role: 'Admin', status: 'Actif' },
    // Ajoutez plus d'utilisateurs selon vos besoins
  ];

  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Vous pouvez adapter ce nombre

  // Filtrer les utilisateurs en fonction de la recherche
  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [users, searchQuery]
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Gestion des actions
  const handleModify = (id) => {
    // Implémenter la logique de modification
    Swal.fire('Modification', `Modification de l'utilisateur ID ${id}`, 'info');
  };

  const handleDisable = (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Voulez-vous désactiver cet utilisateur ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, désactiver !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status: 'Désactivé' } : user)));
        Swal.fire('Désactivé !', "L'utilisateur a été désactivé.", 'success');
      }
    });
  };

  // Fonctions simulant l'exportation des données
  const handleExport = (format) => {
    Swal.fire('Exportation', `Données exportées en format ${format}`, 'success');
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Gestion des Utilisateurs</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
          {/* Barre de recherche */}
          <div className="w-full md:w-1/3 mb-2 md:mb-0">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Réinitialisation de la pagination lors d'une recherche
              }}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>
          {/* Nombre de résultats */}
          <div className="text-gray-600">
            {filteredUsers.length} résultat{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
          </div>
          {/* Boutons d'export */}
          <div className="flex space-x-2 mt-2 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExport('Excel')}
              className="flex items-center px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <FaFileExcel className="mr-2" /> Export Excel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExport('PDF')}
              className="flex items-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <FaFilePdf className="mr-2" /> Export PDF
            </motion.button>
          </div>
        </div>
        {/* Tableau des utilisateurs */}
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Rôle</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{user.status}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleModify(user.id)}
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      <FaEdit className="mr-1" /> Modifier
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDisable(user.id)}
                      className="text-red-500 hover:underline flex items-center"
                    >
                      <FaTrash className="mr-1" /> Désactiver
                    </motion.button>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default GestionUtilisateurs; 