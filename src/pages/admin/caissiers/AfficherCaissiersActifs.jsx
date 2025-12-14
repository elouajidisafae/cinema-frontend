import { useState, useEffect } from "react";
import { Plus, Search, CreditCard, Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";
import UserTable from "../../../components/admin/shared/UserTable";

export default function AfficherCaissiersActifs() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getUsers("CAISSIER", true);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (user) => {
        if (window.confirm(`Voulez-vous vraiment désactiver ce caissier ?`)) {
            try {
                await adminApi.toggleUserActivation(user.id, !user.actif);
                fetchUsers();
            } catch (error) {
                console.error("Error toggling status:", error);
            }
        }
    };

    const filteredUsers = users.filter(user =>
        (user.nom?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.prenom?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-600/20">
                        <CreditCard className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Caissiers Actifs</h2>
                        <p className="text-zinc-500 text-sm">Liste des caissiers actuellement actifs</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/admin/caissiers/archives')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all text-sm"
                    >
                        <Archive className="w-4 h-4" />
                        Archives
                    </button>
                    <button
                        onClick={() => navigate('/admin/caissiers/ajouter')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all text-sm shadow-lg shadow-red-900/20"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter Caissier
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900/30 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 transition-all text-sm"
                    />
                </div>
            </div>

            <div className="bg-zinc-950/50 border border-zinc-900 rounded-3xl p-6 backdrop-blur-sm">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <UserTable
                        users={filteredUsers}
                        onEdit={(user) => navigate(`/admin/caissiers/modifier/${user.id}`)}
                        onToggleStatus={handleToggleStatus}
                        onViewDetails={(user) => navigate(`/admin/caissiers/details/${user.id}`)}
                    />
                )}
            </div>
        </div>
    );
}
