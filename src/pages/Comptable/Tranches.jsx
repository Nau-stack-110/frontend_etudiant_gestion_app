import { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaEdit } from 'react-icons/fa';

const Tranches = () => {
  const initialTranches = [
    { id: 1, nom: 'Tranche 1', montant: '1000', dateLimite: '2023-10-15' },
    { id: 2, nom: 'Tranche 2', montant: '1500', dateLimite: '2023-11-15' },
    { id: 3, nom: 'Tranche 3', montant: '2000', dateLimite: '2023-12-15' },
  ];

  const [tranches, setTranches] = useState(initialTranches);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTranche, setEditingTranche] = useState(null);

  // Lorsqu'on clique sur "Modifier", on ouvre le modal avec les infos de la tranche sélectionnée
  const handleModify = (id) => {
    const tranche = tranches.find(t => t.id === id);
    if (tranche) {
      setEditingTranche({ ...tranche });
      setIsEditModalOpen(true);
    }
  };

  // Traitement de la soumission du formulaire d'édition
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedTranches = tranches.map(t => 
      t.id === editingTranche.id ? editingTranche : t
    );
    setTranches(updatedTranches);
    setIsEditModalOpen(false);
    Swal.fire({
      icon: 'success',
      title: 'Mise à jour réussie',
      text: 'La tranche a été mise à jour avec succès!',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Gestion des Tranches de Paiement</h1>
      <div className="overflow-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left">Tranche</th>
              <th className="py-3 px-4 text-left">Montant</th>
              <th className="py-3 px-4 text-left">Date Limite</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {tranches.map((tranche) => (
              <tr key={tranche.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-4">{tranche.nom}</td>
                <td className="py-3 px-4">{tranche.montant} Ar</td>
                <td className="py-3 px-4">{tranche.dateLimite}</td>
                <td className="py-3 px-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleModify(tranche.id)}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    <FaEdit />
                    <span>Modifier</span>
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal d'édition */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white p-6 rounded-md w-96"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaEdit />
              Modifier la Tranche
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nom</label>
                <input
                  type="text"
                  value={editingTranche?.nom}
                  onChange={(e) => setEditingTranche({ ...editingTranche, nom: e.target.value })}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Montant (Ar)</label>
                <input
                  type="number"
                  value={editingTranche?.montant}
                  onChange={(e) => setEditingTranche({ ...editingTranche, montant: e.target.value })}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Date Limite</label>
                <input
                  type="date"
                  value={editingTranche?.dateLimite}
                  onChange={(e) => setEditingTranche({ ...editingTranche, dateLimite: e.target.value })}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Tranches; 