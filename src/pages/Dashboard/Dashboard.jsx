import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaUsers, FaMoneyBillWave, FaUserGraduate } from 'react-icons/fa';

// Enregistrement des composants de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Données fictives pour le graphique évolutif des paiements
  // On présente l'évolution des étudiants payés et non payés
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Payés",
        data: [800, 900, 1000, 950, 1100, 1200],
        borderColor: "#4BC0C0",
        backgroundColor: "rgba(75, 192, 192, 0.4)",
        tension: 0.4,
      },
      {
        label: "Non Payés",
        data: [200, 150, 300, 400, 350, 320],
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.4)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: "Évolution des étudiants (Payés vs Non Payés)" },
    },
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Tableau de Bord</h1>
      
      {/* Cartes Résumées avec icônes et animations pour les statistiques globales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4"
        >
          <div className="text-blue-500 text-4xl">
            <FaUsers />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Utilisateurs</h2>
            <p className="text-2xl font-bold">1500</p>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4"
        >
          <div className="text-green-500 text-4xl">
            <FaMoneyBillWave />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Paiements</h2>
            <p className="text-2xl font-bold">3200</p>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4"
        >
          <div className="text-purple-500 text-4xl">
            <FaUserGraduate />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Étudiants</h2>
            <p className="text-2xl font-bold">1300</p>
          </div>
        </motion.div>
      </div>

      {/* Graphique interactif illustrant uniquement l'évolution des paiements */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Évolution des étudiants (Payés vs Non Payés)</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard; 