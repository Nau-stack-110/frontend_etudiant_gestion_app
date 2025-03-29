import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiUsers } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Mentions = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Données factices pour la démonstration
  const mentions = [
    {
      id: 1,
      name: "Informatique",
      description: "Formation en développement et systèmes informatiques",
      levels: ["L1", "L2", "L3", "M1", "M2"],
      studentCount: 150,
      responsable: "Dr. Jean Martin"
    },
    {
      id: 2,
      name: "Gestion",
      description: "Formation en management et administration",
      levels: ["L1", "L2", "L3", "M1", "M2"],
      studentCount: 200,
      responsable: "Dr. Marie Robert"
    },
    // ... autres mentions
  ];

  const handleAddMention = () => {
    Swal.fire({
      title: 'Ajouter une Mention',
      html: `
        <div class="space-y-4">
          <input id="name" class="swal2-input" placeholder="Nom de la mention">
          <textarea id="description" class="swal2-textarea" placeholder="Description"></textarea>
          <input id="responsable" class="swal2-input" placeholder="Responsable">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        // Logique d'ajout de la mention
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
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Mentions</h1>
        <button
          onClick={handleAddMention}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <FiPlus className="mr-2 inline-block" /> Nouvelle Mention
        </button>
      </motion.div>

      {/* Grille des mentions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mentions.map((mention) => (
          <motion.div
            key={mention.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-white p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold text-gray-800">{mention.name}</h3>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <FiEdit2 className="h-5 w-5" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <p className="mt-2 text-gray-600">{mention.description}</p>

            <div className="mt-4 flex items-center text-gray-500">
              <FiUsers className="mr-2" />
              <span>{mention.studentCount} étudiants</span>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-700">Responsable:</h4>
              <p className="text-gray-600">{mention.responsable}</p>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-700">Niveaux:</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {mention.levels.map((level) => (
                  <span
                    key={level}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Mentions;