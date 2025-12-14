import { useAuth } from "../../hooks/useAuth";
export default function ClientDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white shadow-lg p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Bienvenue, {user?.nomComplet || "Client"} !</h1>
                    <button
                        onClick={logout}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        Déconnexion (Retour espace client)
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:scale-105 transition">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">Mes Réservations</h2>
                        <p className="text-gray-600">Consultez vos places réservées</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:scale-105 transition">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">Mon Profil</h2>
                        <p className="text-gray-600">Modifiez vos informations</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:scale-105 transition">
                        <h2 className="text-2xl font-bold text-purple-600 mb-4">Films à l'affiche</h2>
                        <p className="text-gray-600">Découvrez les nouveautés</p>
                    </div>
                </div>
            </div>
        </div>
    );
}