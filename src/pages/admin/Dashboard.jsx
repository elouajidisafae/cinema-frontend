import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { Search, TrendingUp, Clock, ArrowUpRight, Users, Film, Theater, Calendar, Ticket, UserPlus, Shield, Bell, LayoutDashboard, ShieldCheck, CheckCircle2, Tag, Edit } from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { adminApi } from "../../api/admin.api";
import { AuthContext } from "../../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import SidebarAdmin from "../../components/admin/SidebarAdmin";

export default function CinemanaAdmin() {
    const { logout, user } = useContext(AuthContext); // Get connected user
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [openSubMenus, setOpenSubMenus] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = useRef(null);
    const location = useLocation();

    // Simplified menu determination logic
    const activeMenu = useMemo(() => {
        const path = location.pathname.split('/')[2] || 'dashboard';
        if (path === 'caissiers') return 'caissiers';
        if (path === 'commerciaux') return 'commerciaux';
        if (path === 'films') return 'films';
        if (path === 'salles') return 'salles';
        if (path === 'offres') return 'offres';
        if (path.includes('hist-')) return path;
        return 'dashboard';
    }, [location.pathname]);

    const handleMenuNavigation = (menuId) => {
        if (menuId === 'dashboard') navigate('/admin/dashboard');
        else if (menuId === 'caissiers') navigate('/admin/caissiers');
        else if (menuId === 'commerciaux') navigate('/admin/commerciaux');
        else if (menuId === 'films') navigate('/admin/films');
        else if (menuId === 'salles') navigate('/admin/salles');
        else if (menuId === 'offres') navigate('/admin/offres');
        else navigate('/admin/' + menuId);
    };

    const [userStats, setUserStats] = useState({
        totalActifs: 0,
        totalInactifs: 0,
        commerciauxActifs: 0,
        caissiersActifs: 0,
        totalUtilisateurs: 0,
        ajoutesParVous: 0,
        totalClientsCrees: 0
    });

    const [filmSalleStats, setFilmSalleStats] = useState({
        totalSallesActives: 0,
        totalSallesInactives: 0,
        totalFilmsActifs: 0,
        totalFilmsInactifs: 0
    });

    const [recentActivities, setRecentActivities] = useState([]);
    const [chartsData, setChartsData] = useState({
        reservationStatus: {},
        topFilms: [],
        peakHours: {}
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const results = await Promise.allSettled([
                    adminApi.getUserStats(),
                    adminApi.getFilmSalleStats(),
                    adminApi.getRecentActivities(),
                    adminApi.getDashboardCharts()
                ]);

                const getData = (result) => result.status === 'fulfilled' ? result.value.data : null;

                const userData = getData(results[0]);
                const filmSalleData = getData(results[1]);
                const activitiesData = getData(results[2]);
                const chartsData = getData(results[3]);

                if (userData) {
                    setUserStats({
                        totalActifs: userData.totalComptesActifs || 0,
                        totalInactifs: userData.totalComptesInactifs || 0,
                        commerciauxActifs: userData.totalCommerciauxActifs || 0,
                        caissiersActifs: userData.totalCaissiersActifs || 0,
                        totalUtilisateurs: userData.totalUtilisateurs || 0,
                        ajoutesParVous: userData.totalAjouteParAdminCourant || 0,
                        totalClientsCrees: userData.totalClientsCrees || 0
                    });
                }

                if (filmSalleData) setFilmSalleStats(filmSalleData);
                if (activitiesData) setRecentActivities(activitiesData);
                if (chartsData) setChartsData(chartsData);

            } catch (error) {
                console.error("Error fetching admin stats:", error);
            }
        };

        if (activeMenu === 'dashboard') {
            fetchStats();
        }
    }, [activeMenu]);


    const handleNavigateToHistory = (type) => {
        setOpenSubMenus(prev => ({ ...prev, "historique": true }));
        switch (type) {
            case "Utilisateur":
                navigate("/admin/hist-users");
                break;
            case "Film":
                navigate("/admin/hist-films");
                break;
            case "Salle":
                navigate("/admin/hist-salles");
                break;
            case "Client":
                navigate("/admin/hist-clients");
                break;
            case "Séance":
                navigate("/admin/hist-seances");
                break;
            case "Réservation":
                navigate("/admin/hist-reservations");
                break;
            case "Offre":
                navigate("/admin/hist-offres");
                break;
            default:
                navigate("/admin/dashboard");
        }
    };

    const getOperationLabel = (op) => {
        switch (op) {
            case "CREATION": return "Création";
            case "MODIFICATION": return "Modification";
            case "ACTIVATION": return "Activation/Désactivation";
            case "SUPPRESSION": return "Suppression";
            case "VALIDEE": return "Réservation Validée";
            case "EN_ATTENTE": return "Réservation En Attente";
            case "ANNULEE": return "Réservation Annulée";
            case "INSCRIPTION": return "Nouvelle Inscription";
            default: return op;
        }
    };

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Perform search as a computed value to avoid cascading renders
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();
        const results = [];

        // Search in users (Caissiers + Commerciaux)
        if (userStats.totalUtilisateurs > 0) {
            const userMatches = [];
            if (query.includes('caissier') || query.includes('caiss')) {
                userMatches.push({ type: 'Caissiers', label: 'Voir tous les caissiers', path: '/admin/caissiers' });
            }
            if (query.includes('commercial') || query.includes('comm')) {
                userMatches.push({ type: 'Commerciaux', label: 'Voir tous les commerciaux', path: '/admin/commerciaux' });
            }
            if (query.includes('utilisateur') || query.includes('user')) {
                userMatches.push({ type: 'Utilisateurs', label: 'Voir tous les utilisateurs', path: '/admin/caissiers' });
            }
            if (userMatches.length > 0) {
                results.push({ category: 'Utilisateurs', items: userMatches });
            }
        }

        // Search in films
        if (filmSalleStats.totalFilmsActifs > 0 || filmSalleStats.totalFilmsInactifs > 0) {
            if (query.includes('film')) {
                results.push({
                    category: 'Films',
                    items: [{ type: 'Films', label: 'Voir tous les films', path: '/admin/films' }]
                });
            }
        }

        // Search in salles
        if (filmSalleStats.totalSallesActives > 0 || filmSalleStats.totalSallesInactives > 0) {
            if (query.includes('salle')) {
                results.push({
                    category: 'Salles',
                    items: [{ type: 'Salles', label: 'Voir toutes les salles', path: '/admin/salles' }]
                });
            }
        }

        // Search in other sections
        if (query.includes('séance') || query.includes('seance')) {
            results.push({
                category: 'Séances',
                items: [{ type: 'Séances', label: 'Voir toutes les séances', path: '/admin/seances' }]
            });
        }

        if (query.includes('réservation') || query.includes('reservation')) {
            results.push({
                category: 'Réservations',
                items: [{ type: 'Réservations', label: 'Voir toutes les réservations', path: '/admin/reservations' }]
            });
        }

        if (query.includes('client')) {
            results.push({
                category: 'Clients',
                items: [{ type: 'Clients', label: 'Voir tous les clients', path: '/admin/clients' }]
            });
        }

        if (query.includes('offre') || query.includes('promo')) {
            results.push({
                category: 'Offres',
                items: [{ type: 'Offres', label: 'Voir toutes les offres', path: '/admin/offres' }]
            });
        }

        return results;
    }, [searchQuery, userStats, filmSalleStats]);

    // Update showSearchResults visibility based on results
    useEffect(() => {
        setShowSearchResults(searchResults.length > 0);
    }, [searchResults]);

    const handleSearchResultClick = (path) => {
        navigate(path);
        setSearchQuery('');
        setShowSearchResults(false);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Escape') {
            setSearchQuery('');
            setShowSearchResults(false);
        }
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "À l'instant";
        if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
        return date.toLocaleDateString();
    };

    const toggleSubMenu = (menu) => {
        setOpenSubMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };


    const topFilmsData = chartsData?.topFilms ? chartsData.topFilms.map(film => ({
        name: film.titre,
        reservations: film.count
    })) : [];


    const revenueData = chartsData?.dailyRevenue ? Object.keys(chartsData.dailyRevenue).map(date => ({
        date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        revenue: chartsData.dailyRevenue[date]
    })) : [];

    const genreData = chartsData?.genreDistribution ? Object.keys(chartsData.genreDistribution).map(genre => ({
        name: genre,
        value: chartsData.genreDistribution[genre]
    })) : [];

    const statusTrendData = chartsData?.dailyStatusStats ? Object.keys(chartsData.dailyStatusStats).map(date => {
        const stats = chartsData.dailyStatusStats[date];
        return {
            date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
            'Validées': stats['VALIDEE'] || 0,
            'En Attente': stats['EN_ATTENTE'] || 0,
            'Annulées': stats['ANNULEE'] || 0
        };
    }) : [];

    // Professional Red/Grey/Black Palette
    const ChartColors = {
        primary: '#dc2626',
        secondary: '#71717a',
        tertiary: '#3f3f46',
        accent: '#991b1b'
    };

    const GENRE_COLORS = ['#dc2626', '#1a1a1e', '#991b1b', '#3f3f46', '#18181b', '#52525b'];


    const activityRef = useRef(null);

    const handleScrollToActivity = () => {
        if (activeMenu !== 'dashboard') {
            navigate('/admin/dashboard');
            // Allow time for navigation and component mount
            setTimeout(() => {
                activityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300); // Increased timeout slightly for safer redirection
        } else {
            activityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };


    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            <SidebarAdmin
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={handleMenuNavigation}
                openSubMenus={openSubMenus}
                toggleSubMenu={toggleSubMenu}
                logout={logout}
            />

            <main className="flex-1 overflow-y-auto bg-black">
                <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-900/50">
                    <div className="px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div></div>

                            <div className="flex items-center gap-4">
                                <div ref={searchRef} className="relative group">
                                    <div className="absolute inset-0 bg-red-600/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative flex items-center gap-3 bg-zinc-900/60 backdrop-blur-sm px-5 py-3 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-all w-80">
                                        <Search className="w-4 h-4 text-zinc-600" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={handleSearchKeyDown}
                                            placeholder="Rechercher (ex: Caissier)..."
                                            className="bg-transparent outline-none text-sm text-white placeholder-zinc-600 flex-1"
                                        />
                                    </div>

                                    {/* Search Results Dropdown */}
                                    {showSearchResults && (
                                        <div className="absolute top-full mt-2 w-full bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                            <div className="max-h-96 overflow-y-auto">
                                                {searchResults.length === 0 ? (
                                                    <div className="p-4 text-center text-zinc-500 text-sm">
                                                        Aucun résultat trouvé
                                                    </div>
                                                ) : (
                                                    searchResults.map((group, groupIndex) => (
                                                        <div key={groupIndex} className="border-b border-zinc-800/50 last:border-0">
                                                            <div className="px-4 py-2 bg-zinc-950/50">
                                                                <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider">{group.category}</p>
                                                            </div>
                                                            {group.items.map((item, itemIndex) => (
                                                                <button
                                                                    key={itemIndex}
                                                                    onClick={() => handleSearchResultClick(item.path)}
                                                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-800/50 transition-colors text-left group/item"
                                                                >
                                                                    <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center group-hover/item:bg-red-600/20 transition-colors">
                                                                        {item.type === 'Caissiers' && <Users className="w-4 h-4 text-red-500" />}
                                                                        {item.type === 'Commerciaux' && <Users className="w-4 h-4 text-red-500" />}
                                                                        {item.type === 'Utilisateurs' && <Users className="w-4 h-4 text-red-500" />}
                                                                        {item.type === 'Films' && <Film className="w-4 h-4 text-red-500" />}
                                                                        {item.type === 'Salles' && <Theater className="w-4 h-4 text-red-500" />}
                                                                        {item.type === 'Séances' && <Calendar className="w-4 h-4 text-red-500" />}
                                                                        {item.type === 'Réservations' && <Ticket className="w-4 h-4 text-red-500" />}
                                                                        {item.type === 'Clients' && <UserPlus className="w-4 h-4 text-red-500" />}
                                                                        {item.type === 'Offres' && <Tag className="w-4 h-4 text-red-500" />}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium text-white group-hover/item:text-red-400 transition-colors">{item.label}</p>
                                                                    </div>
                                                                    <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover/item:text-red-500 transition-colors" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleScrollToActivity}
                                    className="relative p-3 hover:bg-zinc-900/50 rounded-xl transition-all group cursor-pointer"
                                >
                                    <Bell className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                                </button>

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
                    {activeMenu === 'dashboard' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* Modern Greeting Section - Compact */}
                            <div className="relative overflow-hidden rounded-2xl p-5 border border-zinc-800/50 bg-gradient-to-r from-zinc-900/50 to-black">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                                            Bienvenue, <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">{user?.nomComplet || "Admin"}</span>
                                        </h1>
                                        <p className="text-zinc-500 text-sm mt-1 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="group relative bg-gradient-to-br from-zinc-950 to-zinc-900 rounded-3xl p-4 border border-zinc-800/50 hover:border-red-900/50 transition-all duration-500 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl"></div>
                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-5">
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Total</span>
                                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                                </div>
                                                <h3 className="text-6xl font-bold bg-gradient-to-br from-white to-zinc-600 bg-clip-text text-transparent">
                                                    {userStats.totalUtilisateurs}
                                                </h3>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-red-600/20 rounded-2xl blur-xl"></div>
                                                <div className="relative w-16 h-16 bg-gradient-to-br from-red-600/20 to-red-900/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Users className="w-8 h-8 text-red-500" />
                                                </div>
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-6">Utilisateurs</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/30">
                                                <span className="text-zinc-500 text-sm font-medium">Actifs</span>
                                                <span className="text-emerald-400 font-bold text-lg">{userStats.totalActifs}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/30">
                                                <span className="text-zinc-500 text-sm font-medium">Inactifs</span>
                                                <span className="text-white font-bold text-lg">{userStats.totalInactifs}</span>
                                            </div>
                                            <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-4"></div>
                                            <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/20">
                                                <span className="text-zinc-600 text-sm">Commerciaux</span>
                                                <span className="text-zinc-400 font-semibold">{userStats.commerciauxActifs}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/20">
                                                <span className="text-zinc-600 text-sm">Caissiers</span>
                                                <span className="text-zinc-400 font-semibold">{userStats.caissiersActifs}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/30">
                                                <span className="text-zinc-500 text-sm font-medium">Clients créés</span>
                                                <span className="text-emerald-400 font-bold text-lg">{userStats.totalClientsCrees}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="group relative bg-gradient-to-br from-zinc-950 to-zinc-900 rounded-3xl p-4 border border-zinc-800/50 hover:border-red-900/50 transition-all duration-500 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl"></div>
                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-5">
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Total</span>
                                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                                </div>
                                                <h3 className="text-6xl font-bold bg-gradient-to-br from-white to-zinc-600 bg-clip-text text-transparent">
                                                    {filmSalleStats.totalSallesActives + filmSalleStats.totalSallesInactives}
                                                </h3>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-red-600/20 rounded-2xl blur-xl"></div>
                                                <div className="relative w-16 h-16 bg-gradient-to-br from-red-600/20 to-red-900/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Theater className="w-8 h-8 text-red-500" />
                                                </div>
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-6">Salles</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-4 rounded-xl bg-zinc-900/30">
                                                <span className="text-zinc-500 text-sm font-medium">Actives</span>
                                                <span className="text-emerald-400 font-bold text-xl">{filmSalleStats.totalSallesActives}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 rounded-xl bg-zinc-900/30">
                                                <span className="text-zinc-500 text-sm font-medium">Inactifs</span>
                                                <span className="text-zinc-500 font-semibold text-xl">{filmSalleStats.totalSallesInactives}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="group relative bg-gradient-to-br from-zinc-950 to-zinc-900 rounded-3xl p-4 border border-zinc-800/50 hover:border-red-900/50 transition-all duration-500 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl"></div>
                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-5">
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Total</span>
                                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                                </div>
                                                <h3 className="text-6xl font-bold bg-gradient-to-br from-white to-zinc-600 bg-clip-text text-transparent">
                                                    {filmSalleStats.totalFilmsActifs + filmSalleStats.totalFilmsInactifs}
                                                </h3>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-red-600/20 rounded-2xl blur-xl"></div>
                                                <div className="relative w-16 h-16 bg-gradient-to-br from-red-600/20 to-red-900/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Film className="w-8 h-8 text-red-500" />
                                                </div>
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-6">Films</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-4 rounded-xl bg-zinc-900/30">
                                                <span className="text-zinc-500 text-sm font-medium">Actifs</span>
                                                <span className="text-emerald-400 font-bold text-xl">{filmSalleStats.totalFilmsActifs}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 rounded-xl bg-zinc-900/30">
                                                <span className="text-zinc-500 text-sm font-medium">Inactifs</span>
                                                <span className="text-zinc-500 font-semibold text-xl">{filmSalleStats.totalFilmsInactifs}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                                {/* Revenue Chart - Full width top */}
                                <div className="lg:col-span-2 relative bg-zinc-950/40 rounded-3xl p-8 border border-red-900/40 shadow-[0_0_50px_-15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_70px_-10px_rgba(220,38,38,0.45)] transition-all duration-500">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                                            <div className="w-2.5 h-8 bg-gradient-to-b from-red-600 to-red-900 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                                            Flux de Revenus (7j)
                                        </h3>
                                        <TrendingUp className="text-red-500 w-7 h-7" />
                                    </div>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={revenueData}>
                                                <defs>
                                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                                                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                                <XAxis dataKey="date" stroke="#27272a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <YAxis stroke="#27272a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#09090b',
                                                        borderColor: '#dc2626',
                                                        borderRadius: '16px',
                                                        borderWidth: '1.5px',
                                                        boxShadow: '0 20px 40px rgba(0,0,0,0.9)'
                                                    }}
                                                    itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                                                    labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                                                />
                                                <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Status Trends Chart */}
                                <div className="lg:col-span-2 relative bg-zinc-950/40 rounded-3xl p-8 border border-red-900/40 shadow-[0_0_50px_-15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_70px_-10px_rgba(220,38,38,0.45)] transition-all duration-500">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                                            <div className="w-2.5 h-8 bg-gradient-to-b from-red-600 to-red-900 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                                            Tendances des Réservations (7j)
                                        </h3>
                                        <LayoutDashboard className="text-red-500 w-7 h-7" />
                                    </div>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={statusTrendData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                                <XAxis dataKey="date" stroke="#27272a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <YAxis stroke="#27272a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#dc2626', borderRadius: '16px', borderWidth: '1px' }}
                                                    itemStyle={{ fontWeight: 'bold' }}
                                                />
                                                <Legend iconType="circle" />
                                                <Line type="monotone" dataKey="Validées" stroke="#dc2626" strokeWidth={3} dot={{ r: 4, fill: '#dc2626' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                                <Line type="monotone" dataKey="En Attente" stroke="#71717a" strokeWidth={3} dot={{ r: 4, fill: '#71717a' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                                <Line type="monotone" dataKey="Annulées" stroke="#3f3f46" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Genre Distribution */}
                                <div className="relative bg-zinc-950/40 rounded-3xl p-8 border border-red-900/40 shadow-[0_0_50px_-20px_rgba(220,38,38,0.25)] hover:shadow-[0_0_60px_-15px_rgba(220,38,38,0.4)] transition-all duration-500">
                                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-red-900/10">
                                        <div className="w-2.5 h-8 bg-gradient-to-b from-red-600 to-red-900 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                                        <h3 className="text-2xl font-bold tracking-tight text-white">Répartition par Genre</h3>
                                    </div>
                                    <div className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={genreData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={70}
                                                    outerRadius={100}
                                                    paddingAngle={8}
                                                    dataKey="value"
                                                >
                                                    {genreData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={GENRE_COLORS[index % GENRE_COLORS.length]} stroke="rgba(0,0,0,0.3)" />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#dc2626', borderRadius: '12px', border: '1px solid #3f3f46' }}
                                                    itemStyle={{ color: '#ffffff' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Top Films - Revamped */}
                                <div className="relative bg-zinc-950/40 rounded-3xl p-8 border border-red-900/40 shadow-[0_0_50px_-20px_rgba(220,38,38,0.25)] hover:shadow-[0_0_60px_-15px_rgba(220,38,38,0.4)] transition-all duration-500">
                                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-red-900/10">
                                        <div className="w-2.5 h-8 bg-gradient-to-b from-red-600 to-red-900 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                                        <h3 className="text-2xl font-bold tracking-tight text-white">Top 5 Films</h3>
                                    </div>
                                    <div className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={topFilmsData} layout="vertical" margin={{ left: 0, right: 30 }}>
                                                <XAxis type="number" hide />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    width={100}
                                                    tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 'medium' }}
                                                    axisLine={{ stroke: '#3f3f46', strokeWidth: 1 }}
                                                    tickLine={false}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #450A0A', borderRadius: '10px' }}
                                                    itemStyle={{ color: '#ffffff' }}
                                                />
                                                <Bar dataKey="reservations" fill="#dc2626" radius={0} barSize={24} minPointSize={2} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Activity */}
                            <div ref={activityRef} className="relative bg-gradient-to-br from-zinc-950 to-zinc-900 rounded-3xl p-8 border border-zinc-800/50 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600/3 to-transparent"></div>

                                <div className="relative">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-8 bg-gradient-to-b from-red-600 to-red-900 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                                            <h3 className="text-2xl font-bold tracking-tight text-white">Activité récente</h3>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {recentActivities.map((activity, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleNavigateToHistory(activity.entiteType)}
                                                className="group flex items-center gap-5 p-5 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800/30 hover:border-zinc-700/50 transition-all cursor-pointer"
                                            >
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-red-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <div className="relative w-14 h-14 bg-gradient-to-br from-red-600/20 to-red-900/10 rounded-xl flex items-center justify-center">
                                                        {activity.entiteType === 'Utilisateur' && <Users className="w-7 h-7 text-red-500" />}
                                                        {activity.entiteType === 'Film' && <Film className="w-7 h-7 text-red-500" />}
                                                        {activity.entiteType === 'Salle' && <Theater className="w-7 h-7 text-red-500" />}
                                                        {activity.entiteType === 'Séance' && <Calendar className="w-7 h-7 text-red-500" />}
                                                        {activity.entiteType === 'Réservation' && <Ticket className="w-7 h-7 text-red-500" />}
                                                        {activity.entiteType === 'Client' && <UserPlus className="w-7 h-7 text-red-500" />}
                                                        {activity.entiteType === 'Offre' && <Tag className="w-7 h-7 text-red-500" />}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-white font-semibold mb-1">
                                                        {getOperationLabel(activity.operation)} - {activity.entiteNom}
                                                    </p>
                                                    <p className="text-zinc-500 text-sm">
                                                        Par {activity.adminNomComplet || "Admin"}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 text-zinc-600 text-xs">
                                                        <Clock className="w-3 h-3" />
                                                        {formatTime(activity.dateOperation)}
                                                    </div>

                                                    {/* Icon de redirection explicite */}
                                                    <div className="text-zinc-600 group-hover:text-red-500 transition-colors">
                                                        <ArrowUpRight className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {recentActivities.length === 0 && (
                                            <div className="text-center text-zinc-500 py-8">
                                                Aucune activité récente.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeMenu !== 'dashboard' && <Outlet />}
                </div>

                {/* Admin Profile Modal */}
                {showProfile && user && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="w-full max-w-md">
                            {/* Reusing the simplified UserDetails component structure manually or importing if available.
                                Since UserDetails expects a 'user' object and 'onClose', we can try to reuse it directly if we import it.
                                Let's import it at the top first? No, I'll inline a simple version or use the existing component if I can add the import.
                                I'll inline a styled card similar to UserDetails but specific for Admin.
                            */}
                            <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-50 duration-300">
                                <div className="absolute top-0 right-0 p-4 z-10">
                                    <button
                                        onClick={() => setShowProfile(false)}
                                        className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all"
                                    >
                                        <Shield className="w-5 h-5 text-red-500" /> {/* Close icon visual variant */}
                                    </button>
                                </div>
                                <div className="p-8 text-center">
                                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center mb-4 shadow-red-900/20 shadow-xl">
                                        <Shield className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-1">{user.nomComplet || "Administrateur"}</h3>
                                    <p className="text-zinc-500 text-sm mb-6">Session Administrateur</p>

                                    <div className="space-y-3 text-left bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50">
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase font-bold">Email Connecté</p>
                                            <p className="text-white font-medium">{user.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase font-bold">Rôle</p>
                                            <p className="text-red-500 font-bold">{user.role}</p>
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
