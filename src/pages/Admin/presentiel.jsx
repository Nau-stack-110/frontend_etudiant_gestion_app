import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiDownload, FiX, FiFilter, FiPlus, FiChevronDown, FiSearch, FiEdit, FiTrash2, FiSave } from "react-icons/fi";
import Swal from 'sweetalert2';

const API_URL = 'https://api-etudiant-esdes.onrender.com/api';


const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4 text-center">
      <div className="flex justify-center gap-2">
        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
      </div>
    </td>
  </tr>
);

// Composant Skeleton pour la barre de filtres
const FilterSkeleton = () => (
  <motion.div
    className="bg-white p-4 rounded-xl shadow-lg mb-6 animate-pulse"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[300px]">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="flex flex-wrap gap-4 flex-1">
        <div className="min-w-[200px] flex-1">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="min-w-[150px] flex-1">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function StudentsTable() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    mention: '',
    niveau: ''
  });
  const [formData, setFormData] = useState({
    matricule: "",
    etudiant_email: "",
    nom: "",
    prenom: "",
    mention: null,
    parcours: null,
    date_de_naissance: null,
    adresse: "",
    niveau: null,
    tel: "",
    image: null,
    moyenne: null,
    responsabilite: "",
    category:null,
  });
  const [mentions, setMentions] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [parcours, setParcours] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const itemsPerPage = 5;

  useEffect(() => {
    fetchStudents();
    fetchMentions();
    fetchNiveaux();
    fetchParcours();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/category-etudiant/`);
      setCategories(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des catégories", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/etudiants/`);
      const filtered = res.data.filter(student => 
        student.category_nom === 'Présentiel'
      );
      setStudents(filtered);
      setFilteredStudents(filtered);
    } catch (err) {
      setError("Erreur lors du chargement des étudiants", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentions = async () => {
    try {
      const res = await axios.get(`${API_URL}/mentions/`);
      setMentions(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des mentions", err);
    }
  };

  const fetchNiveaux = async () => {
    try {
      const res = await axios.get(`${API_URL}/niveau/`);
      setNiveaux(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des niveaux", err);
    }
  };

  const fetchParcours = async () => {
    try {
      const res = await axios.get(`${API_URL}/parcours/`);
      setParcours(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des parcours", err);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters, students, searchTerm]);

  const applyFilters = () => {
    let result = [...students];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(student => 
        student.nom.toLowerCase().includes(lowerSearch) ||
        student.prenom.toLowerCase().includes(lowerSearch) ||
        student.matricule.includes(searchTerm)
      );
    }

    if (filters.mention) {
      result = result.filter(student => 
        student.mention_nom === filters.mention
      );
    }
    
    if (filters.niveau) {
      result = result.filter(student => 
        student.niveau_nom === filters.niveau
      );
    }
    
    setFilteredStudents(result);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleEditStudent = (student) => {
    setFormData({
      matricule: student.matricule || "",
      etudiant_email: student.etudiant_email || "",
      nom: student.nom || "",
      prenom: student.prenom || "",
      mention: student.mention || null, 
      parcours: student.parcours || null, 
      date_de_naissance: student.date_de_naissance || null,
      adresse: student.adresse || "",
      niveau: student.niveau || null,
      tel: student.tel || "",
      image: null, 
      moyenne: student.moyenne || null,
      responsabilite: student.responsabilite || "",
      category:student.category || null,
    });
    setSelectedStudent(student);
    setShowUpdateModal(true);
  };

  const handleCreateStudent = () => {
    const presentielCategory = categories.find(cat => cat.nom_category === 'Présentiel');
      setFormData({
        matricule: "",
        etudiant_email: "",
        nom: "",
        prenom: "",
        mention: null,
        parcours: null,
        date_de_naissance: null,
        adresse: "",
        niveau: null,
        tel: "",
        image: null,
        moyenne: null,
        responsabilite: "",
        category: presentielCategory?.id || null // Forcer la catégorie à Présentiel
      });
      setShowCreateModal(true);
    };

  const handleSubmitCreateStudent = async () => {
      try {
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formDataToSend.append(key, value);
          }
        });
    
        await axios.post(`${API_URL}/etudiants/`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        
        await fetchStudents();
        setShowCreateModal(false);
        Swal.fire('Succès!', 'Étudiant créé avec succès', 'success');
      } catch (err) {
        const errorMessage = err.response?.data
         ? JSON.stringify(err.response.data)
         : err.message;
        Swal.fire('Erreur', errorMessage, 'error');
      }
    };


  const handleUpdateStudent = async () => {
    try {
      const updateData = new FormData();
      updateData.append("matricule", formData.matricule);
      updateData.append("etudiant_email", formData.etudiant_email);
      updateData.append("nom", formData.nom);
      updateData.append("prenom", formData.prenom);
      updateData.append("mention", formData.mention || "");
      if (formData.parcours !== null && formData.parcours !== "") {
        updateData.append("parcours", formData.parcours);
      }
      updateData.append("date_de_naissance", formData.date_de_naissance || "");
      updateData.append("adresse", formData.adresse);
      updateData.append("niveau", formData.niveau || "");
      updateData.append("tel", formData.tel);
      if (formData.image) {
        updateData.append("image", formData.image);
      }
      updateData.append("moyenne", formData.moyenne || "");
      updateData.append("responsabilite", formData.responsabilite);
      updateData.append("category", formData.category || null);

      await axios.put(`${API_URL}/etudiants/${selectedStudent.id}/`, updateData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      await fetchStudents();
      setShowUpdateModal(false);
      setSelectedStudent(null);
      setFormData({
        matricule: "",
        etudiant_email: "",
        nom: "",
        prenom: "",
        mention: null,
        parcours: null,
        date_de_naissance: null,
        adresse: "",
        niveau: null,
        tel: "",
        image: null,
        moyenne: null,
        responsabilite: "",
        category: null,
      });
      Swal.fire('Succès!', 'Modifications enregistrées', 'success');
    } catch (err) {
      Swal.fire('Erreur', err.response?.data?.message || err.message, 'error');
      setError("Erreur lors de la mise à jour de l'étudiant");
    }
  };

  const handleDeleteStudent = async (student) => {
    const confirmation = await Swal.fire({
      title: 'Confirmer la suppression?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true
    });
    if (confirmation.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/etudiants/${student.id}/`);
        await fetchStudents();
        Swal.fire('Supprimé!', 'Etudiant supprimé', 'success');
      } catch (err) {
        Swal.fire('Erreur', err.message.replace(/["{}]/g, ''), 'error');
        setError("Erreur lors de la suppression de l'étudiant");
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value || null }));
  };

  const handleDownloadQRCode = () => {
    if (!selectedStudent?.qr_code) return;
    
    const link = document.createElement("a");
    link.download = `QRCode_${selectedStudent.nom}_${selectedStudent.prenom}.png`;
    link.href = `data:image/png;base64,${selectedStudent.qr_code}`;
    link.click();
  };

  const uniqueMentions = [...new Set(students.map(s => s.mention_nom))];
  const uniqueNiveaux = [...new Set(students.map(s => s.niveau_nom))];

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const handleShowQRCode = (student) => {
    setSelectedStudent(student);
    setShowQRCode(true);
  };

  const handleCloseQRCode = () => {
    setShowQRCode(false);
    setSelectedStudent(null);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedStudent(null);
    setFormData({
      matricule: "",
      etudiant_email: "",
      nom: "",
      prenom: "",
      mention: null,
      parcours: null,
      date_de_naissance: null,
      adresse: "",
      niveau: null,
      tel: "",
      image: null,
      moyenne: null,
      responsabilite: "",
      category:null
    });
  };

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-800">Étudiants Présentiel</h1>
            <button
              onClick={handleCreateStudent}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
            <FiPlus className="w-5 h-5" />
              Créer un étudiant
            </button>
      </div>

      {/* Barre de recherche et filtres */}
      {loading ? (
        <FilterSkeleton />
      ) : (
        <motion.div 
          className="bg-white p-4 rounded-xl shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[300px]">
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Rechercher étudiant
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Nom, prénom ou matricule..."
                  className="w-full pl-10 pr-4 py-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
                <FiSearch className="absolute left-3 top-3 text-indigo-500" />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 flex-1">
              <div className="min-w-[200px] flex-1">
                <div className="relative">
                  <select
                    name="mention"
                    value={filters.mention}
                    onChange={handleFilterChange}
                    className="w-full appearance-none pl-3 pr-8 py-2 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Toutes les mentions</option>
                    {uniqueMentions.map(mention => (
                      <option key={mention} value={mention}>{mention}</option>
                    ))}
                  </select>
                  <FiFilter className="absolute right-3 top-3 text-indigo-500" />
                </div>
              </div>

              <div className="min-w-[150px] flex-1">
                <div className="relative">
                  <select
                    name="niveau"
                    value={filters.niveau}
                    onChange={handleFilterChange}
                    className="w-full appearance-none pl-3 pr-8 py-2 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Tous les niveaux</option>
                    {uniqueNiveaux.map(niveau => (
                      <option key={niveau} value={niveau}>{niveau}</option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-3 text-indigo-500" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tableau */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-4 text-indigo-800 font-semibold text-left">Étudiant</th>
                <th className="px-6 py-4 text-indigo-800 font-semibold text-left">Matricule</th>
                <th className="px-6 py-4 text-indigo-800 font-semibold text-left">Niveau</th>
                <th className="px-6 py-4 text-indigo-800 font-semibold text-left">Mention</th>
                <th className="px-6 py-4 text-indigo-800 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                // Afficher 5 lignes de skeleton pendant le chargement
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : (
                currentStudents.map((student) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-indigo-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{student.prenom} {student.nom}</td>
                    <td className="px-6 py-4 text-gray-600">{student.matricule}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        {student.niveau_nom}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{student.mention_nom}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleShowQRCode(student)}
                          className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
            <span className="text-gray-600">
              {filteredStudents.length} résultats trouvés
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg disabled:opacity-50"
              >
                Précédent
              </button>
              <span className="px-4 py-2 text-indigo-600">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal QR Code */}
      <AnimatePresence>
        {showQRCode && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-indigo-800">
                  QR Code - {selectedStudent.prenom} {selectedStudent.nom}
                </h3>
                <button
                  onClick={handleCloseQRCode}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex justify-center mb-6">
                {selectedStudent.qr_code ? (
                  <img 
                    src={`data:image/png;base64,${selectedStudent.qr_code}`}
                    alt="QR Code" 
                    className="w-64 h-64 object-contain border-4 border-indigo-100 rounded-xl"
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-gray-400">QR Code non disponible</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDownloadQRCode}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  disabled={!selectedStudent.qr_code}
                >
                  <FiDownload className="w-5 h-5" />
                  Télécharger
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Update Student */}
      <AnimatePresence>
        {showUpdateModal && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-indigo-800">
                  Modifier Étudiant - {selectedStudent.prenom} {selectedStudent.nom}
                </h3>
                <button
                  onClick={handleCloseUpdateModal}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Matricule</label>
                  <input
                    type="text"
                    name="matricule"
                    value={formData.matricule}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="etudiant_email"
                    value={formData.etudiant_email}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Mention</label>
                  <select
                    name="mention"
                    value={formData.mention || ""}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Sélectionner une mention</option>
                    {mentions.map(mention => (
                      <option key={mention.id} value={mention.id}>{mention.nom_mention}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Niveau</label>
                  <select
                    name="niveau"
                    value={formData.niveau || ""}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Sélectionner un niveau</option>
                    {niveaux.map(niveau => (
                      <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Parcours</label>
                  <select
                    name="parcours"
                    value={formData.parcours || ""}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Sélectionner un parcours</option>
                    {parcours.map(parcour => (
                      <option key={parcour.id} value={parcour.id}>{parcour.nom_parcours}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    name="date_de_naissance"
                    value={formData.date_de_naissance || ""}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    name="tel"
                    value={formData.tel}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Adresse</label>
                  <textarea
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Moyenne</label>
                  <input
                    type="number"
                    name="moyenne"
                    value={formData.moyenne || ""}
                    onChange={handleFormChange}
                    step="0.01"
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Responsabilité</label>
                  <input
                    type="text"
                    name="responsabilite"
                    value={formData.responsabilite}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Categorie</label>
                  <select
                    name="category"
                    value={formData.category || ""}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Sélectionner un categorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nom_category}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Image</label>
                  <input
                    type="file"
                    name="image"
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleCloseUpdateModal}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateStudent}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FiSave className="w-5 h-5" />
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Create Student */}
<AnimatePresence>
  {showCreateModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-indigo-800">
            Créer un nouvel étudiant
          </h3>
          <button
            onClick={() => setShowCreateModal(false)}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Matricule</label>
                  <input
                    type="text"
                    name="matricule"
                    value={formData.matricule}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="etudiant_email"
                    value={formData.etudiant_email}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Mention</label>
                  <select
                    name="mention"
                    value={formData.mention || ""}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Sélectionner une mention</option>
                    {mentions.map(mention => (
                      <option key={mention.id} value={mention.id}>{mention.nom_mention}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Niveau</label>
                  <select
                    name="niveau"
                    value={formData.niveau || ""}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Sélectionner un niveau</option>
                    {niveaux.map(niveau => (
                      <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Parcours</label>
                  <select
                    name="parcours"
                    value={formData.parcours || ""}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Sélectionner un parcours</option>
                    {parcours.map(parcour => (
                      <option key={parcour.id} value={parcour.id}>{parcour.nom_parcours}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    name="date_de_naissance"
                    value={formData.date_de_naissance || ""}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    name="tel"
                    value={formData.tel}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Adresse</label>
                  <textarea
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Moyenne</label>
                  <input
                    type="number"
                    name="moyenne"
                    value={formData.moyenne || ""}
                    onChange={handleFormChange}
                    step="0.01"
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Responsabilité</label>
                  <input
                    type="text"
                    name="responsabilite"
                    value={formData.responsabilite}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1">Catégorie</label>
            <select
              name="category"
              value={formData.category || ""}
              onChange={handleFormChange}
              className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none bg-gray-100"
              disabled
            >
              {categories.map(cat => (
                <option 
                  key={cat.id} 
                  value={cat.id}
                  selected={cat.nom_category === 'Présentiel'}
                >
                  {cat.nom_category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => setShowCreateModal(false)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmitCreateStudent}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiSave className="w-5 h-5" />
            Créer l&apos;étudiant
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}
