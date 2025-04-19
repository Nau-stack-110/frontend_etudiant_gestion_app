import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, FiLock, FiBell, 
  FiMonitor, FiSave, FiCalendar, FiDollarSign 
} from 'react-icons/fi';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    email: true,
    system: true,
    security: true
  });

  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('fr');

  const [academicYear, setAcademicYear] = useState({
    current: '2023-2024',
    start: '2023-09-01',
    end: '2024-06-30'
  });

  const [fees, setFees] = useState({
    L1: 1500000,
    L2: 1500000,
    L3: 1500000,
    M1: 1800000,
    M2: 1800000
  });

  const handleSaveSettings = () => {
    // Logique de sauvegarde des paramètres
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: FiUser },
    { id: 'academic', label: 'Année Académique', icon: FiCalendar },
    { id: 'fees', label: 'Frais Scolarité', icon: FiDollarSign },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Sécurité', icon: FiLock },
    { id: 'appearance', label: 'Apparence', icon: FiMonitor }
  ];

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800"
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
                  className="mt-1 block w-full rounded-lg border p-2"
                  defaultValue="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-lg border p-2"
                  defaultValue="john.doe@univ.mg"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Nouveau contenu pour l'onglet Année Académique */}
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
                    className="mt-1 block w-full rounded-lg border p-2"
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
                    className="mt-1 block w-full rounded-lg border p-2"
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
                    className="mt-1 block w-full rounded-lg border p-2"
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

        {/* Nouveau contenu pour l'onglet Frais Scolarité */}
        {activeTab === 'fees' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-4 text-lg font-medium">Frais de Scolarité par Niveau</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(fees).map(([level, amount]) => (
                  <div key={level}>
                    <label className="block text-sm font-medium text-gray-700">
                      {level}
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                        Ar
                      </span>
                      <input
                        type="number"
                        className="block w-full rounded-none rounded-r-md border p-2"
                        value={amount}
                        onChange={(e) => setFees(prev => ({
                          ...prev,
                          [level]: parseInt(e.target.value)
                        }))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-4 text-lg font-medium">Configuration des Tranches</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Paiement en 3 tranches</h4>
                    <p className="text-sm text-gray-500">
                      Permettre le paiement en plusieurs fois
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      defaultChecked
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      1ère Tranche (%)
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-lg border p-2"
                      defaultValue="40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      2ème Tranche (%)
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-lg border p-2"
                      defaultValue="30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      3ème Tranche (%)
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-lg border p-2"
                      defaultValue="30"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications par email</h3>
                  <p className="text-sm text-gray-500">
                    Recevoir des notifications par email
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => setNotifications(prev => ({
                      ...prev,
                      email: !prev.email
                    }))}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications système</h3>
                  <p className="text-sm text-gray-500">
                    Recevoir des notifications dans l&apos;application
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={notifications.system}
                    onChange={() => setNotifications(prev => ({
                      ...prev,
                      system: !prev.system
                    }))}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                </label>
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
                  className="mt-1 block w-full rounded-lg border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-lg border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-lg border p-2"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Apparence */}
        {activeTab === 'appearance' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Thème
                </label>
                <select
                  className="mt-1 block w-full rounded-lg border p-2"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="system">Système</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Langue
                </label>
                <select
                  className="mt-1 block w-full rounded-lg border p-2"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="mg">Malagasy</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bouton de sauvegarde */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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