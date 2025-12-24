import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import SidebarCaissier from "../../components/caissier/SidebarCaissier";
import ScannerPage from "./ScannerPage";
import { Calendar, Shield, User, Film } from "lucide-react";

export default function CaissierDashboard() {
    const { user, logout } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [showProfile, setShowProfile] = useState(false);

    const [stats, setStats] = useState({
        totalValidations: 0,
        totalPlaces: 0,
        totalMontant: 0,
        recentActivity: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/caissier/stats", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            <SidebarCaissier
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                logout={logout}
            />

            <main className="flex-1 overflow-y-auto bg-black">
                <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-900/50">
                    <div className="px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div></div>
                            <div className="flex items-center gap-4">
                                <div
                                    onClick={() => setShowProfile(true)}
                                    className="relative group cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-red-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-red-600 to-red-900 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:border-red-800 transition-all shadow-lg">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    {activeMenu === "dashboard" && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="relative overflow-hidden rounded-2xl p-5 border border-zinc-800/50 bg-gradient-to-r from-zinc-900/50 to-black">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                                            Bienvenue, <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">{user?.nom && user?.prenom ? `${user.nom} ${user.prenom}` : user?.nomComplet || "Caissier"}</span>
                                        </h1>

                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ticket"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg>
                                        </div>
                                    </div>
                                    <h3 className="text-zinc-400 text-sm font-medium">Validations (7 jours)</h3>
                                    <p className="text-3xl font-bold text-white mt-1">{stats.totalValidations}</p>
                                </div>

                                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                        </div>
                                    </div>
                                    <h3 className="text-zinc-400 text-sm font-medium">Entrées Totales (7 jours)</h3>
                                    <p className="text-3xl font-bold text-white mt-1">{stats.totalPlaces}</p>
                                </div>

                                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-coins"><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" /></svg>
                                        </div>
                                    </div>
                                    <h3 className="text-zinc-400 text-sm font-medium">Recettes Session (7 jours)</h3>
                                    <p className="text-3xl font-bold text-white mt-1">{stats.totalMontant.toFixed(2)} DH</p>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-zinc-800 bg-black overflow-hidden">
                                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                                    <h3 className="font-semibold text-lg text-white">Activité Récente (7 jours)</h3>
                                    <span className="text-xs px-2 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">5 derniers</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-black text-zinc-500 uppercase text-xs border-b border-zinc-800">
                                        <tr>
                                            <th className="px-6 py-4 font-medium pl-8">Date Réservation</th>
                                            <th className="px-6 py-4 font-medium">Client</th>
                                            <th className="px-6 py-4 font-medium">Film & Séance</th>
                                            <th className="px-6 py-4 font-medium">Montant</th>
                                            <th className="px-6 py-4 font-medium text-right pr-8">Statut</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-900">
                                        {stats.recentActivity && stats.recentActivity.length > 0 ? (
                                            stats.recentActivity.map((act, index) => (
                                                <tr key={index} className="hover:bg-zinc-900/30 transition-colors group">
                                                    <td className="px-6 py-4 pl-8">
                                                        <div className="flex items-center gap-3">
                                                            <Calendar className="w-4 h-4 text-sky-500" />
                                                            <span className="text-sky-500/80 font-medium">
                                                                    {new Date().toLocaleDateString('fr-FR')} <span className="text-zinc-500 ml-1">{new Date(act.heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                                                </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <User className="w-4 h-4 text-purple-400" />
                                                            <span className="font-medium text-zinc-200">
                                                                    {act.client}
                                                                </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2">
                                                                <Film className="w-4 h-4 text-red-600" />
                                                                <span className="font-bold text-red-600">
                                                                        {act.film}
                                                                    </span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                            <span className="font-bold text-amber-500 text-base">
                                                                {act.montant.toFixed(2)} Dh
                                                            </span>
                                                    </td>

                                                    <td className="px-6 py-4 text-right pr-8">
                                                        <div className="inline-flex justify-end">
                                                                <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                                    VALIDEE
                                                                </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-zinc-500 italic">
                                                    Aucune activité pour le moment.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeMenu === "scanner" && (
                        <div className="animate-in fade-in duration-500">
                            <ScannerPage />
                        </div>
                    )}
                </div>

                {showProfile && user && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="w-full max-w-md">
                            <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-50 duration-300">
                                <div className="absolute top-0 right-0 p-4 z-10">
                                    <button
                                        onClick={() => setShowProfile(false)}
                                        className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all"
                                    >
                                        <Shield className="w-5 h-5 text-red-500" />
                                    </button>
                                </div>
                                <div className="p-8 text-center">
                                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center mb-4 shadow-red-900/20 shadow-xl">
                                        <Shield className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-1">{user.nom && user.prenom ? `${user.nom} ${user.prenom}` : user.nomComplet || "Caissier"}</h3>
                                    <p className="text-zinc-500 text-sm mb-6">Session Caissier</p>

                                    <div className="space-y-3 text-left bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50">
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase font-bold">Email Connecté</p>
                                            <p className="text-white font-medium">{user.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase font-bold">Rôle</p>
                                            <p className="text-red-500 font-bold">{user.role || "CAISSIER"}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-6">
                                        <button
                                            onClick={() => setShowProfile(false)}
                                            className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-all"
                                        >
                                            Fermer
                                        </button>
                                        <button
                                            onClick={logout}
                                            className="px-4 py-3 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-500 hover:text-red-400 border border-red-600/20 font-medium transition-all"
                                        >
                                            Déconnexion
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}