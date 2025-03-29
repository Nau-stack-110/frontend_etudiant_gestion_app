import { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Students = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Données factices pour la démonstration
  const students = [
    {
      id: "STD001",
      name: "Jean Dupont",
      level: "L1",
      mention: "Informatique",
      email: "jean.dupont@univ.mg",
      phone: "+261 34 00 000 00",
      status: "Actif"
    },
    {
        id: "STD001",
        name: "Jean Dupont",
        level: "L1",
        mention: "Informatique",
        email: "jean.dupont@univ.mg",
        phone: "+261 34 00 000 00",
        status: "Actif"
      },
      {
        id: "STD001",
        name: "arnaud Dupont",
        level: "L2",
        mention: "Informatique",
        email: "jean.dupont@univ.mg",
        phone: "+261 34 00 000 00",
        status: "Actif"
      },
      {
        id: "STD001",
        name: "bema Dupont",
        level: "L3",
        mention: "Informatique",
        email: "jean.dupont@univ.mg",
        phone: "+261 34 00 000 00",
        status: "Actif"
      },
      {
        id: "STD001",
        name: "koto Dupont",
        level: "L1",
        mention: "Finance",
        email: "jean.dupont@univ.mg",
        phone: "+261 34 00 000 00",
        status: "Actif"
      },
    // ... autres étudiants
  ];

  const handleShowQRCode = (student) => {
    setSelectedStudent(student);
    setShowQRCode(true);
  };

  const handleDeleteStudent = (studentId) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Logique de suppression ici
        Swal.fire(
          'Supprimé!',
          'L\'étudiant a été supprimé.',
          'success'
        );
      }
    });
  };

  const QRCodeModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setShowQRCode(false)}
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        className="relative rounded-lg bg-white p-6"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-semibold">QR Code - {selectedStudent?.name}</h3>
        <div className="flex justify-center">
          <QRCodeSVG
            value={JSON.stringify(selectedStudent)}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
        <button
          className="mt-4 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => setShowQRCode(false)}
        >
          Fermer
        </button>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Étudiants</h1>
        <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          + Nouvel Étudiant
        </button>
      </motion.div>

      {/* Filtres et Recherche */}
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
          <button className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50">
            <FiFilter /> Filtres
          </button>
        </div>
      </div>

      {/* Table des étudiants */}
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Niveau
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Mention
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
            {students.map((student) => (
              <motion.tr
                key={student.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: '#f9fafb' }}
              >
                <td className="whitespace-nowrap px-6 py-4">{student.id}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{student.name}</span>
                    <span className="text-sm text-gray-500">{student.email}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">{student.level}</td>
                <td className="whitespace-nowrap px-6 py-4">{student.mention}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    {student.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleShowQRCode(student)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="text-red-600 hover:text-red-900"
                    >
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
            Affichage de 1 à 10 sur 100 étudiants
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

      {/* Modal QR Code */}
      {showQRCode && <QRCodeModal />}
    </div>
  );
};

export default Students;