import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  FiUsers, 
  FiUserCheck, 
  FiDollarSign, 
  FiBookOpen 
} from 'react-icons/fi';

// Enregistrement des composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Données factices pour la démonstration
  const statsCards = [
    { title: 'Étudiants Total', value: '1,234', icon: FiUsers, color: 'bg-blue-500' },
    { title: 'Professeurs', value: '56', icon: FiUserCheck, color: 'bg-green-500' },
    { title: 'Revenus Mensuel', value: '₣ 450,000', icon: FiDollarSign, color: 'bg-yellow-500' },
    { title: 'Cours Actifs', value: '24', icon: FiBookOpen, color: 'bg-purple-500' },
  ];

  const lineChartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [{
      label: 'Inscriptions 2024',
      data: [65, 78, 90, 85, 95, 100],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const doughnutData = {
    labels: ['L1', 'L2', 'L3', 'M1', 'M2'],
    datasets: [{
      data: [300, 250, 200, 150, 100],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }]
  };

  return (
    <div className="space-y-6">
      {/* Titre de la page avec animation */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800"
      >
        Tableau de Bord
      </motion.h1>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-lg bg-white p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className={`rounded-full ${card.color} p-3`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                <p className="text-xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Graphique des inscriptions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Évolution des Inscriptions
          </h3>
          <Line data={lineChartData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' }
            }
          }} />
        </motion.div>

        {/* Répartition des étudiants */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Répartition par Niveau
          </h3>
          <Doughnut data={doughnutData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' }
            }
          }} />
        </motion.div>
      </div>

      {/* Activités Récentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-white p-6 shadow-lg"
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Activités Récentes
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center border-b border-gray-200 pb-4 last:border-0">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">
                  Nouvel étudiant inscrit en L1 Informatique
                </p>
                <p className="text-xs text-gray-400">Il y a 2 heures</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;