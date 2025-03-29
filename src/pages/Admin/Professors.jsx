import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiMail, FiPhone, FiBook } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Professors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Données factices pour la démonstration
  const professors = [
    {
      id: 1,
      name: "Dr. Jean Martin",
      email: "jean.martin@univ.mg",
      phone: "+261 34 00 000 01",
      speciality: "Informatique",
      subjects: ["Algorithmique", "Base de données"],
      status: "Permanent",
      degree: "Docteur en Informatique"
    },
    {
        id: 2,
        name: "Dr. Arnaud",
        email: "arnaud@univ.mg",
        phone: "+261 34 00 000 01",
        speciality: "Economie",
        subjects: ["Commerce", "Gestion management"],
        status: "Permanent",
        degree: "Docteur en Economie"
      },
      
    // ... autres professeurs
  ];

  const handleAddProfessor = () => {
    Swal.fire({
      title: 'Ajouter un Professeur',
      html: `
        <div class="space-y-4">
          <input id="name" class="swal2-input" placeholder="Nom complet">
          <input id="email" class="swal2-input" type="email" placeholder="Email">
          <input id="phone" class="swal2-input" placeholder="Téléphone">
          <input id="speciality" class="swal2-input" placeholder="Spécialité">
          <input id="degree" class="swal2-input" placeholder="Diplôme">
          <select id="status" class="swal2-input">
            <option value="permanent">Permanent</option>
            <option value="vacataire">Vacataire</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        // Logique d'ajout du professeur
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
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Professeurs</h1>
        <button
          onClick={handleAddProfessor}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <FiPlus className="mr-2 inline-block" /> Nouveau Professeur
        </button>
      </motion.div>

      {/* Barre de recherche */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un professeur..."
          className="w-full rounded-lg border pl-10 pr-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grille des professeurs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {professors.map((professor) => (
          <motion.div
            key={professor.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-white p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold text-gray-800">{professor.name}</h3>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <FiEdit2 className="h-5 w-5" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center text-gray-600">
                <FiMail className="mr-2" />
                <span>{professor.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiPhone className="mr-2" />
                <span>{professor.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiBook className="mr-2" />
                <span>{professor.speciality}</span>
              </div>
            </div>

            <div className="mt-4">
              <span className={`rounded-full px-3 py-1 text-sm
                ${professor.status === 'Permanent' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {professor.status}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-700">Matières enseignées:</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {professor.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <strong>Diplôme:</strong> {professor.degree}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-md">
        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            Affichage de 1 à 9 sur 30 professeurs
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

export default Professors;