import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiPlus, FiEdit, FiSave, FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';

const BASEURL = "https://api-etudiant-esdes.onrender.com/api";

const Mentions = () => {
  const [mentions, setMentions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nom_mention: '',
    nb_parcours: 4,
    responsable: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchMentions();
  }, []);

  const fetchMentions = async () => {
    try {
      const response = await fetch(`${BASEURL}/mentions/`);
      if (!response.ok) throw new Error('Failed to fetch mentions');
      const data = await response.json();
      setMentions(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nom_mention.trim()) errors.nom_mention = 'Le nom de la mention est requis';
    if (!formData.nb_parcours) errors.nb_parcours = 'Le nombre de parcours est requis';
    if (!formData.responsable.trim()) errors.responsable = 'Le responsable est requis';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOrUpdate = async () => {
    if (!validateForm()) return;

    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `${BASEURL}/mentions/${formData.id}/` : `${BASEURL}/mentions/`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom_mention: formData.nom_mention,
          nb_parcours: formData.nb_parcours,
          responsable: formData.responsable,
        }),
      });

      if (!response.ok) throw new Error(formData.id ? 'Failed to update mention' : 'Failed to add mention');

      await fetchMentions();
      setIsModalOpen(false);
      setFormData({ id: null, nom_mention: '', nb_parcours: 4, responsable: '' });
      setFormErrors({});
      Swal.fire({
        icon: 'success',
        title: formData.id ? 'Mention mise à jour' : 'Mention ajoutée',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.message,
      });
    }
  };

  const openAddModal = () => {
    setFormData({ id: null, nom_mention: '', nb_parcours: 4, responsable: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (mention) => {
    setFormData({
      id: mention.id,
      nom_mention: mention.nom_mention,
      nb_parcours: mention.nb_parcours,
      responsable: mention.responsable,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'nb_parcours' ? parseInt(value) || '' : value }));
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Chargement...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Erreur: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-2xl rounded-xl p-6 max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Liste des Mentions</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
        >
          <FiPlus className="mr-2" />
          Ajouter une Mention
        </motion.button>
      </div>

      <div className="mb-4 text-gray-600">
        <span className="font-semibold">Total des Mentions:</span> {mentions.length}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-6 py-4 text-left font-semibold">Nom de la Mention</th>
              <th className="px-6 py-4 text-left font-semibold">Nombre de Parcours</th>
              <th className="px-6 py-4 text-left font-semibold">Responsable</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
              <th className="px-6 py-4 text-left font-semibold">Parcours</th>
            </tr>
          </thead>
          <tbody>
            {mentions.map((mention) => (
              <motion.tr
                key={mention.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-gray-200 hover:bg-blue-50/50 transition-colors duration-200"
              >
                <td className="px-6 py-4 font-medium text-gray-800">{mention.nom_mention}</td>
                <td className="px-6 py-4">{mention.nb_parcours}</td>
                <td className="px-6 py-4">{mention.responsable}</td>
                <td className="px-6 py-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openEditModal(mention)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit className="h-5 w-5" />
                  </motion.button>
                </td>
                <td className="px-6 py-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleRow(mention.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {expandedRows[mention.id] ? (
                      <FiChevronUp className="h-5 w-5" />
                    ) : (
                      <FiChevronDown className="h-5 w-5" />
                    )}
                  </motion.button>
                </td>
                <AnimatePresence>
                  {expandedRows[mention.id] && (
                    <motion.tr
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td colSpan="5" className="bg-gray-50 p-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Parcours:</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          {mention.parcours.map((parcours) => (
                            <li key={parcours.id} className="text-gray-600">
                              {parcours.nom_parcours}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {formData.id ? 'Modifier la Mention' : 'Ajouter une Mention'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-600 hover:text-gray-800">
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom de la Mention</label>
                  <input
                    type="text"
                    name="nom_mention"
                    value={formData.nom_mention}
                    onChange={handleInputChange}
                    className={`mt-1 w-full rounded-lg border ${formErrors.nom_mention ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.nom_mention && <p className="text-red-500 text-sm mt-1">{formErrors.nom_mention}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre de Parcours</label>
                  <input
                    type="number"
                    name="nb_parcours"
                    value={formData.nb_parcours}
                    onChange={handleInputChange}
                    className={`mt-1 w-full rounded-lg border ${formErrors.nb_parcours ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.nb_parcours && <p className="text-red-500 text-sm mt-1">{formErrors.nb_parcours}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Responsable</label>
                  <input
                    type="text"
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleInputChange}
                    className={`mt-1 w-full rounded-lg border ${formErrors.responsable ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.responsable && <p className="text-red-500 text-sm mt-1">{formErrors.responsable}</p>}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddOrUpdate}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FiSave className="mr-2" />
                  {formData.id ? 'Mettre à jour' : 'Enregistrer'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Mentions;