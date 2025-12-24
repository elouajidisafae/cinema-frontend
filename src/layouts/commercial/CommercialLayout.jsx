import { useState, useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import SidebarCommercial from "./SidebarCommercial";
import { AuthContext } from "../../context/AuthContext";
import { Shield } from "lucide-react";

export default function CommercialLayout() {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProfile, setShowProfile] = useState(false);

    // Determines active menu based on URL
    const getInitialMenu = () => {
        const path = location.pathname.split('/')[2] || 'dashboard';
        return path;
    };

    const [activeMenu, setActiveMenu] = useState(getInitialMenu());

    const handleMenuNavigation = (menuId) => {
        if (menuId === "profile") {
            setShowProfile(true);
            return;
        }
        setActiveMenu(menuId);
        navigate(`/commercial/${menuId}`);
    };

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            <SidebarCommercial
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={handleMenuNavigation}
                logout={logout}
            />

            <main className="flex-1 overflow-y-auto bg-black relative">
                {/* Header / Top Bar Area */}
                <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-900/50 px-8 py-6 flex justify-end">
                    <div
                        onClick={() => setShowProfile(true)}
                        className="relative group cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-red-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative w-12 h-12 bg-gradient-to-br from-red-600 to-red-900 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:border-red-800 transition-all shadow-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <Outlet />
                </div>

                {/* Profile Modal */}
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
                                    <h3 className="text-2xl font-bold text-white mb-1">{user.nomComplet || "Commercial"}</h3>
                                    <p className="text-zinc-500 text-sm mb-6">Espace Commercial</p>

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
