import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Courses = () => {
  const [parcours, setParcours] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMention, setSelectedMention] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parcoursRes, mentionsRes] = await Promise.all([
          fetch('http://localhost:8000/api/parcours/'),
          fetch('http://localhost:8000/api/mentions/')
        ]);
        
        const parcoursData = await parcoursRes.json();
        const mentionsData = await mentionsRes.json();
        
        setParcours(parcoursData);
        setMentions(mentionsData);
      } catch (error) {
        Swal.fire('Erreur', 'Impossible de charger les données', 'error');
      }
    };
    
    fetchData();
  }, []);

  const filteredParcours = parcours.filter(p => {
    const searchMatch = p.nom_parcours.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.mention_nom.toLowerCase().includes(searchTerm.toLowerCase());
    const mentionMatch = selectedMention === 'all' || p.mention.toString() === selectedMention;
    return searchMatch && mentionMatch;
  });

  // Calcul de la pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredParcours.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredParcours.length / itemsPerPage);

  const handleAddParcours = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Ajouter un Parcours',
      html: `
        <div class="space-y-4">
          <input id="nom" class="swal2-input" placeholder="Nom du parcours">
          <select id="mention" class="swal2-input">
            <option value="">Sélectionner une mention</option>
            ${mentions.map(m => 
              `<option value="${m.id}">${m.nom_mention}</option>`
            ).join('')}
          </select>
        </div>
      `,
      preConfirm: () => ({
        nom_parcours: document.getElementById('nom').value,
        mention: document.getElementById('mention').value
      }),
      validation: (values) => !values.nom_parcours || !values.mention ? 'Champs requis' : null
    });

    if (formValues) {
      try {
        const response = await fetch('http://localhost:8000/api/parcours/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formValues)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.detail || JSON.stringify(data));
        }

        setParcours([...parcours, data]);
        Swal.fire('Succès!', 'Parcours ajouté', 'success');
      } catch (error) {
        Swal.fire('Erreur', error.message.replace(/["{}]/g, ''), 'error');
      }
    }
  };

  const handleEditParcours = async (selectedParcours) => {
    const { value: formValues } = await Swal.fire({
      title: 'Modifier le Parcours',
      html: `
        <div class="space-y-4">
          <input id="nom" class="swal2-input" value="${selectedParcours.nom_parcours}">
          <select id="mention" class="swal2-input">
            ${mentions.map(m => 
              `<option value="${m.id}" ${m.id === parcours.mention ? 'selected' : ''}>${m.nom_mention}</option>`
            ).join('')}
          </select>
        </div>
      `,
      preConfirm: () => ({
        nom_parcours: document.getElementById('nom').value,
        mention: document.getElementById('mention').value
      })
    });

      if (formValues) {
        try {
          const response = await fetch(`http://localhost:8000/api/parcours/${selectedParcours.id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formValues)
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.detail || JSON.stringify(data));
          }
    
          // Correction ici : utiliser le nom correct de la variable d'état
          setParcours(prevParcours => 
            prevParcours.map(p => p.id === data.id ? data : p)
          );
          
          Swal.fire('Succès!', 'Modifications enregistrées', 'success');
        } catch (error) {
          Swal.fire('Erreur', error.message.replace(/["{}]/g, ''), 'error');
        }
      }
    };

  const handleDeleteParcours = async (id) => {
    const confirmation = await Swal.fire({
      title: 'Confirmer la suppression?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true
    });

    if (confirmation.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8000/api/parcours/${id}/`, { 
          method: 'DELETE' 
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || JSON.stringify(errorData));
        }

        setParcours(parcours.filter(p => p.id !== id));
        Swal.fire('Supprimé!', 'Parcours supprimé', 'success');
      } catch (error) {
        Swal.fire('Erreur', error.message.replace(/["{}]/g, ''), 'error');
      }
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-4"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Gestion des Parcours</h1>
        <button
          onClick={handleAddParcours}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
        >
          <FiPlus className="mr-2" /> Nouveau Parcours
        </button>
      </motion.div>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un parcours..."
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
            {mentions.map(mention => (
              <option key={mention.id} value={mention.id}>
                {mention.nom_mention}
              </option>
            ))}
          </select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mention</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map(parcours => (
              <motion.tr
                key={parcours.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: '#f8fafc' }}
                className="transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-900">{parcours.nom_parcours}</td>
                <td className="px-6 py-4 text-gray-600">{parcours.mention_nom}</td>
                <td className="px-6 py-4 space-x-3">
                  <button
                    onClick={() => handleEditParcours(parcours)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteParcours(parcours.id)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <div className="mt-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Affichage de {startIndex + 1} à {Math.min(endIndex, filteredParcours.length)} sur {filteredParcours.length}
          </span>
          <div className="space-x-2">
            <button
              className={`px-4 py-2 text-sm bg-gray-100 rounded-lg ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
              }`}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <button
              className={`px-4 py-2 text-sm bg-gray-100 rounded-lg ${
                currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
              }`}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;