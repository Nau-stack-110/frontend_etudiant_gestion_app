import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiBook } from 'react-icons/fi';
import Swal from 'sweetalert2';
import axios from 'axios';

const BASEURL = "http://127.0.0.1:8000/api";

const Professors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [professors, setProfessors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 9;

  // Fetch professors and subjects
  const getProfessors = async () => {
    setIsLoading(true);
    try {
      const [profResponse, subjectResponse] = await Promise.all([
        axios.get(`${BASEURL}/professeurs/`),
        axios.get(`${BASEURL}/matiere/`)
      ]);
      setProfessors(profResponse.data);
      setSubjects(subjectResponse.data);
      setTotalPages(Math.ceil(profResponse.data.length / itemsPerPage));
    } catch (e) {
      console.error("Erreur lors du chargement des données:", e);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les données',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfessors();
  }, []);

  // Handle search and pagination
  const filteredProfessors = professors.filter(prof =>
    prof.nom_prof.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.prof_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.specialite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProfessors = filteredProfessors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredProfessors.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchTerm]);

  // Get subject name by ID
  const getSubjectName = (subjectId) => {
    const subject = subjects.find(sub => sub.id === subjectId);
    return subject ? subject.nom_matiere : 'Inconnu';
  };

  const handleAddProfessor = () => {
    Swal.fire({
      title: 'Ajouter un Professeur',
      html: `
        <div class="space-y-4">
          <input id="name" class="swal2-input" placeholder="Nom complet" required>
          <input id="email" class="swal2-input" type="email" placeholder="Email" required>
          <input id="speciality" class="swal2-input" placeholder="Spécialité" required>
          <select id="subjects" class="swal2-select" multiple>
            ${subjects.map(subject => `<option value="${subject.id}">${subject.nom_matiere}</option>`).join('')}
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      preConfirm: async () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const speciality = document.getElementById('speciality').value;
        const selectedSubjects = Array.from(document.getElementById('subjects').selectedOptions)
          .map(option => parseInt(option.value));

        try {
          await axios.post(`${BASEURL}/professeurs/`, {
            nom_prof: name,
            prof_email: email,
            specialite: speciality,
            matieres: selectedSubjects
          });
          getProfessors();
          Swal.fire('Succès', 'Professeur ajouté avec succès', 'success');
        } catch (e) {
          Swal.fire('Erreur', 'Impossible d\'ajouter le professeur', 'error');
        }
      }
    });
  };

  const handleEditProfessor = (professor) => {
    Swal.fire({
      title: 'Modifier le Professeur',
      html: `
        <div class="space-y-4">
          <input id="name" class="swal2-input" value="${professor.nom_prof}" required>
          <input id="email" class="swal2-input" type="email" value="${professor.prof_email}" required>
          <input id="speciality" class="swal2-input" value="${professor.specialite}" required>
          <select id="subjects" class="swal2-select" multiple>
            ${subjects.map(subject => `
              <option 
                value="${subject.id}"
                ${professor.matieres.includes(subject.id) ? 'selected' : ''}
              >
                ${subject.nom_matiere}
              </option>
            `).join('')}
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Modifier',
      cancelButtonText: 'Annuler',
      preConfirm: async () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const speciality = document.getElementById('speciality').value;
        const selectedSubjects = Array.from(document.getElementById('subjects').selectedOptions)
          .map(option => parseInt(option.value));

        try {
          await axios.put(`${BASEURL}/professeurs/${professor.id}/`, {
            nom_prof: name,
            prof_email: email,
            specialite: speciality,
            matieres: selectedSubjects
          });
          getProfessors();
          Swal.fire('Succès', 'Professeur modifié avec succès', 'success');
        } catch (e) {
          Swal.fire('Erreur', 'Impossible de modifier le professeur', 'error');
        }
      }
    });
  };

  const handleDeleteProfessor = (professorId) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASEURL}/professeurs/${professorId}/`);
          getProfessors();
          Swal.fire('Supprimé!', 'Le professeur a été supprimé.', 'success');
        } catch (e) {
          Swal.fire('Erreur', 'Impossible de supprimer le professeur', 'error');
        }
      }
    });
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Professeurs</h1>
        <button
          onClick={handleAddProfessor}
          className="flex items-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-white shadow-md hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          <FiPlus className="mr-2" /> Nouveau Professeur
        </button>
      </motion.div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, email ou spécialité..."
          className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-r-4 border-l-4 border-blue-300 absolute top-0 left-0 opacity-75" style={{ animationDuration: '1.5s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-blue-600 font-medium">
              Chargement...
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Professors Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedProfessors.map((professor) => (
              <motion.div
                key={professor.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{professor.nom_prof}</h3>
                    <p className="text-sm text-gray-500">{professor.prof_email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProfessor(professor)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProfessor(professor.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 flex items-center">
                      <FiBook className="mr-2" /> Matières enseignées:
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {professor.matieres.map((subjectId) => (
                        <span
                          key={subjectId}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                        >
                          {getSubjectName(subjectId)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Spécialité:</span> {professor.specialite}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {filteredProfessors.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-between rounded-lg bg-white px-6 py-4 shadow-md">
              <span className="text-sm text-gray-600 mb-4 sm:mb-0">
                Affichage de {(currentPage - 1) * itemsPerPage + 1} à{' '}
                {Math.min(currentPage * itemsPerPage, filteredProfessors.length)} sur{' '}
                {filteredProfessors.length} professeurs
              </span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(page => page - 1)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Précédent
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      currentPage === i + 1
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    } transition-all`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(page => page + 1)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Suivant
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun professeur trouvé</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Professors;