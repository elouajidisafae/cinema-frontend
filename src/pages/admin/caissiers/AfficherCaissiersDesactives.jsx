import { useState, useEffect } from "react";
import { Archive, Search, ArrowLeft } from "lucide-react";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";
import UserTable from "../../../components/admin/shared/UserTable";

export default function AfficherCaissiersDesactives() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, user: null });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getUsers("CAISSIER", false);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching inactive users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async () => {
        if (confirmModal.user) {
            try {
                await adminApi.toggleUserActivation(confirmModal.user.id, true);
                fetchUsers();
            } catch (error) {
                console.error("Error activating user:", error);
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
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700">
                        <Archive className="w-6 h-6 text-zinc-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Archives Caissiers</h2>
                        <p className="text-zinc-500 text-sm">Liste des caissiers désactivés</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/admin/caissiers')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </button>
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
                        isArchiveView={true}
                        onToggleStatus={(user) => setConfirmModal({ isOpen: true, user })}
                        onViewDetails={(user) => navigate(`/admin/caissiers/details/${user.id}`)}
                    />
                )}
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, user: null })}
                onConfirm={handleToggleStatus}
                title="Réactivation du caissier"
                message={`Voulez-vous vraiment réactiver le compte de ${confirmModal.user?.prenom} ${confirmModal.user?.nom} ?`}
                type="success"
            />
        </div>
    );
}
