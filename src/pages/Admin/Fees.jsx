import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiDollarSign, FiCheck } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Fees = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Données factices pour la démonstration
  const payments = [
    {
      id: "PAY001",
      studentId: "STD001",
      studentName: "Jean Dupont",
      level: "L1",
      mention: "Informatique",
      amount: 1500000,
      paidAmount: 750000,
      deadline: "2024-06-30",
      status: "En cours"
    },
    {
      id: "PAY002",
      studentId: "STD002",
      studentName: "Marie Claire",
      level: "L2",
      mention: "Gestion",
      amount: 1500000,
      paidAmount: 1500000,
      deadline: "2024-06-30",
      status: "Payé"
    },
    // ... autres paiements
  ];

  const handleAddPayment = () => {
    Swal.fire({
      title: 'Enregistrer un Paiement',
      html: `
        <div class="space-y-4">
          <input id="student" class="swal2-input" placeholder="ID Étudiant">
          <input id="amount" class="swal2-input" placeholder="Montant" type="number">
          <select id="tranche" class="swal2-input">
            <option value="1">1ère Tranche</option>
            <option value="2">2ème Tranche</option>
            <option value="3">3ème Tranche</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        // Logique d'enregistrement du paiement
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
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Frais de Scolarité</h1>
        <button 
          onClick={handleAddPayment}
          className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          + Nouveau Paiement
        </button>
      </motion.div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-blue-500 p-3">
              <FiDollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Attendu</h3>
              <p className="text-xl font-semibold text-gray-900">₣ 150,000,000</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-green-500 p-3">
              <FiCheck className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Reçu</h3>
              <p className="text-xl font-semibold text-gray-900">₣ 75,000,000</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
            className="w-full rounded-lg border pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select
            className="rounded-lg border px-4 py-2"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="all">Tous les niveaux</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
            <option value="M1">M1</option>
            <option value="M2">M2</option>
          </select>
        </div>
      </div>

      {/* Tableau des paiements */}
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Étudiant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Niveau
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Montant Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Montant Payé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Échéance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <motion.tr
                key={payment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: '#f9fafb' }}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{payment.studentName}</span>
                    <span className="text-sm text-gray-500">{payment.studentId}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">{payment.level}</td>
                <td className="whitespace-nowrap px-6 py-4">₣ {payment.amount.toLocaleString()}</td>
                <td className="whitespace-nowrap px-6 py-4">₣ {payment.paidAmount.toLocaleString()}</td>
                <td className="whitespace-nowrap px-6 py-4">{payment.deadline}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-sm font-medium
                    ${payment.status === 'Payé' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {payment.status}
                  </span>
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
            Affichage de 1 à 10 sur 100 paiements
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

export default Fees;