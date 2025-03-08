import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCheck, FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tel: '',
    password: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldValidity, setFieldValidity] = useState({
    name: false,
    email: false,
    tel: false,
    password: false
  });
  const navigate = useNavigate();

  // Validations
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateTel = (tel) => /^\d{10}$/.test(tel);
  const validateName = (name) => name.trim().length >= 3;

  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (pass.match(/[A-Z]/)) strength += 1;
    if (pass.match(/[0-9]/)) strength += 1;
    if (pass.match(/[^A-Za-z0-9]/)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update field validity
    switch(name) {
      case 'name':
        setFieldValidity(prev => ({ ...prev, [name]: validateName(value) }));
        break;
      case 'email':
        setFieldValidity(prev => ({ ...prev, [name]: validateEmail(value) }));
        break;
      case 'tel':
        setFieldValidity(prev => ({ ...prev, [name]: validateTel(value) }));
        break;
      case 'password':
        setFieldValidity(prev => ({ ...prev, [name]: checkPasswordStrength(value) >= 3 }));
        setPasswordStrength(checkPasswordStrength(value));
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...formData,
        tel: String(formData.tel)
      };

      await axios.post(
        'http://localhost:4000/api/auth/signup',
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      await Swal.fire({
        icon: 'success',
        title: 'Inscription réussie!',
        text: 'Vous pouvez maintenant vous connecter',
        showConfirmButton: true
      });
      
      navigate('/login');

    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur d\'inscription',
        text: error.response?.data?.message || 'Une erreur est survenue'
      });
    }
  };

  const strengthLabels = {
    0: { text: 'Faible', color: 'bg-red-500', width: 'w-1/4' },
    1: { text: 'Moyen', color: 'bg-yellow-500', width: 'w-1/2' },
    2: { text: 'Bon', color: 'bg-blue-500', width: 'w-3/4' },
    3: { text: 'Fort', color: 'bg-green-500', width: 'w-full' },
    4: { text: 'Très fort', color: 'bg-green-600', width: 'w-full' }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-100 p-4"
    >
      <div className="flex w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex-col md:flex-row">
        {/* Left Section - Branding */}
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white flex flex-col justify-center text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-6xl mb-6">🎓</div>
            <h1 className="text-3xl font-bold mb-4">Rejoignez GestEtu Pro</h1>
            <p className="text-lg opacity-90">
              Système de gestion universitaire moderne et efficace
            </p>
            <div className="mt-8 space-y-2 text-sm opacity-75">
              <p>✓ Interface intuitive et sécurisée</p>
              <p>✓ Gestion complète des dossiers étudiants</p>
              <p>✓ Suivi en temps réel des paiements</p>
              <p>✓ Rapports et statistiques détaillés</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Section - Form */}
        <motion.div
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          className="md:w-1/2 p-8 md:p-12"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold mb-8 text-center text-gray-800"
          >
            Créer un compte administratif
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group"
            >
              <div className="flex items-center border-b-2 border-gray-300 group-hover:border-indigo-500 pb-2 transition-colors">
                <FaUser className="text-gray-500 group-hover:text-indigo-500 mr-3 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent pr-8"
                  placeholder="Nom complet"
                  required
                />
                {fieldValidity.name && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-2 top-1 text-green-500"
                  >
                    <FaCheck />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative group"
            >
              <div className="flex items-center border-b-2 border-gray-300 group-hover:border-indigo-500 pb-2 transition-colors">
                <FaEnvelope className="text-gray-500 group-hover:text-indigo-500 mr-3 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent pr-8"
                  placeholder="Email professionnel"
                  required
                />
                {fieldValidity.email && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-2 top-1 text-green-500"
                  >
                    <FaCheck />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Phone Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="flex items-center border-b-2 border-gray-300 group-hover:border-indigo-500 pb-2 transition-colors">
                <FaPhone className="text-gray-500 group-hover:text-indigo-500 mr-3 transition-colors" />
                <input
                  type="tel"
                  name="tel"
                  value={formData.tel}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent pr-8"
                  placeholder="Numéro de contact"
                  pattern="[0-9]{10}"
                  required
                />
                {fieldValidity.tel && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-2 top-1 text-green-500"
                  >
                    <FaCheck />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Password Field with Strength Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <div className="flex items-center border-b-2 border-gray-300 group-hover:border-indigo-500 pb-2 transition-colors">
                <FaLock className="text-gray-500 group-hover:text-indigo-500 mr-3 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent pr-12"
                  placeholder="Mot de passe sécurisé"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-10 text-gray-400 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {fieldValidity.password && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-2 top-1 text-green-500"
                  >
                    <FaCheck />
                  </motion.div>
                )}
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="mt-2 overflow-hidden"
                >
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-full ${strengthLabels[passwordStrength]?.color} 
                      ${strengthLabels[passwordStrength]?.width} transition-all duration-500`}
                    />
                  </div>
                  <p className="text-sm mt-1 text-gray-600">
                    Sécurité: {strengthLabels[passwordStrength]?.text} 
                    {passwordStrength >= 3 ? ' 🔒' : ' ⚠️'}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
            >
              🎓 Créer mon compte administratif
            </motion.button>

            {/* Login Link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-sm text-gray-600"
            >
              Déjà membre?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Connectez-vous ici
              </Link>
            </motion.p>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Signup; 