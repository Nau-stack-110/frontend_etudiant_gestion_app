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
import { FaMoneyBillWave, FaHourglassHalf, FaChartLine } from 'react-icons/fa';

// Enregistrement des éléments de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ComptableDashboard = () => {
  // Données simulées pour les cartes statistiques
  const totalPayments = 1200;
  const pendingPayments = 200;
  const paymentsByTranche = 5000; // montant total par tranche

  // Données du graphique (paiements réalisés et en attente par mois)
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Paiements réalisés",
        data: [150, 200, 180, 250, 230, 300],
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.4)',
        tension: 0.4,
      },
      {
        label: "Paiements en attente",
        data: [30, 20, 40, 15, 50, 25],
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: "Paiements réalisés par mois" },
    },
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Tableau de Bord Comptable</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <div className="text-green-500 text-4xl">
            <FaMoneyBillWave />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Paiements Réalisés</h2>
            <p className="text-2xl font-bold">{totalPayments}</p>
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <div className="text-red-500 text-4xl">
            <FaHourglassHalf />
          </div>
          <div>
            <h2 className="text-xl font-semibold">En Attente</h2>
            <p className="text-2xl font-bold">{pendingPayments}</p>
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <div className="text-blue-500 text-4xl">
            <FaChartLine />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Montant par Tranche</h2>
            <p className="text-2xl font-bold">{paymentsByTranche} Ar</p>
          </div>
        </motion.div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ComptableDashboard; 