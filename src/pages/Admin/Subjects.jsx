import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';

const Subjects = () => {
  const [matieres, setMatieres] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMention, setSelectedMention] = useState('all');
  const [selectedNiveau, setSelectedNiveau] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMatiere, setCurrentMatiere] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matieresRes, mentionsRes] = await Promise.all([
          fetch('https://api-etudiant-esdes.onrender.com/api/matiere/'),
          fetch('https://api-etudiant-esdes.onrender.com/api/mentions/')
        ]);
        
        const matieresData = await matieresRes.json();
        const mentionsData = await mentionsRes.json();
        
        setMatieres(matieresData);
        setMentions(mentionsData);
      } catch (error) {
        console.error('Erreur de chargement:', error);
      }
    };
    
    fetchData();
  }, []);

  const filteredMatieres = matieres.filter(m => {
    const matchesSearch = m.nom_matiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.code_matiere.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMention = selectedMention === 'all' || m.mention.toString() === selectedMention;
    const matchesNiveau = selectedNiveau === 'all' || m.niveau.toString() === selectedNiveau;
    
    return matchesSearch && matchesMention && matchesNiveau;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMatieres = filteredMatieres.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredMatieres.length / itemsPerPage);

  const handleOpenModal = (matiere = null) => {
    setCurrentMatiere(matiere);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const url = currentMatiere 
        ? `https://api-etudiant-esdes.onrender.com/api/matiere/${currentMatiere.id}/`
        : 'https://api-etudiant-esdes.onrender.com/api/matiere/';
      
      const method = currentMatiere ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error(await response.text());

      const result = await response.json();
      setMatieres(prev => currentMatiere 
        ? prev.map(m => m.id === result.id ? result : m)
        : [...prev, result]);
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      try {
        await fetch(`https://api-etudiant-esdes.onrender.com/api/matiere/${id}/`, { method: 'DELETE' });
        setMatieres(prev => prev.filter(m => m.id !== id));
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestion des Matières</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus className="mr-2" /> Nouvelle Matière
        </button>
      </motion.div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="w-full px-4 py-2 border rounded-lg bg-white"
          value={selectedMention}
          onChange={(e) => setSelectedMention(e.target.value)}
        >
          <option value="all">Toutes les mentions</option>
          {mentions.map(m => (
            <option key={m.id} value={m.id}>{m.nom_mention}</option>
          ))}
        </select>

        <select
          className="w-full px-4 py-2 border rounded-lg bg-white"
          value={selectedNiveau}
          onChange={(e) => setSelectedNiveau(e.target.value)}
        >
          <option value="all">Tous les niveaux</option>
          <option value="1">L1</option>
          <option value="2">L2</option>
          <option value="3">L3</option>
          <option value="4">M1</option>
          <option value="5">M2</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Matière</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Module</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Crédits</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Niveau</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <AnimatePresence>
              {paginatedMatieres.map(matiere => (
                <motion.tr
                  key={matiere.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className="transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{matiere.code_matiere}</td>
                  <td className="px-4 py-3 text-gray-600">{matiere.nom_matiere}</td>
                  <td className="px-4 py-3 text-gray-600">{matiere.module_matiere}</td>
                  <td className="px-4 py-3 text-gray-600">{matiere.credit_matiere}</td>
                  <td className="px-4 py-3 text-gray-600">{matiere.niveau_nom}</td>
                  <td className="px-4 py-3 flex space-x-3">
                    <button
                      onClick={() => handleOpenModal(matiere)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(matiere.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm text-gray-600">
            {filteredMatieres.length} résultats - Page {currentPage}/{totalPages}
          </span>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 text-sm bg-gray-100 rounded-lg ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
              }`}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <button
              className={`px-4 py-2 text-sm bg-gray-100 rounded-lg ${
                currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
              }`}
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage >= totalPages}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white rounded-xl w-full max-w-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {currentMatiere ? 'Modifier' : 'Nouvelle'} Matière
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="code_matiere" defaultValue={currentMatiere?.code_matiere || ''} required placeholder="Code" className="w-full border px-4 py-2 rounded-lg" />
                <input name="nom_matiere" defaultValue={currentMatiere?.nom_matiere || ''} required placeholder="Nom de la matière" className="w-full border px-4 py-2 rounded-lg" />
                <input name="module_matiere" defaultValue={currentMatiere?.module_matiere || ''} required placeholder="Module" className="w-full border px-4 py-2 rounded-lg" />
                <input name="credit_matiere" type="number" defaultValue={currentMatiere?.credit_matiere || ''} required placeholder="Crédits" className="w-full border px-4 py-2 rounded-lg" />
                
                <select name="niveau" defaultValue={currentMatiere?.niveau || '1'} className="w-full border px-4 py-2 rounded-lg">
                  <option value="1">L1</option>
                  <option value="2">L2</option>
                  <option value="3">L3</option>
                  <option value="4">M1</option>
                  <option value="5">M2</option>

                </select>

                <select name="mention" defaultValue={currentMatiere?.mention || ''} className="w-full border px-4 py-2 rounded-lg">
                  {mentions.map(m => (
                    <option key={m.id} value={m.id}>{m.nom_mention}</option>
                  ))}
                </select>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    {currentMatiere ? 'Modifier' : 'Ajouter'}
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

export default Subjects;
