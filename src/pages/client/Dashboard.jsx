import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { clientApi } from "../../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Calendar, Clock, MapPin, Download, LogOut, Ticket,
    User, Lock, CreditCard, ChevronRight, Film, Heart, Trash2, Settings,
    Edit2, Mail, Phone, CheckCircle, AlertCircle, X
} from "lucide-react";
import SidebarClient from "../../components/client/SidebarClient";
import ReservationCard from "../../components/client/ReservationCard";

export default function ClientDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fullUser, setFullUser] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const confirmAction = (action) => {
        setPendingAction(() => action);
        setShowConfirmModal(true);
    };

    // Get active tab from URL or default to "reservations"
    const activeTab = searchParams.get("tab") || "reservations";

    // Function to change tab and update URL
    const setActiveTab = (tab) => {
        setSearchParams({ tab });
    };

    // Profile state
    const [profileForm, setProfileForm] = useState({
        nom: user?.nom || "",
        prenom: user?.prenom || "",
        numeroTelephone: user?.numeroTelephone || ""
    });

    // Password state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resReservations, resProfile] = await Promise.all([
                clientApi.getMyReservations(),
                clientApi.getProfile()
            ]);

            setReservations(resReservations.data);
            setFullUser(resProfile.data);

            // Pré-remplir le formulaire avec les données fraîches
            setProfileForm({
                nom: resProfile.data.nom || "",
                prenom: resProfile.data.prenom || "",
                numeroTelephone: resProfile.data.numeroTelephone || ""
            });
        } catch (err) {
            console.error("Erreur chargement données:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/films");
    };

    const handleProfileUpdate = async (e) => {
        if (e) e.preventDefault();

        const performUpdate = async () => {
            try {
                await clientApi.updateProfile(profileForm);
                setIsEditingProfile(false);
                fetchData();
                showNotification("Profil mis à jour avec succès !");
            } catch (_err) {
                showNotification("Erreur lors de la mise à jour du profil", "error");
            }
        };

        confirmAction(performUpdate);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showNotification("Les nouveaux mots de passe ne correspondent pas", "error");
            return;
        }

        try {
            await clientApi.updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
            showNotification("Mot de passe modifié avec succès !");
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (_err) {
            showNotification("L'ancien mot de passe est incorrect", "error");
        }
    };

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-red-600 selection:text-white">
            <SidebarClient
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeMenu={activeTab}
                setActiveMenu={setActiveTab}
                logout={handleLogout}
            />

            <main className="flex-1 overflow-y-auto bg-black relative">
                {/* Header with Search/Profile */}
                <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-900/50">
                    <div className="px-8 py-6 flex items-center justify-between">
                        <div></div>
                        <div className="flex items-center gap-4">
                            <div className="relative group cursor-pointer">
                                <div className="absolute inset-0 bg-red-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative flex items-center gap-3 bg-zinc-900/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-all">
                                    <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-900 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-white">Mon Espace</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Notification Toast - Centered & Premium */}
                {notification && (
                    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4 fade-in duration-500">
                        <div className={`flex items-center gap-4 px-8 py-4 rounded-full border backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${notification.type === "success"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10"
                            : "bg-red-500/10 border-red-500/30 text-red-400 shadow-red-500/10"
                        }`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === "success" ? "bg-emerald-500/20" : "bg-red-500/20"
                            }`}>
                                {notification.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            </div>
                            <p className="text-sm font-black uppercase tracking-wider whitespace-nowrap">
                                {notification.message}
                            </p>
                        </div>
                    </div>
                )}

                {/* Double Validation Modal */}
                {showConfirmModal && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"></div>
                        <div className="relative w-full max-w-sm bg-zinc-950 border border-zinc-900 rounded-[32px] p-10 text-center shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                            <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-600/20 animate-pulse">
                                <Settings className="w-10 h-10 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4">Confirmer ?</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed mb-10">
                                Voulez-vous vraiment enregistrer ces modifications ? Cette action mettra à jour vos informations de profil.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-6 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-[10px] border border-zinc-800"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => {
                                        pendingAction();
                                        setShowConfirmModal(false);
                                    }}
                                    className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-red-900/40"
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-8 space-y-8 max-w-7xl mx-auto">
                    {activeTab === 'reservations' && (
                        <div className="relative overflow-hidden rounded-[32px] p-12 border border-zinc-800/50 bg-black">
                            <div className="absolute top-0 -right-20 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] animate-pulse"></div>
                            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-red-900/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div>
                                    <h1 className="text-5xl font-black text-white mb-4 leading-tight">
                                        Bon retour,<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                                            {user?.prenom || user?.nomComplet}
                                        </span> !
                                    </h1>
                                    <div className="flex items-center gap-4 text-zinc-500 bg-zinc-900/40 backdrop-blur-sm self-start px-5 py-2.5 rounded-2xl border border-zinc-800/50">
                                        <Ticket className="w-5 h-5 text-red-600 animate-bounce" />
                                        <p className="text-sm font-bold uppercase tracking-widest">Membre Premium Cinémana</p>
                                    </div>
                                </div>

                                <div className="flex items-end flex-col">
                                    <span className="text-zinc-600 text-[10px] font-black uppercase tracking-tighter mb-2">Statut de compte</span>
                                    <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                                        <span className="text-xs font-black uppercase tracking-widest">Compte Actif</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === "reservations" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Ticket className="w-5 h-5 text-red-600" />
                                        Mes Réservations
                                    </h2>
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                                        {reservations.length} Billet{reservations.length > 1 ? 's' : ''}
                                    </span>
                                </div>

                                {loading ? (
                                    <div className="text-center py-20 text-zinc-500">Chargement...</div>
                                ) : reservations.length === 0 ? (
                                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-12 text-center">
                                        <Film className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-2">Aucune réservation</h3>
                                        <p className="text-zinc-500 mb-6">Vous n'avez pas encore réservé de séance.</p>
                                        <button onClick={() => navigate('/')} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all">
                                            Découvrir les films
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid gap-6">
                                        {reservations.map((res) => (
                                            <ReservationCard key={res.id} reservation={res} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "profile" && (
                            <div className="max-w-2xl mx-auto space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black flex items-center gap-3 text-white">
                                        <Settings className="w-6 h-6 text-red-600" />
                                        Paramètres de Profil
                                    </h2>
                                    {!isEditingProfile && (
                                        <button
                                            onClick={() => setIsEditingProfile(true)}
                                            className="flex items-center gap-2 bg-zinc-900 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl border border-zinc-800 transition-all font-bold text-sm"
                                        >
                                            <Edit2 size={16} />
                                            Modifier le profil
                                        </button>
                                    )}
                                </div>

                                {!isEditingProfile ? (
                                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                        <div className="bg-zinc-950/40 border border-zinc-800/50 p-10 rounded-[40px] relative overflow-hidden backdrop-blur-md group">
                                            {/* Subtle internal glows */}
                                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] group-hover:bg-red-600/20 transition-colors duration-700"></div>

                                            <div className="space-y-10 relative z-10">
                                                <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-red-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
                                                        <div className="relative w-32 h-32 bg-gradient-to-br from-red-600 to-red-950 rounded-[28px] flex items-center justify-center text-white text-5xl font-black shadow-2xl border border-white/10">
                                                            {(fullUser?.prenom || user?.prenom)?.charAt(0)}{(fullUser?.nom || user?.nom)?.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-4xl font-black text-white mb-2 tracking-tight">
                                                            {fullUser?.prenom || user?.prenom} <span className="text-red-600">{fullUser?.nom || user?.nom}</span>
                                                        </h3>
                                                        <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">
                                                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                                                            Client Privilège Cinémana
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-zinc-900">
                                                    <div className="space-y-3 group/item">
                                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2 group-hover/item:text-red-500 transition-colors">
                                                            <Mail size={14} /> Adresse E-mail
                                                        </span>
                                                        <p className="text-white font-bold text-lg pl-6 border-l-2 border-zinc-800 group-hover/item:border-red-600 transition-all">{fullUser?.email || user?.email}</p>
                                                    </div>
                                                    <div className="space-y-3 group/item">
                                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2 group-hover/item:text-red-500 transition-colors">
                                                            <Phone size={14} /> Contact Téléphonique
                                                        </span>
                                                        <p className="text-white font-bold text-lg pl-6 border-l-2 border-zinc-800 group-hover/item:border-red-600 transition-all">{fullUser?.numeroTelephone || user?.numeroTelephone || "Non renseigné"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleProfileUpdate} className="space-y-8 bg-zinc-950/60 border border-zinc-900/50 p-10 rounded-[40px] backdrop-blur-xl animate-in zoom-in-95 duration-500 shadow-2xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Nom de Famille</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={profileForm.nom}
                                                    onChange={(e) => setProfileForm({ ...profileForm, nom: e.target.value })}
                                                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-6 py-5 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all font-bold text-lg placeholder:text-zinc-800"
                                                    placeholder="Votre nom"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Prénom</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={profileForm.prenom}
                                                    onChange={(e) => setProfileForm({ ...profileForm, prenom: e.target.value })}
                                                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-6 py-5 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all font-bold text-lg placeholder:text-zinc-800"
                                                    placeholder="Votre prénom"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Numéro de Mobile</label>
                                            <input
                                                type="tel"
                                                required
                                                value={profileForm.numeroTelephone}
                                                onChange={(e) => setProfileForm({ ...profileForm, numeroTelephone: e.target.value })}
                                                className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-6 py-5 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all font-bold text-lg placeholder:text-zinc-800"
                                                placeholder="06 00 00 00 00"
                                            />
                                        </div>
                                        <div className="pt-8 flex flex-col md:flex-row gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingProfile(false)}
                                                className="flex-1 bg-zinc-900/50 text-white font-black px-8 py-5 rounded-2xl hover:bg-zinc-800 transition-all border border-zinc-800 uppercase tracking-[0.2em] text-xs"
                                            >
                                                Abandonner
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-[2] bg-gradient-to-r from-red-600 to-red-800 text-white font-black px-8 py-5 rounded-2xl hover:from-red-500 hover:to-red-700 transition-all shadow-xl shadow-red-900/20 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
                                            >
                                                Valider les informations
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="max-w-2xl mx-auto space-y-8">
                                <h2 className="text-2xl font-black flex items-center gap-3 text-white">
                                    <Lock className="w-6 h-6 text-red-600" />
                                    Sécurité du Compte
                                </h2>

                                <form onSubmit={handlePasswordUpdate} className="space-y-8 bg-zinc-950/60 border border-zinc-900/50 p-10 rounded-[40px] backdrop-blur-xl animate-in slide-in-from-bottom-6 duration-700 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-red-600/5 rounded-full blur-[80px] group-hover:bg-red-600/10 transition-colors duration-700"></div>

                                    <div className="space-y-6 relative z-10">
                                        <div className="space-y-3">
                                            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Ancien mot de passe</label>
                                            <div className="relative">
                                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                                                <input
                                                    type="password"
                                                    required
                                                    value={passwordForm.currentPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl pl-16 pr-6 py-5 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all font-bold text-lg"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Nouveau mot de passe</label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-6 py-5 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all font-bold text-lg"
                                                    placeholder="Nouveau"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Confirmation</label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-6 py-5 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all font-bold text-lg"
                                                    placeholder="Confirmer"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 relative z-10">
                                        <button
                                            type="submit"
                                            className="w-full md:w-auto bg-gradient-to-r from-red-600 to-red-800 text-white font-black px-12 py-5 rounded-2xl hover:from-red-500 hover:to-red-700 transition-all shadow-xl shadow-red-900/30 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
                                        >
                                            Mettre à jour la sécurité
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}