import { motion } from 'framer-motion';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  FaUsers,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaCodeBranch,
  FaArchive,
  FaLayerGroup,
  FaBook,
} from 'react-icons/fa';
import { useState, useEffect } from 'react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {

      try {
        const response = await fetch('https://api-etudiant-esdes.onrender.com/api/stats/');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStatsData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Stats cards configuration with updated icons
  const statsCards = statsData
    ? [
        { title: 'Étudiants', value: statsData.total_utilisateurs, icon: FaUsers, color: 'bg-blue-600' },
        { title: 'Professeurs', value: statsData.total_professeurs, icon: FaChalkboardTeacher, color: 'bg-green-600' },
        { title: 'Utilisateurs', value: statsData.total_etudiants, icon: FaUserGraduate, color: 'bg-red-600' },
        { title: 'Mentions', value: statsData.total_mentions, icon: FaCodeBranch, color: 'bg-yellow-600' },
        { title: 'Parcours', value: statsData.total_parcours, icon: FaArchive, color: 'bg-teal-600' },
        { title: 'Niveaux', value: statsData.total_niveaux, icon: FaLayerGroup, color: 'bg-orange-600' },
        { title: 'Cours Actifs', value: statsData.total_matieres, icon: FaBook, color: 'bg-purple-600' },
      ]
    : [];

  // Bar chart data
  const barChartData = statsData
    ? {
        labels: statsData.etudiants_par_mention.map((item) => item.mention),
        datasets: [
          {
            label: 'Étudiants par Mention',
            data: statsData.etudiants_par_mention.map((item) => item.total_etudiants),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            borderWidth: 1,
          },
        ],
      }
    : { labels: [], datasets: [] };

  // Doughnut chart data
  const doughnutData = statsData
    ? {
        labels: statsData.etudiants_par_niveau.map((item) => item.niveau),
        datasets: [
          {
            data: statsData.etudiants_par_niveau.map((item) => item.total_etudiants),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          },
        ],
      }
    : { labels: [], datasets: [{ data: [], backgroundColor: [] }] };

  // Tuition fees table data
  const tuitionTableData = statsData
    ? statsData.frais_scolarite_payes.par_niveau.map((niveau) => ({
        niveau: niveau.niveau,
        etudiants_ayant_paye: niveau.etudiants_ayant_paye,
        details: niveau.par_designation.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.designation]: curr.etudiants_ayant_paye,
          }),
          {}
        ),
      }))
    : [];

  // Skeleton loader
  const SkeletonLoader = () => (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded"></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="rounded-lg bg-gray-200 p-4 h-20"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg bg-gray-200 p-4 h-48"></div>
        <div className="rounded-lg bg-gray-200 p-4 h-48"></div>
      </div>
      <div className="rounded-lg bg-gray-200 p-4 h-48"></div>
    </div>
  );

  if (loading) {
    return <div className="p-4 md:p-6"><SkeletonLoader /></div>;
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500 flex items-center justify-center">
        <FaBook className="mr-2" /> Erreur : {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            className="rounded-xl bg-white p-4 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center">
              <div className={`rounded-full ${card.color} p-2.5`}>
                <card.icon className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h3 className="text-xs md:text-sm font-medium text-gray-500">{card.title}</h3>
                <p className="text-lg md:text-xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Table */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          className="rounded-xl bg-white p-4 shadow-md transition-all duration-300"
        >
          <h3 className="mb-3 text-base md:text-lg font-semibold text-gray-800">
            Étudiants par Mention
          </h3>
          <div className="h-64 md:h-72">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    cornerRadius: 8,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Nombre d\'Étudiants' },
                  },
                  x: {
                    title: { display: true, text: 'Mention' },
                  },
                },
              }}
            />
          </div>
        </motion.div>

        {/* Doughnut chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          className="rounded-xl bg-white p-4 shadow-md transition-all duration-300"
        >
          <h3 className="mb-3 text-base md:text-lg font-semibold text-gray-800">
            Répartition par Niveau
          </h3>
          <div className="h-64 md:h-72">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    cornerRadius: 8,
                  },
                },
              }}
            />
          </div>
        </motion.div>

        {/* Tuition fees table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl bg-white p-4 shadow-md lg:col-span-2"
        >
          <h3 className="mb-3 text-base md:text-lg font-semibold text-gray-800">
            Frais de Scolarité Payés par Niveau
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {['Niveau', 'Étudiants Ayant Payé', 'Tranche 1', 'Tranche 2', 'Tranche 3', 'Inscription', 'Réinscription', 'Autres'].map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tuitionTableData.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.niveau}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">{row.etudiants_ayant_paye}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-green-600">{row.details['Tranche 1'] || 0}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-yellow-600">{row.details['Tranche 2'] || 0}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-red-600">{row.details['Tranche 3'] || 0}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-purple-600">{row.details['Inscription'] || 0}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-teal-600">{row.details['Réinscription'] || 0}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-600">{row.details['Autres'] || 0}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;