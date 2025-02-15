
const Parametres = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Paramètres Système</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4">
          Modifier les paramètres généraux, comme les taux de paiement, les dates limites, la configuration de sécurité, etc.
        </p>
        {/* Exemple de formulaire de paramètres */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Taux de la première tranche (%)
            </label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Ex : 30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date limite de paiement
            </label>
            <input
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          {/* Ajoutez d'autres champs de configuration */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Sauvegarder
          </button>
        </form>
      </div>
    </div>
  );
};

export default Parametres; 