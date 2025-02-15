import  { useState } from 'react';
import { motion } from 'framer-motion';
import { FaQrcode } from 'react-icons/fa';

const Etudiants = () => {
  const initialStudents = [
    { id: 1, nom: 'Alice Dupont', matricule: 'E1234', classe: 'Licence 1' },
    { id: 2, nom: 'Bob Martin', matricule: 'E5678', classe: 'Licence 2' },
    { id: 3, nom: 'Charlie Durand', matricule: 'E9012', classe: 'Master 1' },
  ];

  const [students] = useState(initialStudents);
  const [search, setSearch] = useState('');

  const filteredStudents = students.filter(student =>
    student.nom.toLowerCase().includes(search.toLowerCase()) ||
    student.matricule.toLowerCase().includes(search.toLowerCase()) ||
    student.classe.toLowerCase().includes(search.toLowerCase())
  );

  const handleScanQRCode = (id) => {
    alert(`Scanner le QR Code pour l'étudiant ${id} - fonctionnalité à implémenter.`);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Gestion des Étudiants</h1>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <input 
          type="text" 
          placeholder="Rechercher étudiant, matricule ou classe" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full sm:w-1/3 mb-2 sm:mb-0"
        />
      </div>
      <div className="overflow-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left">Nom</th>
              <th className="py-3 px-4 text-left">Matricule</th>
              <th className="py-3 px-4 text-left">Classe</th>
              <th className="py-3 px-4 text-left">QR Code</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-4">{student.nom}</td>
                <td className="py-3 px-4">{student.matricule}</td>
                <td className="py-3 px-4">{student.classe}</td>
                <td className="py-3 px-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleScanQRCode(student.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    <FaQrcode />
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Etudiants; 