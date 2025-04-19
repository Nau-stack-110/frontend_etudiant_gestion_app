import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiBook, FiClock } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Courses = () => {
  const [selectedMention, setSelectedMention] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Données factices pour la démonstration
  const courses = [
    {
      id: 1,
      name: "Développement Web",
      mention: "Informatique",
      level: "L2",
      description: "Formation aux technologies web modernes",
      credits: 6,
      hours: 60,
      professors: ["Dr. Martin", "Dr. Dupont"],
      prerequisites: ["Algorithmes", "Programmation"],
      type: "Obligatoire"
    },
    {
      id: 2,
      name: "Base de données avancées",
      mention: "Informatique",
      level: "L3",
      description: "Conception et optimisation des bases de données",
      credits: 4,
      hours: 40,
      professors: ["Dr. Robert"],
      prerequisites: ["Base de données"],
      type: "Obligatoire"
    },
    // ... autres parcours
  ];

  const handleAddCourse = () => {
    Swal.fire({
      title: 'Ajouter un Parcours',
      html: `
        <div class="space-y-4">
          <input id="name" class="swal2-input" placeholder="Nom du parcours">
          <select id="mention" class="swal2-input">
            <option value="">Sélectionner une mention</option>
            <option value="info">Informatique</option>
            <option value="gestion">Gestion</option>
          </select>
          <select id="level" class="swal2-input">
            <option value="">Sélectionner un niveau</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
            <option value="M1">M1</option>
            <option value="M2">M2</option>
          </select>
          <textarea id="description" class="swal2-textarea" placeholder="Description"></textarea>
          <input id="credits" class="swal2-input" type="number" placeholder="Nombre de crédits">
          <input id="hours" class="swal2-input" type="number" placeholder="Nombre d'heures">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        // Logique d'ajout du parcours
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
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Parcours</h1>
        <button
          onClick={handleAddCourse}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <FiPlus className="mr-2 inline-block" /> Nouveau Parcours
        </button>
      </motion.div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 rounded-lg bg-white p-4 shadow-md">
        <select
          className="rounded-lg border px-4 py-2"
          value={selectedMention}
          onChange={(e) => setSelectedMention(e.target.value)}
        >
          <option value="all">Toutes les mentions</option>
          <option value="info">Informatique</option>
          <option value="gestion">Gestion</option>
        </select>
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

      {/* Grille des parcours */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-white p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{course.name}</h3>
                <p className="text-sm text-gray-500">{course.mention} - {course.level}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <FiEdit2 className="h-5 w-5" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <p className="mt-3 text-gray-600">{course.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <FiBook className="mr-2" />
                <span>{course.credits} crédits</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiClock className="mr-2" />
                <span>{course.hours}h</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-700">Professeurs:</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {course.professors.map((prof, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    {prof}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-700">Prérequis:</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {course.prerequisites.map((prereq, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <span className={`rounded-full px-3 py-1 text-sm
                ${course.type === 'Obligatoire' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
                }`}
              >
                {course.type}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
