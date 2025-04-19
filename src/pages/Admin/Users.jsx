import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUser, FiBook, FiShield, FiDollarSign, FiPlus, FiX } from 'react-icons/fi';
import { FaFilter } from 'react-icons/fa';
import Swal from 'sweetalert2';

const BASEURL = "http://127.0.0.1:8000/api";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    is_superuser: false,
    isEtudiant: false,
    isProf: false,
    isComptable: false,
  });
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASEURL}/user-profile/`);
        if (!response.ok) {
          throw new Error('Erreur de la récuperation des utilisateurs');
        }
        const data = await response.json();
        
        const transformedUsers = data.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.is_superuser ? 'Administrateur' :
                user.isEtudiant ? 'Étudiant' :
                user.isProf ? 'Professeur' :
                user.isComptable ? 'Comptable' : 'Inconnu'
        }));
        
        setUsers(transformedUsers);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Calculate user type counts
  const userCounts = useMemo(() => ({
    Administrateur: users.filter(user => user.role === 'Administrateur').length,
    Étudiant: users.filter(user => user.role === 'Étudiant').length,
    Professeur: users.filter(user => user.role === 'Professeur').length,
    Comptable: users.filter(user => user.role === 'Comptable').length,
  }), [users]);

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, selectedRole, users]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Role icon mapping
  const getRoleIcon = (role) => {
    switch (role) {
      case 'Administrateur':
        return <FiShield className="h-6 w-6 text-blue-600" />;
      case 'Étudiant':
        return <FiUser className="h-6 w-6 text-green-600" />;
      case 'Professeur':
        return <FiBook className="h-6 w-6 text-purple-600" />;
      case 'Comptable':
        return <FiDollarSign className="h-6 w-6 text-yellow-600" />;
      default:
        return <FiUser className="h-6 w-6 text-gray-600" />;
    }
  };

  // Handle new user form submission
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASEURL}/user-profile/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
      }
      const createdUser = await response.json();
      setUsers([...users, {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        role: createdUser.is_superuser ? 'Administrateur' :
              createdUser.isEtudiant ? 'Étudiant' :
              createdUser.isProf ? 'Professeur' :
              createdUser.isComptable ? 'Comptable' : 'Inconnu'
      }]);
      setIsModalOpen(false);
      setNewUser({
        username: '',
        email: '',
        is_superuser: false,
        isEtudiant: false,
        isProf: false,
        isComptable: false,
      });
      Swal.fire({
        icon: 'success',
        title: 'Utilisateur crée avec succès',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.message,
      });
    }
  };

  // Loading animation
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          />
          <motion.div
            className="absolute h-20 w-20 bg-blue-100 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
          <p className="mt-4 text-gray-600 font-medium">Chargement des utilisateurs...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-sm">
          Erreur: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex flex-col sm:flex-row justify-between items-center"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Gestion des Utilisateurs</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FiPlus className="h-5 w-5" />
          Nouvel Utilisateur
        </button>
      </motion.div>

      {/* User Count Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {[
          { role: 'Administrateur', count: userCounts.Administrateur, color: 'blue' },
          { role: 'Étudiant', count: userCounts.Étudiant, color: 'green' },
          { role: 'Professeur', count: userCounts.Professeur, color: 'purple' },
          { role: 'Comptable', count: userCounts.Comptable, color: 'yellow' },
        ].map(({ role, count, color }) => (
          <div
            key={role}
            className={`bg-white p-4 rounded-xl shadow-sm border-l-4 border-${color}-500 flex items-center gap-4 hover:shadow-md transition-shadow`}
          >
            <div className={`p-2 bg-${color}-100 rounded-full`}>{getRoleIcon(role)}</div>
            <div>
              <p className="text-sm text-gray-600">{role}</p>
              <p className="text-lg font-bold text-gray-800">{count}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm"
      >
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">Tous les rôles</option>
            <option value="Administrateur">Administrateur</option>
            <option value="Étudiant">Étudiant</option>
            <option value="Professeur">Professeur</option>
            <option value="Comptable">Comptable</option>
          </select>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {paginatedUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          {getRoleIcon(user.role)}
                        </div>
                        <span className="font-medium text-gray-900">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${user.role === 'Administrateur' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'Étudiant' ? 'bg-green-100 text-green-800' :
                          user.role === 'Professeur' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {user.role}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl shadow-sm"
      >
        <span className="text-sm text-gray-600 mb-2 sm:mb-0">
          Affichage de {((currentPage - 1) * usersPerPage) + 1} à{' '}
          {Math.min(currentPage * usersPerPage, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
        </span>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <button
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      </motion.div>

      {/* Create User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Nouvel Utilisateur</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom d&apos;utilisateur</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rôle</label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.is_superuser}
                        onChange={(e) => setNewUser({ ...newUser, is_superuser: e.target.checked })}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Administrateur</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.isEtudiant}
                        onChange={(e) => setNewUser({ ...newUser, isEtudiant: e.target.checked })}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Étudiant</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.isProf}
                        onChange={(e) => setNewUser({ ...newUser, isProf: e.target.checked })}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Professeur</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.isComptable}
                        onChange={(e) => setNewUser({ ...newUser, isComptable: e.target.checked })}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Comptable</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Créer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;