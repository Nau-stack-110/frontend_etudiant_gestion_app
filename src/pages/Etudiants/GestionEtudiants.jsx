import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';
import { FaEdit, FaPlus, FaFileExcel, FaFilePdf, FaUpload, FaQrcode } from 'react-icons/fa';

const GestionEtudiants = () => {
  // Exemple de données initiales pour des étudiants universitaires
  const initialStudents = [
    { id: 1, name: 'Jean Dupont', matricule: 'U1001', parcours: 'Informatique', classe: 'Licence', status: 'Inscrit' },
    { id: 2, name: 'Marie Curie', matricule: 'U1002', parcours: 'Chimie', classe: 'Master', status: 'Payé 1 tranche' },
    { id: 3, name: 'Albert Camus', matricule: 'U1003', parcours: 'Philosophie', classe: 'Doctorat', status: 'Inscrit' },
    { id: 4, name: 'Simone de Beauvoir', matricule: 'U1004', parcours: 'Lettres', classe: 'Licence', status: 'Payé 2 tranche' },
    { id: 5, name: 'Blaise Pascal', matricule: 'U1005', parcours: 'Mathématiques', classe: 'Master', status: 'Inscrit' },
    { id: 6, name: 'René Descartes', matricule: 'U1006', parcours: 'Philosophie', classe: 'Doctorat', status: 'Payé 3 tranche' },
    // Ajoutez d'autres étudiants au besoin
  ];

  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrer les étudiants en fonction de la recherche (par nom ou matricule)
  const filteredStudents = useMemo(
    () =>
      students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.matricule.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [students, searchQuery]
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Fonction pour exporter des données (simulée)
  const handleExport = (format) => {
    Swal.fire('Exportation', `Données exportées en format ${format}`, 'success');
  };

  // Fonction pour importer via Excel (simulée)
  const handleImport = () => {
    Swal.fire({
      title: 'Importer des données',
      text: 'Sélectionnez un fichier Excel contenant les informations des étudiants.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Importer',
      cancelButtonText: 'Annuler',
      input: 'file',
      inputAttributes: {
        accept: '.xlsx, .xls',
        'aria-label': 'Importer un fichier Excel'
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // Simulation de l'importation
        Swal.fire('Importé!', "Les données ont été importées.", 'success');
      }
    });
  };

  // Modal de création d'un nouvel étudiant
  const handleCreate = () => {
    Swal.fire({
      title: 'Ajouter un étudiant',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Nom">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Matricule (ex: U1007)">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Parcours (ex: Informatique)">` +
        `<input id="swal-input4" class="swal2-input" placeholder="Classe (ex: Licence, Master, Doctorat)">` +
        `<select id="swal-input5" class="swal2-input">
            <option value="">Sélectionner Statut</option>
            <option value="Inscrit">Inscrit</option>
            <option value="Payé 1 tranche">Payé 1 tranche</option>
            <option value="Payé 2 tranche">Payé 2 tranche</option>
            <option value="Payé 3 tranche">Payé 3 tranche</option>
         </select>`,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value;
        const matricule = document.getElementById('swal-input2').value;
        const parcours = document.getElementById('swal-input3').value;
        const classe = document.getElementById('swal-input4').value;
        const status = document.getElementById('swal-input5').value;
        if (!name || !matricule || !parcours || !classe || !status) {
          Swal.showValidationMessage('Tous les champs doivent être remplis.');
          return false;
        }
        return { name, matricule, parcours, classe, status };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
        const newStudent = { id: newId, ...result.value };
        setStudents((prev) => [...prev, newStudent]);
        Swal.fire('Ajouté!', "L'étudiant a été ajouté.", 'success');
      }
    });
  };

  // Modal de modification d'un étudiant
  const handleModify = (student) => {
    Swal.fire({
      title: 'Modifier l\'étudiant',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Nom" value="${student.name}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Matricule" value="${student.matricule}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Parcours" value="${student.parcours}">` +
        `<input id="swal-input4" class="swal2-input" placeholder="Classe" value="${student.classe}">` +
        `<select id="swal-input5" class="swal2-input">
            <option value="Inscrit" ${student.status === 'Inscrit' ? 'selected' : ''}>Inscrit</option>
            <option value="Payé 1 tranche" ${student.status === 'Payé 1 tranche' ? 'selected' : ''}>Payé 1 tranche</option>
            <option value="Payé 2 tranche" ${student.status === 'Payé 2 tranche' ? 'selected' : ''}>Payé 2 tranche</option>
            <option value="Payé 3 tranche" ${student.status === 'Payé 3 tranche' ? 'selected' : ''}>Payé 3 tranche</option>
         </select>`,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value;
        const matricule = document.getElementById('swal-input2').value;
        const parcours = document.getElementById('swal-input3').value;
        const classe = document.getElementById('swal-input4').value;
        const status = document.getElementById('swal-input5').value;
        if (!name || !matricule || !parcours || !classe || !status) {
          Swal.showValidationMessage('Tous les champs doivent être remplis.');
          return false;
        }
        return { name, matricule, parcours, classe, status };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setStudents((prev) =>
          prev.map((s) =>
            s.id === student.id ? { ...s, ...result.value } : s
          )
        );
        Swal.fire('Modifié!', "Les informations de l'étudiant ont été mises à jour.", 'success');
      }
    });
  };

  // Modal d'affichage du QR Code de l'étudiant
  const handleQRCode = (student) => {
    const qrData = student.matricule; // On peut inclure d'autres infos si nécessaire
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=150x150`;
    Swal.fire({
      title: `QR Code de ${student.name}`,
      html: `<img src="${qrCodeUrl}" alt="QR Code" />`,
      confirmButtonText: 'Fermer'
    });
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Titre de la page */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Étudiants</h1>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreate}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow"
              >
                <FaPlus className="mr-2" /> Ajouter
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleImport}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 shadow"
              >
                <FaUpload className="mr-2" /> Importer
              </motion.button>
            </div>
          </div>
        </div>

        {/* Barre d'outils : recherche et export */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="text-gray-600">
              {filteredStudents.length} résultat{filteredStudents.length !== 1 ? 's' : ''}
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleExport('Excel')}
                className="flex items-center px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 shadow"
              >
                <FaFileExcel className="mr-2" /> Export Excel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleExport('PDF')}
                className="flex items-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 shadow"
              >
                <FaFilePdf className="mr-2" /> Export PDF
              </motion.button>
            </div>
          </div>
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Rechercher par nom ou matricule..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tableau des étudiants */}
        <div className="overflow-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Matricule</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Parcours</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Classe</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.matricule}</td>
                  <td className="px-6 py-4">{student.parcours}</td>
                  <td className="px-6 py-4">{student.classe}</td>
                  <td className="px-6 py-4">{student.status}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleModify(student)}
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      <FaEdit className="mr-1" /> Modifier
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQRCode(student)}
                      className="text-purple-500 hover:underline flex items-center"
                    >
                      <FaQrcode className="mr-1" /> Scanner QR
                    </motion.button>
                  </td>
                </tr>
              ))}
              {paginatedStudents.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Aucun étudiant trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default GestionEtudiants; 