import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiEdit2, FiTrash2, FiX, FiUsers, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';

// Composant Skeleton pour une ligne de tableau
const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3">
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </td>
    <td className="px-4 py-3">
      <div className="flex space-x-3">
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
      </div>
    </td>
  </tr>
);

// Composant Skeleton pour les filtres et cartes
const FilterSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Skeleton pour les cartes des niveaux */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="rounded-lg bg-gray-200 h-20"></div>
      ))}
    </div>
    {/* Skeleton pour les filtres */}
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md sm:flex-row">
      <div className="relative flex-1">
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="flex gap-4">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  </div>
);

const Fees = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [levels, setLevels] = useState([]);
  const [tarifs, setTarifs] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState({
    etudiant: '',
    designation: '',
    montant_paye: '',
    methode_paiement: '',
    reference: '',
    date_de_paiement: '',
    annee_academique: '',
  });
  const [editId, setEditId] = useState(null);
  const [matriculeSearch, setMatriculeSearch] = useState('');
  const itemsPerPage = 10;

  const apiBaseUrl = 'https://api-etudiant-esdes.onrender.com/api';
  const feesUrl = `${apiBaseUrl}/frais-scolarite/`;
  const studentsUrl = `${apiBaseUrl}/etudiants/`;
  const levelsUrl = `${apiBaseUrl}/niveau/`;
  const tarifsUrl = `${apiBaseUrl}/tarifs/`;
  const academicYearsUrl = `${apiBaseUrl}/annee-academique/`;

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [feesResponse, studentsResponse, levelsResponse, tarifsResponse, academicYearsResponse] = await Promise.all([
          axios.get(feesUrl),
          axios.get(studentsUrl),
          axios.get(levelsUrl),
          axios.get(tarifsUrl),
          axios.get(academicYearsUrl),
        ]);
        setFees(feesResponse.data);
        setStudents(studentsResponse.data);
        setLevels(levelsResponse.data);
        setTarifs(tarifsResponse.data);
        setAcademicYears(academicYearsResponse.data);
        
        // Set default academic year to active year
        const activeYear = academicYearsResponse.data.find(year => year.active);
        if (activeYear) {
          setFormData(prev => ({ ...prev, annee_academique: activeYear.id }));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la récupération des données',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mettre à jour le montant payé automatiquement
  useEffect(() => {
    if (formData.etudiant && formData.designation) {
      const selectedStudent = students.find((s) => s.id === parseInt(formData.etudiant));
      const selectedTarif = tarifs.find(
        (t) => t.id === parseInt(formData.designation) && t.niveau === selectedStudent?.niveau
      );
      if (selectedTarif) {
        setFormData((prev) => ({ ...prev, montant_paye: selectedTarif.montant }));
      } else {
        setFormData((prev) => ({ ...prev, montant_paye: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, montant_paye: '' }));
    }
  }, [formData.designation, formData.etudiant, students, tarifs]);

  // Fonction pour associer les données des étudiants aux frais
  const enrichedFees = fees.map((fee) => {
    const student = students.find((s) => s.id === fee.etudiant);
    const academicYear = academicYears.find((y) => y.id === fee.annee_academique);
    return {
      ...fee,
      studentName: student ? `${student.nom} ${student.prenom}` : 'Inconnu',
      studentId: student ? student.matricule : 'N/A',
      level: student ? student.niveau_nom : 'N/A',
      mention: student ? student.mention_nom : 'N/A',
      academicYear: academicYear ? academicYear.annee : 'N/A',
    };
  });

  // Filtrage et recherche
  const filteredFees = enrichedFees.filter(
    (fee) =>
      (selectedLevel === 'all' || fee.level === selectedLevel) &&
      (fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredFees.length / itemsPerPage);
  const paginatedFees = filteredFees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Étudiants par niveau
  const studentsByLevel = levels.map((level) => ({
    ...level,
    students: students.filter((student) => student.niveau_nom === level.nom),
    studentCount: students.filter((student) => student.niveau_nom === level.nom).length,
  }));

  // Recherche par matricule dans le modal
  const filteredStudents = students.filter((student) =>
    matriculeSearch
      ? student.matricule.toLowerCase().includes(matriculeSearch.toLowerCase())
      : true
  );

  // Gestion du modal
  const openModal = (mode = 'create', fee = null) => {
    setModalMode(mode);
    setMatriculeSearch('');
    if (mode === 'update' && fee) {
      setFormData({
        etudiant: fee.etudiant,
        designation: fee.designation,
        montant_paye: fee.montant_paye,
        methode_paiement: fee.methode_paiement,
        reference: fee.reference,
        date_de_paiement: fee.date_de_paiement.split('T')[0],
        annee_academique: fee.annee_academique,
      });
      setEditId(fee.id);
    } else {
      const activeYear = academicYears.find(year => year.active);
      setFormData({
        etudiant: '',
        designation: '',
        montant_paye: '',
        methode_paiement: '',
        reference: '',
        date_de_paiement: '',
        annee_academique: activeYear ? activeYear.id : '',
      });
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMatriculeSearch('');
  };

  // Gestion du formulaire
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        montant_paye: parseFloat(formData.montant_paye),
        annee_academique: parseInt(formData.annee_academique),
        designation: formData.designation ? parseInt(formData.designation) : null,
      };
      if (modalMode === 'create') {
        await axios.post(feesUrl, payload);
        const response = await axios.get(feesUrl);
        setFees(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Paiement créé avec succès',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await axios.put(`${feesUrl}${editId}/`, payload);
        const response = await axios.get(feesUrl);
        setFees(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Paiement mis à jour avec succès',
          timer: 1500,
          showConfirmButton: false,
        });
      }
      closeModal();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.designation?.[0] || 'Erreur lors de l\'enregistrement du paiement',
      });
    }
  };

  // Suppression
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Voulez-vous vraiment supprimer ce paiement ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${feesUrl}${id}/`);
        setFees(fees.filter((fee) => fee.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Supprimé',
          text: 'Paiement supprimé avec succès',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la suppression du paiement',
        });
      }
    }
  };

  // Liste des méthodes de paiement
  const paymentMethods = [
    { value: 'BOA', label: 'Banque BOA' },
    { value: 'BNI', label: 'Banque BNI' },
    { value: 'autres', label: 'Autres' },
  ];

  // Filtrer les désignations en fonction du niveau de l'étudiant sélectionné
  const getAvailableDesignations = () => {
    if (!formData.etudiant) return [];
    const selectedStudent = students.find((s) => s.id === parseInt(formData.etudiant));
    return tarifs.filter((tarif) => tarif.niveau === selectedStudent?.niveau);
  };

  // Pagination : Génération des numéros de page
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            currentPage === i ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="space-y-6 p-6" aria-busy={loading}>
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <h1 className="text-xl font-bold text-gray-800">Gestion des Frais de Scolarité</h1>
        <button
          onClick={() => openModal('create')}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
        >
          + Nouveau Paiement
        </button>
      </motion.div>

      {/* Chargement ou contenu */}
      {loading ? (
        <FilterSkeleton />
      ) : (
        <>
          {/* Cartes des niveaux */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {studentsByLevel.map((level) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg p-4 shadow-lg cursor-pointer transition-transform transform hover:scale-105 ${
                  selectedLevel === level.nom ? 'bg-blue-100 border-blue-500' : 'bg-white'
                }`}
                onClick={() => setSelectedLevel(level.nom)}
              >
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-500 p-2">
                    <FiUsers className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xs font-medium text-gray-500">{level.nom}</h3>
                    <p className="text-lg font-semibold text-gray-900">{level.studentCount}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filtres */}
          <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md sm:flex-row">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                className="w-full rounded-lg border pl-10 pr-4 py-2 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select
                className="rounded-lg border px-4 py-2 text-sm"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="all">Tous les niveaux</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.nom}>{level.nom}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {/* Tableau des paiements */}
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Étudiant
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Niveau
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Désignation
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Montant
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Année
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Méthode
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <TableRowSkeleton key={index} />
              ))
            ) : (
              <AnimatePresence>
                {paginatedFees.map((fee) => (
                  <motion.tr
                    key={fee.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{fee.studentName}</span>
                        <span className="text-xs text-gray-500">{fee.studentId}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">{fee.level}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">{fee.designation_nom}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">{parseFloat(fee.montant_paye).toLocaleString()} Ar</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">{new Date(fee.date_de_paiement).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">{fee.academicYear}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">{fee.methode_paiement}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex space-x-3">
                        <button onClick={() => openModal('update', fee)} className="text-blue-600 hover:text-blue-900">
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(fee.id)} className="text-red-600 hover:text-red-900">
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredFees.length > 0 && (
        <div className="flex flex-col items-center justify-between rounded-lg bg-white px-4 py-3 shadow-md sm:flex-row">
          <span className="text-xs text-gray-700">
            Affichage de {(currentPage - 1) * itemsPerPage + 1} à{' '}
            {Math.min(currentPage * itemsPerPage, filteredFees.length)} sur {filteredFees.length}{' '}
            paiements
          </span>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <button
              className="rounded-lg border p-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              aria-label="Première page"
            >
              <FiChevronsLeft className="h-4 w-4" />
            </button>
            <button
              className="rounded-lg border p-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              aria-label="Page précédente"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            {renderPageNumbers()}
            <button
              className="rounded-lg border p-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setCurrentPage((page) => page + 1)}
              disabled={currentPage === totalPages}
              aria-label="Page suivante"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
            <button
              className="rounded-lg border p-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Dernière page"
            >
              <FiChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal personnalisé */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">
                  {modalMode === 'create' ? 'Nouveau Paiement' : 'Modifier Paiement'}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Recherche par matricule</label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      value={matriculeSearch}
                      onChange={(e) => setMatriculeSearch(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 pl-10 shadow-sm text-sm"
                      placeholder="Entrez le matricule..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Étudiant</label>
                  <select
                    name="etudiant"
                    value={formData.etudiant}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                    required
                  >
                    <option value="">Sélectionner un étudiant</option>
                    {filteredStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.nom} {student.prenom} ({student.matricule})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Désignation</label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                    required
                    disabled={!formData.etudiant}
                  >
                    <option value="">Sélectionner une désignation</option>
                    {getAvailableDesignations().map((tarif) => (
                      <option key={tarif.id} value={tarif.id}>
                        {tarif.designation}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Montant Payé</label>
                  <input
                    type="number"
                    name="montant_paye"
                    value={formData.montant_paye}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                    required
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Méthode de Paiement</label>
                  <select
                    name="methode_paiement"
                    value={formData.methode_paiement}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                    required
                  >
                    <option value="">Sélectionner une méthode</option>
                    {paymentMethods.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Référence</label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Date de Paiement</label>
                  <input
                    type="date"
                    name="date_de_paiement"
                    value={formData.date_de_paiement}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Année Académique</label>
                  <select
                    name="annee_academique"
                    value={formData.annee_academique}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                    required
                  >
                    <option value="">Sélectionner une année</option>
                    {academicYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.annee} {year.active ? '(Active)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                  >
                    {modalMode === 'create' ? 'Enregistrer' : 'Mettre à jour'}
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

export default Fees;