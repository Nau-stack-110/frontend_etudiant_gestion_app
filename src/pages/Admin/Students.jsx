import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiDownload, FiX, FiFilter, FiChevronDown, FiSearch, FiEdit, FiTrash2 } from "react-icons/fi";

export default function StudentsTable() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    mention: '',
    niveau: ''
  });

  const itemsPerPage = 5;

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/etudiants/")
      .then((res) => {
        setStudents(res.data);
        setFilteredStudents(res.data);
      })
      .catch(() => setError("Erreur lors du chargement des étudiants"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, students, searchTerm]);

  const applyFilters = () => {
    let result = [...students];

    // Filtre de recherche
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(student => 
        student.nom.toLowerCase().includes(lowerSearch) ||
        student.prenom.toLowerCase().includes(lowerSearch) ||
        student.matricule.includes(searchTerm)
      );
    }

    // Filtres déroulants
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
    // À implémenter : Logique de modification
    console.log('Modifier étudiant:', student);
  };

  const handleDeleteStudent = (student) => {
    // À implémenter : Logique de suppression
    if (window.confirm(`Supprimer ${student.prenom} ${student.nom} ?`)) {
      console.log('Supprimer étudiant:', student);
    }
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
  
  return (
    <div className="p-6">
      {/* Barre de recherche et filtres */}
      <motion.div 
        className="bg-white p-4 rounded-xl shadow-lg mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-wrap gap-4 items-end">
          {/* Barre de recherche */}
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

          {/* Filtres déroulants */}
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
              {currentStudents.map((student) => (
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
    </div>
  );
}