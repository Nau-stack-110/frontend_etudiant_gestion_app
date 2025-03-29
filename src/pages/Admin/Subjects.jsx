import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Subjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMention, setSelectedMention] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Données factices pour la démonstration
  const subjects = [
    {
      id: 1,
      code: "INFO201",
      name: "Algorithmique",
      mention: "Informatique",
      semester: "S1",
      credits: 6,
      coefficient: 3,
      hours: {
        cm: 20,
        td: 20,
        tp: 20
      },
      professor: "Dr. Martin"
    },
    {
        id: 2,
        code: "ECO201",
        name: "Gestion management",
        mention: "Economie",
        semester: "S2",
        credits: 4,
        coefficient: 3,
        hours: {
          cm: 20,
          td: 20,
          tp: 20
        },
        professor: "Dr. Martin"
      },
    // ... autres matières
  ];

  const handleAddSubject = () => {
    Swal.fire({
      title: 'Ajouter une Matière',
      html: `
        <div class="space-y-4">
          <input id="code" class="swal2-input" placeholder="Code de la matière">
          <input id="name" class="swal2-input" placeholder="Nom de la matière">
          <select id="mention" class="swal2-input">
            <option value="">Sélectionner une mention</option>
            <option value="info">Informatique</option>
            <option value="gestion">Gestion</option>
          </select>
          <select id="semester" class="swal2-input">
            <option value="">Sélectionner un semestre</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
          </select>
          <div class="flex gap-2">
            <input id="credits" class="swal2-input" type="number" placeholder="Crédits">
            <input id="coefficient" class="swal2-input" type="number" placeholder="Coefficient">
          </div>
          <div class="flex gap-2">
            <input id="cm" class="swal2-input" type="number" placeholder="Heures CM">
            <input id="td" class="swal2-input" type="number" placeholder="Heures TD">
            <input id="tp" class="swal2-input" type="number" placeholder="Heures TP">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        // Logique d'ajout de la matière
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
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Matières</h1>
        <button
          onClick={handleAddSubject}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <FiPlus className="mr-2 inline-block" /> Nouvelle Matière
        </button>
      </motion.div>

      {/* Filtres et Recherche */}
      <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une matière..."
            className="w-full rounded-lg border pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border px-4 py-2"
          value={selectedMention}
          onChange={(e) => setSelectedMention(e.target.value)}
        >
          <option value="all">Toutes les mentions</option>
          <option value="info">Informatique</option>
          <option value="gestion">Gestion</option>
        </select>
      </div>

      {/* Tableau des matières */}
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Mention
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Semestre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Crédits
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Volume Horaire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subjects.map((subject) => (
              <motion.tr
                key={subject.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: '#f9fafb' }}
              >
                <td className="whitespace-nowrap px-6 py-4 font-medium">
                  {subject.code}
                </td>
                <td className="px-6 py-4">{subject.name}</td>
                <td className="px-6 py-4">{subject.mention}</td>
                <td className="px-6 py-4">{subject.semester}</td>
                <td className="px-6 py-4">
                  {subject.credits} ({subject.coefficient})
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div>CM: {subject.hours.cm}h</div>
                    <div>TD: {subject.hours.td}h</div>
                    <div>TP: {subject.hours.tp}h</div>
                  </div>
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
            Affichage de 1 à 10 sur 50 matières
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

export default Subjects;