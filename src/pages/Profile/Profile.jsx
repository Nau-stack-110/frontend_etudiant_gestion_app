import { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const Profile = () => {
  // État initial simulé avec les infos de l'administrateur connecté
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "admin@example.com",
    tel: "0123456789",
    image: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    // Pour la simulation, on récupère l'URL locale de l'image
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, image: imageUrl });
    }
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    // Ici, vous implémenterez la logique de validation et de mise à jour
    Swal.fire('Mise à jour', 'Votre profil a été mis à jour avec succès!', 'success');
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    const { newPassword, confirmNewPassword } = passwordData;
    if (newPassword !== confirmNewPassword) {
      Swal.fire('Erreur', 'Les nouveaux mots de passe ne correspondent pas', 'error');
      return;
    }
    // Ici, vous implémenterez la logique de changement de mot de passe
    Swal.fire('Mot de passe changé', 'Votre mot de passe a été mis à jour', 'success');
    setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  return (
    <div className="w-full p-4 md:p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Mon Profil</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mise à jour du profil */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Mise à jour du profil</h2>
            <form onSubmit={handleSubmitProfile} className="space-y-4">
              <div>
                <label className="block text-gray-700">Nom</label>
                <input 
                  type="text" 
                  name="name" 
                  value={profile.name} 
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={profile.email} 
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Téléphone</label>
                <input 
                  type="tel" 
                  name="tel" 
                  value={profile.tel} 
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Image de Profil</label>
                <input 
                  type="file" 
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
                {profile.image && (
                  <img src={profile.image} alt="Profile" className="mt-2 w-16 h-16 rounded-full" />
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Mettre à jour le profil
              </motion.button>
            </form>
          </div>
          {/* Changement du mot de passe */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Changer le mot de passe</h2>
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <div>
                <label className="block text-gray-700">Mot de passe actuel</label>
                <input 
                  type="password" 
                  name="currentPassword" 
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Nouveau mot de passe</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Confirmer le nouveau mot de passe</label>
                <input 
                  type="password" 
                  name="confirmNewPassword" 
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Changer le mot de passe
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 