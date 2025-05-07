import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { loginUser } from './authUser';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
// import logo from "../../assets/taxibelogo.png";

const API_URL = 'https://api-etudiant-esdes.onrender.com/api';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [resetData, setResetData] = useState({ email: '', reset_pin: '', new_password: '' });
    const [showPuzzleModal, setShowPuzzleModal] = useState(false);
    const [puzzleAnswer, setPuzzleAnswer] = useState('');
    const [puzzle, setPuzzle] = useState({ question: '', solution: null });
    const [showResetForm, setShowResetForm] = useState(false);
    const [resetPin, setResetPin] = useState(''); 
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const isAdmin = decoded.is_superuser;
                // const isAdminCoop = decoded.isComptable;

                if (isAdmin){
                    navigate('/admin/dashboard');
                }
                else{
                    navigate('/login');
                }
            } catch (e) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('isAdmin');
                // localStorage.removeItem('is_admin_coop');
                console.log("votre token a été supprimé", e)
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await loginUser(formData);
            const { access, refresh } = response.data;

            const decodedToken = jwtDecode(access);
            const isAdmin = decodedToken.is_superuser;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');

            Swal.fire({
                title: 'Connexion réussie',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });

            if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error('Erreur de connexion :', error.response?.data);
            setIsLoading(false);
            Swal.fire({
                title: 'Identifiants incorrects!',
                icon: 'error',
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const generatePuzzle = () => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const solution = num1 + num2;
        setPuzzle({ question: `Combien font ${num1} + ${num2} ?`, solution });
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!forgotEmail.includes('@')) {
            Swal.fire({
                title: 'Erreur',
                text: 'Veuillez entrer un email valide.',
                icon: 'error',
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/forgot-password/`, { email: forgotEmail });
            const pin = response.data.reset_pin;
            setResetPin(pin); 
            Swal.fire({
                title: 'Succès',
                text: `Un PIN de réinitialisation a été envoyé à ${forgotEmail}.`,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                setShowForgotPassword(false);
                setShowPuzzleModal(true);
                generatePuzzle();
            });
        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: error.response?.data?.email || 'Une erreur est survenue',
                icon: 'error',
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePuzzleSubmit = (e) => {
        e.preventDefault();
        const userAnswer = parseInt(puzzleAnswer);
        if (Math.abs(userAnswer - puzzle.solution) <= 1) {
            setShowPuzzleModal(false);
            setShowResetForm(true);
            // Afficher le PIN dans une alerte
            Swal.fire({
                title: 'Puzzle résolu !',
                text: `Votre PIN de réinitialisation est : ${resetPin}. Entrez ce PIN et votre nouveau mot de passe.`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
            // Pré-remplir le champ reset_pin avec le PIN reçu
            setResetData({ ...resetData, reset_pin: resetPin });
        } else {
            Swal.fire({
                title: 'Mauvaise réponse',
                text: 'Veuillez réessayer.',
                icon: 'error',
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
            setPuzzleAnswer('');
            generatePuzzle();
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/reset-password/`, resetData);
            Swal.fire({
                title: 'Succès',
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                setShowResetForm(false);
                setResetData({ email: '', reset_pin: '', new_password: '' });
                setForgotEmail('');
                setResetPin(''); // Réinitialiser le PIN
                navigate('/login');
            });
        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: error.response?.data?.detail || 'Une erreur est survenue',
                icon: 'error',
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
                {/* <div className="text-center">
                    <img className="mx-auto h-auto w-40" src={logo} alt="TaxiBe Logo" />
                </div> */}

                {!showForgotPassword && !showResetForm ? (
                    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-bold text-gray-700">
                                    Email ou Téléphone
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Entrez votre email ou téléphone"
                                    autoComplete="username"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                                    Mot de passe
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Entrez votre mot de passe"
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-sm text-green-600 hover:text-green-500"
                            >
                                Mot de passe oublié ?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Se connecter"
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Pas encore de compte ?{" "}
                                <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                                    Inscrivez-vous
                                </Link>
                            </p>
                        </div>
                    </form>
                ) : showForgotPassword ? (
                    <div className="mt-8 space-y-6">
                        <form onSubmit={handleForgotPassword}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        value={forgotEmail}
                                        onChange={(e) => {
                                            setForgotEmail(e.target.value);
                                            setResetData({ ...resetData, email: e.target.value });
                                        }}
                                        placeholder="Entrez votre email"
                                        autoComplete="email"
                                        autoFocus
                                        aria-label="Email pour réinitialisation du mot de passe"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    "Envoyer"
                                )}
                            </button>
                        </form>
                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(false)}
                            className="mt-2 w-full text-sm text-green-600 hover:text-green-500"
                        >
                            Retour à la connexion
                        </button>
                    </div>
                ) : showResetForm ? (
                    <div className="mt-8 space-y-6">
                        <form onSubmit={handleResetPassword}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="reset_pin" className="block text-sm font-medium text-gray-700">
                                        PIN de réinitialisation
                                    </label>
                                    <input
                                        id="reset_pin"
                                        name="reset_pin"
                                        type="text"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        value={resetData.reset_pin}
                                        onChange={(e) => setResetData({ ...resetData, reset_pin: e.target.value })}
                                        placeholder="Entrez le PIN reçu"
                                        autoComplete="off"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                                        Nouveau mot de passe
                                    </label>
                                    <input
                                        id="new_password"
                                        name="new_password"
                                        type="password"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        value={resetData.new_password}
                                        onChange={(e) => setResetData({ ...resetData, new_password: e.target.value })}
                                        placeholder="Entrez votre nouveau mot de passe"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    "Réinitialiser le mot de passe"
                                )}
                            </button>
                        </form>
                        <button
                            type="button"
                            onClick={() => {
                                setShowResetForm(false);
                                setShowForgotPassword(true);
                            }}
                            className="mt-2 w-full text-sm text-green-600 hover:text-green-500"
                        >
                            Retour
                        </button>
                    </div>
                ) : null}

                {showPuzzleModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Vérification humaine</h2>
                            <p className="text-sm text-gray-600 mb-4">{puzzle.question}</p>
                            <form onSubmit={handlePuzzleSubmit}>
                                <div>
                                    <label htmlFor="puzzle_answer" className="block text-sm font-medium text-gray-700">
                                        Votre réponse
                                    </label>
                                    <input
                                        id="puzzle_answer"
                                        name="puzzle_answer"
                                        type="number"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        value={puzzleAnswer}
                                        onChange={(e) => setPuzzleAnswer(e.target.value)}
                                        placeholder="Entrez votre réponse"
                                        autoComplete="off"
                                        autoFocus
                                    />
                                </div>
                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPuzzleModal(false);
                                            setShowForgotPassword(true);
                                        }}
                                        className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                    >
                                        Vérifier
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}
        </div>
    );
};

export default Login;