import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit2, FiTrash2, FiX, FiUsers } from 'react-icons/fi';
import axios from 'axios';

const Fees = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [levels, setLevels] = useState([]);
  const [tarifs, setTarifs] = useState([]); // Nouvelle state pour les tarifs
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
    annee_academique: 1,
  });
  const [editId, setEditId] = useState(null);
  const [matriculeSearch, setMatriculeSearch] = useState('');
  const itemsPerPage = 10;

  // URLs des APIs
  const apiBaseUrl = 'http://localhost:8000/api';
  const feesUrl = `${apiBaseUrl}/frais-scolarite/`;
  const studentsUrl = `${apiBaseUrl}/etudiants/`;
  const levelsUrl = `${apiBaseUrl}/niveau/`;
  const tarifsUrl = `${apiBaseUrl}/tarifs/`;

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [feesResponse, studentsResponse, levelsResponse, tarifsResponse] = await Promise.all([
          axios.get(feesUrl),
          axios.get(studentsUrl),
          axios.get(levelsUrl),
          axios.get(tarifsUrl), // Récupération des tarifs
        ]);
        setFees(feesResponse.data);
        setStudents(studentsResponse.data);
        setLevels(levelsResponse.data);
        setTarifs(tarifsResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mettre à jour le montant payé automatiquement lorsque la désignation change
  useEffect(() => {
    if (formData.designation && formData.etudiant) {
      const selectedStudent = students.find((s) => s.id === parseInt(formData.etudiant));
      const selectedTarif = tarifs.find(
        (t) => t.designation === formData.designation && t.niveau === selectedStudent?.niveau
      );
      if (selectedTarif) {
        setFormData((prev) => ({ ...prev, montant_paye: selectedTarif.montant }));
      }
    }
  }, [formData.designation, formData.etudiant, tarifs, students]);

  // Fonction pour associer les données des étudiants aux frais
  const enrichedFees = fees.map((fee) => {
    const student = students.find((s) => s.id === fee.etudiant);
    return {
      ...fee,
      studentName: student ? `${student.nom} ${student.prenom}` : 'Inconnu',
      studentId: student ? student.matricule : 'N/A',
      level: student ? student.niveau_nom : 'N/A',
      mention: student ? student.mention_nom : 'N/A',
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
        designation: fee.designation_nom, 
        montant_paye: fee.montant_paye,
        methode_paiement: fee.methode_paiement,
        reference: fee.reference,
        date_de_paiement: fee.date_de_paiement.split('T')[0],
        annee_academique: fee.annee_academique,
      });
      setEditId(fee.id);
    } else {
      setFormData({
        etudiant: '',
        designation: '',
        montant_paye: '',
        methode_paiement: '',
        reference: '',
        date_de_paiement: '',
        annee_academique: 1,
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
      };
      if (modalMode === 'create') {
        await axios.post(feesUrl, payload);
        const response = await axios.get(feesUrl);
        setFees(response.data);
      } else {
        await axios.put(`${feesUrl}${editId}/`, payload);
        const response = await axios.get(feesUrl);
        setFees(response.data);
      }
      closeModal();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    }
  };

  // Suppression
  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce paiement ?')) {
      try {
        await axios.delete(`${feesUrl}${id}/`);
        setFees(fees.filter((fee) => fee.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
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
          onClick={() => openModal('create')}
          className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          + Nouveau Paiement
        </button>
      </motion.div>

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
              <div className="rounded-full bg-purple-500 p-3">
                <FiUsers className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">{level.nom}</h3>
                <p className="text-xl font-semibold text-gray-900">{level.studentCount} étudiant(s)</p>
              </div>
            </div>
          </motion.div>
        ))}
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
            {levels.map((level) => (
              <option key={level.id} value={level.nom}>{level.nom}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chargement dynamique */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
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
                    Désignation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Montant Payé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Méthode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedFees.map((fee) => (
                  <motion.tr
                    key={fee.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{fee.studentName}</span>
                        <span className="text-sm text-gray-500">{fee.studentId}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">{fee.level}</td>
                    <td className="whitespace-nowrap px-6 py-4">{fee.designation_nom}</td>
                    <td className="whitespace-nowrap px-6 py-4">₣ {parseFloat(fee.montant_paye).toLocaleString()}</td>
                    <td className="whitespace-nowrap px-6 py-4">{new Date(fee.date_de_paiement).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-6 py-4">{fee.methode_paiement}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex space-x-3">
                        <button onClick={() => openModal('update', fee)} className="text-blue-600 hover:text-blue-900">
                          <FiEdit2 className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDelete(fee.id)} className="text-red-600 hover:text-red-900">
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
                Affichage de {(currentPage - 1) * itemsPerPage + 1} à{' '}
                {Math.min(currentPage * itemsPerPage, filteredFees.length)} sur {filteredFees.length}{' '}
                paiements
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </button>
              <button
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal personnalisé */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {modalMode === 'create' ? 'Nouveau Paiement' : 'Modifier Paiement'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Recherche par matricule</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={matriculeSearch}
                    onChange={(e) => setMatriculeSearch(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 pl-10 shadow-sm"
                    placeholder="Entrez le matricule..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Étudiant</label>
                <select
                  name="etudiant"
                  value={formData.etudiant}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                <label className="block text-sm font-medium text-gray-700">Désignation</label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                  disabled={!formData.etudiant} // Désactiver si aucun étudiant n'est sélectionné
                >
                  <option value="">Sélectionner une désignation</option>
                  {getAvailableDesignations().map((tarif) => (
                    <option key={tarif.designation} value={tarif.designation}>
                      {tarif.designation}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Montant Payé</label>
                <input
                  type="number"
                  name="montant_paye"
                  value={formData.montant_paye}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Méthode de Paiement</label>
                <select
                  name="methode_paiement"
                  value={formData.methode_paiement}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                <label className="block text-sm font-medium text-gray-700">Référence</label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de Paiement</label>
                <input
                  type="date"
                  name="date_de_paiement"
                  value={formData.date_de_paiement}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  {modalMode === 'create' ? 'Enregistrer' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;