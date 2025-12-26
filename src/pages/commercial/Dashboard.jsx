import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { commercialApi } from "../../api/commercial.api";
import { TrendingUp, Users, Calendar, Clock, Film, DollarSign, Activity, Ticket, Plus, RefreshCw } from 'lucide-react';
import Alert from '../../components/ui/Alert';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await commercialApi.getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error('Erreur chargement dashboard:', err);
                const msg = err.response?.data?.message || err.response?.data?.error || "Impossible de charger les statistiques. Veuillez vérifier votre connexion internet.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-10 text-center text-white animate-pulse">Chargement des données...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Modern Greeting Section - Compact */}
            <div className="relative overflow-hidden rounded-2xl p-5 border border-zinc-800/50 bg-gradient-to-r from-zinc-900/50 to-black">
                <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            Bienvenue, <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">{user?.nomComplet || "Commercial"}</span>
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <Alert className="mb-6">
                    {error}
                </Alert>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Chiffre d'Affaires - RED */}
                <div className="group relative bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800/50 hover:border-red-500/30 transition-all overflow-hidden">
                    <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex justify-between items-start">
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Chiffre d'Affaires</p>
                            <h3 className="text-3xl font-bold text-white mt-2">
                                {stats?.revenuTotal?.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' }) || "0,00 MAD"}
                            </h3>
                        </div>
                        <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Réservations - RED */}
                <div className="group relative bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800/50 hover:border-red-500/30 transition-all overflow-hidden">
                    <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex justify-between items-start">
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Réservations</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{stats?.totalReservations || 0}</h3>
                        </div>
                        <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                            <Ticket className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Séances - RED */}
                <div className="group relative bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800/50 hover:border-red-500/30 transition-all overflow-hidden">
                    <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex justify-between items-start">
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Séances Programmées</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{stats?.totalSeances || 0}</h3>
                        </div>
                        <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                            <Film className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Taux de Remplissage - RED */}
                <div className="group relative bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800/50 hover:border-red-500/30 transition-all overflow-hidden">
                    <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex justify-between items-start">
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Taux de Remplissage</p>
                            <h3 className="text-3xl font-bold text-white mt-2">
                                {stats?.tauxRemplissageGlobal ? (stats.tauxRemplissageGlobal).toFixed(1) : "0.0"}%
                            </h3>
                        </div>
                        <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Evolution du CA */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 hover:border-red-900/20 transition-colors">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-red-500" />
                        Évolution du Chiffre d'Affaires
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <AreaChart data={stats?.statsParJour || []}>
                                <defs>
                                    <linearGradient id="colorRevenu" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} />
                                <YAxis stroke="#71717a" fontSize={12} tickFormatter={(value) => `${value} Dh`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#ef4444', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value) => [`${value} MAD`, "Revenu"]}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                />
                                <Area type="monotone" dataKey="revenu" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenu)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Évolution des Réservations */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 hover:border-red-900/20 transition-colors">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-red-500" />
                        Évolution des Réservations
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={stats?.statsParJour || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} />
                                <YAxis stroke="#71717a" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#ef4444', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ fill: '#27272a' }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                />
                                <Bar dataKey="nombreReservations" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Prochaines Séances */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/80">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-sky-500" />
                            Prochaines Séances
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50">
                            <tr>
                                <th className="px-6 py-3">Film</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Salle</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                            {stats?.upcomingSeances?.length > 0 ? (
                                stats.upcomingSeances.map((seance) => (
                                    <tr key={seance.id} className="hover:bg-zinc-900/30 transition-colors border-l-2 border-l-transparent hover:border-l-sky-500">
                                        <td className="px-6 py-4 font-bold text-white">{seance.filmTitre}</td>
                                        <td className="px-6 py-4 text-sky-400 font-medium">
                                            {new Date(seance.dateHeure).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                                            <span className="ml-2 text-zinc-500">{new Date(seance.dateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">{seance.salleNom}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-zinc-500">Aucune séance à venir</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Dernières Réservations */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/80">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-red-500" />
                            Dernières Réservations
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50">
                            <tr>
                                <th className="px-6 py-3">Client</th>
                                <th className="px-6 py-3">Film</th>
                                <th className="px-6 py-3 text-right">Montant</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                            {stats?.recentReservations?.length > 0 ? (
                                stats.recentReservations.map((res) => (
                                    <tr key={res.id} className="hover:bg-zinc-900/30 transition-colors border-l-2 border-l-transparent hover:border-l-red-500">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{res.clientNom} {res.clientPrenom}</div>
                                            <div className="text-xs text-sky-500">{new Date(res.dateReservation).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400 font-medium">{res.filmTitre}</td>
                                        <td className="px-6 py-4 text-right">
                                                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${res.statut === 'VALIDEE' || res.statut === 'CONFIRMEE_CLIENT'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : res.statut === 'ANNULEE'
                                                        ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                    {res.montantTotal} Dh
                                                </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-zinc-500">Aucune réservation récente</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}