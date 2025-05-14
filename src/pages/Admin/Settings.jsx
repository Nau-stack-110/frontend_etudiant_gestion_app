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
  const [activeTab, setActiveTab] = useState('fees');
  const [academicYears, setAcademicYears] = useState([]);
  const [newYear, setNewYear] = useState('');
  const [loadingYears, setLoadingYears] = useState(true);
  const [levels, setLevels] = useState([]);
  const [tarifs, setTarifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openLevels, setOpenLevels] = useState({}); 
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [newTarif, setNewTarif] = useState({ designation: '', montant: '', niveau: null });
  const [newLevel, setNewLevel] = useState('');

  // URLs des APIs
  const apiBaseUrl = 'https://api-etudiant-esdes.onrender.com/api';
  const levelsUrl = `${apiBaseUrl}/niveau/`;
  const tarifsUrl = `${apiBaseUrl}/tarifs/`;
  const academicYearsUrl = `${apiBaseUrl}/annee-academique/`;
  const changePasswordUrl = `${apiBaseUrl}/change-password/`;

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadingYears(true);
      try {
        const [levelsResponse, tarifsResponse, yearsResponse] = await Promise.all([
          axios.get(levelsUrl),
          axios.get(tarifsUrl),
          axios.get(academicYearsUrl)
        ]);
        setLevels(levelsResponse.data);
        setTarifs(tarifsResponse.data);
        setAcademicYears(yearsResponse.data);
        
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
          text: 'Erreur lors du chargement des données'
        });
      } finally {
        setLoading(false);
        setLoadingYears(false);
      }
    };
    fetchData();
  }, []);

  // Valider le format de l'année académique (ex: 2024-2025)
  const validateYearFormat = (year) => {
    const regex = /^(\d{4})-(\d{4})$/;
    if (!regex.test(year)) return false;
    
    const [start, end] = year.split('-').map(Number);
    return end === start + 1;
  };

  // Créer une nouvelle année académique
  const handleCreateYear = async () => {
    if (!newYear) return;
    
    if (!validateYearFormat(newYear)) {
      Swal.fire({
        icon: 'error',
        title: 'Format invalide',
        text: 'Le format doit être AAAA-AAAA (ex: 2024-2025) et les années doivent être consécutives'
      });
      return;
    }
    
    try {
      setLoadingYears(true);
      const response = await axios.post(academicYearsUrl, {
        annee: newYear,
        active: false
      });
      setAcademicYears([...academicYears, response.data]);
      setNewYear('');
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Année académique créée avec succès',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      setError('Erreur lors de la création de l\'année', err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la création de l\'année académique'
      });
    } finally {
      setLoadingYears(false);
    }
  };

  // Mettre à jour une année académique
  const handleUpdateYear = async (id, newData) => {
    try {
      setLoadingYears(true);
      const response = await axios.put(`${academicYearsUrl}${id}/`, newData);
      setAcademicYears(academicYears.map(year => 
        year.id === id ? response.data : year
      ));
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Année académique mise à jour avec succès',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'année', err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la mise à jour de l\'année académique'
      });
    } finally {
      setLoadingYears(false);
    }
  };

  // Supprimer une année académique
  const handleDeleteYear = async (id) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer cette année académique ?',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });
    
    if (!confirm.isConfirmed) return;
    
    try {
      setLoadingYears(true);
      await axios.delete(`${academicYearsUrl}${id}/`);
      setAcademicYears(academicYears.filter(year => year.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Année académique supprimée avec succès',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      setError('Erreur lors de la suppression de l\'année', err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la suppression de l\'année académique'
      });
    } finally {
      setLoadingYears(false);
    }
  };

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

  // Ajouter un nouveau tarif
  const handleAddTarif = async (levelId) => {
    if (!newTarif.designation || !newTarif.montant) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs du nouveau tarif.'
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(tarifsUrl, {
        designation: newTarif.designation,
        montant: parseFloat(newTarif.montant),
        niveau: levelId
      });
      
      setTarifs([...tarifs, response.data]);
      setNewTarif({ designation: '', montant: '', niveau: null });
      
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Nouveau tarif ajouté avec succès',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      setError('Erreur lors de l\'ajout du tarif', err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de l\'ajout du nouveau tarif'
      });
    } finally {
      setLoading(false);
    }
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

  // Changer le mot de passe
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs.'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le nouveau mot de passe et la confirmation ne correspondent pas.'
      });
      return;
    }

    if (newPassword.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le nouveau mot de passe doit contenir au moins 8 caractères.'
      });
      return;
    }

    try {
      setPasswordLoading(true);
      const response = await axios.post(changePasswordUrl, {
        old_password: oldPassword,
        new_password: newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: response.data.message || 'Mot de passe changé avec succès',
        timer: 1500,
        showConfirmButton: false
      });
      
      // Réinitialiser les champs
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      let errorMessage = 'Erreur lors du changement de mot de passe';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.old_password || err.response.data.new_password || errorMessage;
      }
      setError(errorMessage);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMessage
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Créer un nouveau niveau
  const handleCreateLevel = async () => {
    if (!newLevel) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez entrer un nom pour le nouveau niveau.'
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(levelsUrl, {
        nom: newLevel
      });
      // Ajouter le nouveau niveau au début du tableau
      setLevels([response.data, ...levels]);
      setNewLevel('');
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Niveau créé avec succès',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      setError('Erreur lors de la création du niveau', err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la création du niveau'
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'academic', label: 'Année Académique', icon: FiCalendar },
    { id: 'fees', label: 'Frais Scolarité', icon: FiDollarSign },
    { id: 'levels', label: 'Niveaux', icon: FiUser },
    { id: 'security', label: 'Sécurité', icon: FiLock },
  ];

  return (
    <div className="space-y-4 p-6">
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

        {/* Année Académique */}
        {activeTab === 'academic' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-4 text-lg font-medium">Années Académiques</h3>
              
              {loadingYears ? (
                <div className="animate-pulse space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-10 bg-gray-200 rounded w-full"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {academicYears.map(year => (
                    <div key={year.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <span className="font-medium mr-3">{year.annee}</span>
                        {year.active && (
                          <span className="text-xs text-green-500 bg-green-100 px-2 py-1 rounded">Active</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateYear(year.id, { ...year, active: !year.active })}
                          className={`text-sm px-3 py-1 rounded ${year.active ? 'bg-gray-200 text-gray-700' : 'bg-green-500 text-white'}`}
                        >
                          {year.active ? 'Désactiver' : 'Activer'}
                        </button>
                        <button
                          onClick={() => handleDeleteYear(year.id)}
                          className="text-sm px-3 py-1 bg-red-500 text-white rounded"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="mb-3 text-md font-medium">Ajouter une nouvelle année</h4>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="2024-2025"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="flex-1 rounded-lg border p-2 text-sm"
                  />
                  <button
                    onClick={handleCreateYear}
                    disabled={loadingYears || !newYear}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    Ajouter
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Format attendu : AAAA-AAAA (ex: 2024-2025)</p>
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
                            
                            {/* Ajout d'un nouveau tarif */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                              <h4 className="mb-3 text-md font-medium">Ajouter un nouveau tarif</h4>
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Désignation
                                  </label>
                                  <input
                                    type="text"
                                    className="mt-1 block w-full rounded-lg border p-2 text-sm"
                                    value={newTarif.designation}
                                    onChange={(e) => setNewTarif({...newTarif, designation: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Montant
                                  </label>
                                  <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 text-sm">
                                      Ar
                                    </span>
                                    <input
                                      type="number"
                                      className="block w-full rounded-none rounded-r-md border p-2 text-sm"
                                      value={newTarif.montant}
                                      onChange={(e) => setNewTarif({...newTarif, montant: e.target.value})}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 flex justify-end">
                                <button
                                  onClick={() => handleAddTarif(level.id)}
                                  disabled={loading || !newTarif.designation || !newTarif.montant}
                                  className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:bg-gray-300"
                                >
                                  Ajouter le tarif
                                </button>
                              </div>
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

        {/* Niveaux */}
        {activeTab === 'levels' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Gestion des Niveaux</h3>
                <p className="text-sm text-gray-500">Nombre de niveaux existants : {levels.length}</p>
              </div>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-10 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {levels.map(level => (
                  <div key={level.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span className="font-medium">{level.nom}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="mb-3 text-md font-medium">Ajouter un nouveau niveau</h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Nom du niveau"
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                  className="flex-1 rounded-lg border p-2 text-sm"
                />
                <button
                  onClick={handleCreateLevel}
                  disabled={loading || !newLevel}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Ajouter
                </button>
              </div>
            </div>
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
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-lg border p-2 text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">Le mot de passe doit contenir au moins 8 caractères</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-lg border p-2 text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:bg-gray-300"
              >
                {passwordLoading ? 'Changement en cours...' : 'Changer le mot de passe'}
              </button>
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