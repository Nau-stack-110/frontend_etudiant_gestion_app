import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';
import { FaEdit, FaTrash, FaFileExcel, FaFilePdf } from 'react-icons/fa';

const GestionPaiements = () => {
  // Exemples de données pour des paiements universitaires
  const initialPayments = [
    { id: 1, date: '2023-10-01', student: 'Jean Dupont', amount: '500 Ar', tranche: '1ère tranche' },
    { id: 2, date: '2023-09-15', student: 'Alice Martin', amount: '700 Ar', tranche: '2ème tranche' },
    { id: 3, date: '2023-09-20', student: 'Bob Dupont', amount: '450 Ar', tranche: '1ère tranche' },
    { id: 4, date: '2023-10-05', student: 'Diane Petit', amount: '600 Ar', tranche: '2ème tranche' },
    { id: 5, date: '2023-10-10', student: 'Eric Laurent', amount: '550 Ar', tranche: '1ère tranche' },
    { id: 6, date: '2023-10-12', student: 'Fabrice Legrand', amount: '650 Ar', tranche: '2ème tranche' },
    // Ajoutez d'autres paiements selon vos besoins
  ];

  const [payments, setPayments] = useState(initialPayments);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Filtrer les paiements sur la base du nom de l'étudiant
  const filteredPayments = useMemo(
    () =>
      payments.filter((payment) =>
        payment.student.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [payments, searchQuery]
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleModify = (id) => {
    Swal.fire('Modification', `Modification de la transaction ID ${id}`, 'info');
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Voulez-vous supprimer ce paiement ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        setPayments((prev) => prev.filter((payment) => payment.id !== id));
        Swal.fire('Supprimé !', 'Le paiement a été supprimé.', 'success');
      }
    });
  };

  const handleExport = (format) => {
    Swal.fire('Exportation', `Données exportées en format ${format}`, 'success');
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Gestion des Paiements</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
          {/* Barre de recherche */}
          <div className="w-full md:w-1/3 mb-2 md:mb-0">
            <input
              type="text"
              placeholder="Rechercher par étudiant..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>
          {/* Nombre de résultats */}
          <div className="text-gray-600">
            {filteredPayments.length} résultat{filteredPayments.length > 1 ? 's' : ''} trouvé{filteredPayments.length > 1 ? 's' : ''}
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
        {/* Tableau des paiements */}
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Étudiant</th>
                <th className="px-6 py-3 text-left">Montant</th>
                <th className="px-6 py-3 text-left">Tranche</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4">{payment.date}</td>
                  <td className="px-6 py-4">{payment.student}</td>
                  <td className="px-6 py-4">{payment.amount}</td>
                  <td className="px-6 py-4">{payment.tranche}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleModify(payment.id)}
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      <FaEdit className="mr-1" /> Modifier
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(payment.id)}
                      className="text-red-500 hover:underline flex items-center"
                    >
                      <FaTrash className="mr-1" /> Supprimer
                    </motion.button>
                  </td>
                </tr>
              ))}
              {paginatedPayments.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Aucun paiement trouvé
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

export default GestionPaiements; 