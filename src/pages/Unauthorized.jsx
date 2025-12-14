// src/pages/Unauthorized.jsx
import { useAuth } from "../hooks/useAuth";

export default function Unauthorized() {
    const { user, logout } = useAuth();

    const handleBackToLogin = () => {
        logout(); // Déconnecte et redirige automatiquement
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
            <div className="text-center bg-white rounded-2xl shadow-2xl p-12 max-w-md">
                <div className="text-8xl mb-6">🚫</div>
                <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Accès refusé</h2>
                <p className="text-gray-600 mb-2">Vous n'avez pas les permissions nécessaires</p>
                {user && (
                    <p className="text-sm text-gray-500 mb-8">
                        Connecté en tant que : <strong>{user.nomComplet}</strong> ({user.role})
                    </p>
                )}

                <button
                    onClick={handleBackToLogin}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition"
                >
                    Retour à la connexion
                </button>
            </div>
        </div>
    );
}