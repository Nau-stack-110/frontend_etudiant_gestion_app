import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiLock, FiSave, FiCalendar, FiDollarSign, FiChevronDown, FiChevronUp 
} from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';

// Composant Skeleton pour la section Frais Scolarité
const FeesSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="rounded-lg border border-gray-200 p-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [academicYear, setAcademicYear] = useState({
    current: '2023-2024',
    start: '2023-09-01',
    end: '2024-06-30'
  });
  const [levels, setLevels] = useState([]);
  const [tarifs, setTarifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openLevels, setOpenLevels] = useState({}); 

  // URLs des APIs
  const apiBaseUrl = 'https://api-etudiant-esdes.onrender.com/api';
  const levelsUrl = `${apiBaseUrl}/niveau/`;
  const tarifsUrl = `${apiBaseUrl}/tarifs/`;

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [levelsResponse, tarifsResponse] = await Promise.all([
          axios.get(levelsUrl),
          axios.get(tarifsUrl)
        ]);
        setLevels(levelsResponse.data);
        setTarifs(tarifsResponse.data);
        
        // Initialiser les sections pliables (toutes fermées par défaut)
        setOpenLevels(
          levelsResponse.data.reduce((acc, level) => ({
            ...acc,
            [level.id]: false
          }), {})
        );
      } catch (err) {
        setError('Erreur lors du chargement des données', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors du chargement des niveaux ou tarifs'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Grouper les tarifs par niveau
  const groupedTarifs = levels.map(level => ({
    ...level,
    tarifs: tarifs.filter(tarif => tarif.niveau === level.id)
  }));

  // Gérer l'ouverture/fermeture des sections
  const toggleLevel = (levelId) => {
    setOpenLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId]
    }));
  };

  // Mettre à jour un tarif
  const handleTarifChange = (tarifId, newMontant) => {
    setTarifs(prev =>
      prev.map(tarif =>
        tarif.id === tarifId ? { ...tarif, montant: newMontant } : tarif
      )
    );
  };

  // Sauvegarder les modifications
  const handleSaveSettings = async () => {
    try {
      // Sauvegarder chaque tarif modifié
      const updatePromises = tarifs.map(tarif =>
        axios.put(`${tarifsUrl}${tarif.id}/`, {
          ...tarif,
          montant: parseFloat(tarif.montant)
        })
      );
      await Promise.all(updatePromises);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Paramètres enregistrés avec succès',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      setError('Erreur lors de la sauvegarde des paramètres', err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la sauvegarde des paramètres'
      });
    }
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: FiUser },
    { id: 'academic', label: 'Année Académique', icon: FiCalendar },
    { id: 'fees', label: 'Frais Scolarité', icon: FiDollarSign },
    { id: 'security', label: 'Sécurité', icon: FiLock },
  ];

  return (
    <div className="space-y-6 p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-gray-800"
      >
        Paramètres
      </motion.h1>

      {/* Onglets */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors
              ${activeTab === tab.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Paramètres généraux */}
        {activeTab === 'general' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border p-2 text-sm"
                  defaultValue="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-lg border p-2 text-sm"
                  defaultValue="john.doe@univ.mg"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Année Académique */}
        {activeTab === 'academic' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-4 text-lg font-medium">Année Académique Actuelle</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Année
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-lg border p-2 text-sm"
                    value={academicYear.current}
                    onChange={(e) => setAcademicYear(prev => ({
                      ...prev,
                      current: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date de début
                  </label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-lg border p-2 text-sm"
                    value={academicYear.start}
                    onChange={(e) => setAcademicYear(prev => ({
                      ...prev,
                      start: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-lg border p-2 text-sm"
                    value={academicYear.end}
                    onChange={(e) => setAcademicYear(prev => ({
                      ...prev,
                      end: e.target.value
                    }))}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Frais Scolarité */}
        {activeTab === 'fees' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {loading ? (
              <FeesSkeleton />
            ) : (
              <>
                <div className="space-y-4">
                  {groupedTarifs.map((level) => (
                    <div key={level.id} className="rounded-lg border border-gray-200">
                      <button
                        onClick={() => toggleLevel(level.id)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100"
                      >
                        <h3 className="text-lg font-medium">{level.nom}</h3>
                        {openLevels[level.id] ? (
                          <FiChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <FiChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      <AnimatePresence>
                        {openLevels[level.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-6"
                          >
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                              {level.tarifs.map((tarif) => (
                                <div key={tarif.id}>
                                  <label className="block text-sm font-medium text-gray-700">
                                    {tarif.designation}
                                  </label>
                                  <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 text-sm">
                                      Ar
                                    </span>
                                    <input
                                      type="number"
                                      className="block w-full rounded-none rounded-r-md border p-2 text-sm"
                                      value={tarif.montant}
                                      onChange={(e) => handleTarifChange(tarif.id, e.target.value)}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

              </>
            )}
          </motion.div>
        )}

        {/* Sécurité */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-lg border p-2 text-sm"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Bouton de sauvegarde */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          >
            <FiSave className="mr-2" />
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
