import { useAuth } from "../../hooks/useAuth";
export default function CommercialDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
            <div className="bg-indigo-700 text-white p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Espace Commercial</h1>
                    <button onClick={logout} className="bg-white text-indigo-700 px-6 py-2 rounded-lg font-bold">
                        Déconnexion
                    </button>
                </div>
            </div>
            <div className="max-w-7xl mx-auto p-10 text-center">
                <h2 className="text-4xl font-bold mb-8">Bonjour {user?.nomComplet}</h2>
                <p className="text-2xl text-gray-700">Gestion des partenariats et promotions en cours...</p>
            </div>
        </div>
    );
}