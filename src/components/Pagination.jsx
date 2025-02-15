import { motion } from 'framer-motion';

// eslint-disable-next-line react/prop-types
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 bg-blue-500 text-white rounded ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        Précédent
      </motion.button>
      {pageNumbers.map((number) => (
        <motion.button
          key={number}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 rounded ${
            currentPage === number
              ? "bg-blue-700 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
          }`}
        >
          {number}
        </motion.button>
      ))}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 bg-blue-500 text-white rounded ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        Suivant
      </motion.button>
    </div>
  );
};

export default Pagination; 