import { useState } from 'react';
import { motion } from 'framer-motion';
import Pagination from '../../components/Pagination';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';

const Paiements = () => {
  const initialPayments = [
    { id: 1, date: '2025-01-04', etudiant: 'Alice kely', montant: '150000', tranche: 'Tranche 1' },
    { id: 2, date: '2025-02-10', etudiant: 'Boby', montant: '200000', tranche: 'Tranche 2' },
    { id: 3, date: '2025-03-10', etudiant: 'Arishu be', montant: '120000', tranche: 'Tranche 1' },
  ];

  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState('');
  const [selectedTranche, setSelectedTranche] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // États pour le filtre par date avec react-datepicker
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // États pour le modal d'ajout de paiement
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({ etudiant: '', tranche: 'Tranche 1', montant: '' });

  // Mapping pour la complétion automatique en fonction de la tranche
  const defaultAmounts = {
    "Tranche 1": "15000",
    "Tranche 2": "25000",
    "Tranche 3": "35000",
  };

  // Filtrage des paiements (recherche + filtre par tranche + filtre par date)
  const filteredPayments = payments.filter(payment => {
    const searchText = search.toLowerCase();
    const matchSearch =
      payment.etudiant.toLowerCase().includes(searchText) ||
      payment.tranche.toLowerCase().includes(searchText);
    const matchTranche = selectedTranche === 'All' || payment.tranche === selectedTranche;
    const paymentDate = new Date(payment.date);
    const matchDate =
      (!startDate || paymentDate >= startDate) &&
      (!endDate || paymentDate <= endDate);
    return matchSearch && matchTranche && matchDate;
  });

  // Pagination
  const indexOfLastPayment = currentPage * itemsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Export (simulation avec SweetAlert2 - implémentation via jsPDF ou XLSX possible)
  const handleExportPDF = () => {
    Swal.fire({
      icon: 'info',
      title: 'Export PDF',
      text: 'Export vers PDF en cours...',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleExportExcel = () => {
    Swal.fire({
      icon: 'info',
      title: 'Export Excel',
      text: 'Export vers Excel en cours...',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Traitement du formulaire d'ajout
  const handleModalSubmit = (e) => {
    e.preventDefault();

    // Vérifier que l'étudiant n'a pas déjà payé cette tranche
    const existingPayment = payments.find(payment =>
      payment.etudiant.toLowerCase() === newPayment.etudiant.toLowerCase() &&
      payment.tranche === newPayment.tranche
    );
    if (existingPayment) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: `Ce ${newPayment.tranche} a déjà été payé par cet étudiant.`,
      });
      return;
    }

    const newId = payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1;
    const today = new Date().toISOString().split('T')[0];
    const paymentToAdd = { id: newId, date: today, ...newPayment };

    setPayments([...payments, paymentToAdd]);
    setIsAddModalOpen(false);
    setNewPayment({ etudiant: '', tranche: 'Tranche 1', montant: defaultAmounts["Tranche 1"] });
    Swal.fire({
      icon: 'success',
      title: 'Paiement effectué',
      text: 'Le paiement a été ajouté avec succès.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Gestion des Paiements</h1>

      {/* Zone de recherche, filtrage, dates et actions */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Rechercher par étudiant ou tranche"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full md:w-64"
          />
          <select
            value={selectedTranche}
            onChange={(e) => setSelectedTranche(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value="All">Toutes les tranches</option>
            <option value="Tranche 1">Tranche 1</option>
            <option value="Tranche 2">Tranche 2</option>
            <option value="Tranche 3">Tranche 3</option>
          </select>
          <div className="flex flex-wrap gap-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border border-gray-300 p-2 rounded-md"
              placeholderText="Date début"
              dateFormat="yyyy-MM-dd"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border border-gray-300 p-2 rounded-md"
              placeholderText="Date fin"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleExportPDF}
            className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaFilePdf />
            <span>Exporter PDF</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleExportExcel}
            className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-md flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaFileExcel />
            <span>Exporter Excel</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              // Lors de l'ouverture du modal, on initialise avec les données de Tranche 1
              setNewPayment({ etudiant: '', tranche: 'Tranche 1', montant: defaultAmounts["Tranche 1"] });
              setIsAddModalOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md text-sm sm:text-base"
          >
            Ajouter un Paiement
          </motion.button>
        </div>
      </div>

      {/* Tableau des paiements */}
      <div className="overflow-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Étudiant</th>
              <th className="py-3 px-4 text-left">Montant (Ar)</th>
              <th className="py-3 px-4 text-left">Tranche</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {currentPayments.map((payment) => (
              <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-4">{payment.date}</td>
                <td className="py-3 px-4">{payment.etudiant}</td>
                <td className="py-3 px-4">{payment.montant} Ar</td>
                <td className="py-3 px-4">{payment.tranche}</td>
              </tr>
            ))}
            {currentPayments.length === 0 && (
              <tr>
                <td className="py-3 px-4 text-center" colSpan="4">Aucun paiement trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      {/* Modal d'ajout de paiement */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md w-80">
            <h2 className="text-xl font-bold mb-4">Ajouter un Paiement</h2>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Étudiant</label>
                <input
                  type="text"
                  required
                  value={newPayment.etudiant}
                  onChange={(e) => setNewPayment({ ...newPayment, etudiant: e.target.value })}
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tranche</label>
                <select
                  value={newPayment.tranche}
                  onChange={(e) => {
                    const selectedTrancheValue = e.target.value;
                    setNewPayment({ 
                      ...newPayment, 
                      tranche: selectedTrancheValue, 
                      montant: defaultAmounts[selectedTrancheValue]
                    });
                  }}
                  className="border border-gray-300 rounded w-full p-2"
                >
                  <option value="Tranche 1">Tranche 1</option>
                  <option value="Tranche 2">Tranche 2</option>
                  <option value="Tranche 3">Tranche 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Montant (Ar)</label>
                <input
                  type="number"
                  required
                  value={newPayment.montant}
                  onChange={(e) => setNewPayment({ ...newPayment, montant: e.target.value })}
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Paiements; 