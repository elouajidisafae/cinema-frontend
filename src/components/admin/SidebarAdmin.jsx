import { ChevronDown, Film, LogOut, Menu, X, LayoutDashboard, Users, CreditCard, Theater, History, Calendar, UserPlus, Ticket, User, Tag } from "lucide-react";

export default function SidebarAdmin({
                                         sidebarOpen,
                                         setSidebarOpen,
                                         activeMenu,
                                         setActiveMenu,
                                         openSubMenus,
                                         toggleSubMenu,
                                         logout
                                     }) {
    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "offres", label: "Gestion des Offres", icon: Tag },
        {
            id: "users",
            label: "Gestion des utilisateurs",
            icon: Users,
            subItems: [
                { id: "caissiers", label: "Gestion Caissiers", icon: CreditCard },
                { id: "commerciaux", label: "Gestion Commerciaux", icon: User }
            ]
        },
        { id: "salles", label: "Gestion des salles", icon: Theater },
        { id: "films", label: "Gestion des films", icon: Film },
        {
            id: "historique",
            label: "Historique",
            icon: History,
            subItems: [
                { id: "hist-users", label: "Historique Utilisateurs", icon: Users },
                { id: "hist-salles", label: "Historique Salles", icon: Theater },
                { id: "hist-films", label: "Historique Films", icon: Film },
                { id: "hist-seances", label: "Historique Séances", icon: Calendar },
                { id: "hist-offres", label: "Historique Offres", icon: Tag },
                { id: "hist-clients", label: "Clients Inscrits", icon: UserPlus },
                { id: "hist-reservations", label: "Historique Réservations", icon: Ticket }
            ]
        }
    ];

    return (
        <aside className={`${sidebarOpen ? "w-72" : "w-20"} relative bg-gradient-to-b from-zinc-950 to-black border-r border-zinc-900/50 transition-all duration-300 flex flex-col h-screen`}>
            {/* Gradient top accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>

            {/* Logo Section */}
            <div className="p-6 border-b border-zinc-900/50 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                    {sidebarOpen && (
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-red-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <div className="relative w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-xl">
                                    <Film className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-wider text-white">CINÉMANA</h2>
                                <p className="text-[10px] text-zinc-600 tracking-wide">Espace Personnel</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2.5 hover:bg-zinc-900 rounded-xl transition-all group text-white"
                    >
                        {sidebarOpen ?
                            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> :
                            <Menu className="w-4 h-4" />
                        }
                    </button>
                </div>
            </div>

            {/* News Feed */}
            {sidebarOpen && (
                <div className="px-6 py-4">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold"> </span>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {menuItems.map((item) => (
                    <div key={item.id}>
                        <button
                            onClick={() => {
                                if (item.subItems) {
                                    toggleSubMenu(item.id);
                                } else {
                                    setActiveMenu(item.id);
                                }
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${activeMenu === item.id && !item.subItems
                                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50"
                                : "hover:bg-zinc-900/30 text-zinc-500 hover:text-white"
                            }`}
                        >
                            {/* Hover Glow Effect */}
                            {!(activeMenu === item.id && !item.subItems) && (
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}

                            <div className="flex items-center gap-3 relative z-10">
                                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${activeMenu === item.id ? 'scale-110' : 'group-hover:text-red-500'}`} />
                                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                            </div>
                            {sidebarOpen && item.subItems && (
                                <div className={`relative z-10 transition-transform duration-300 ${openSubMenus[item.id] ? 'rotate-180' : ''}`}>
                                    <ChevronDown className="w-4 h-4 group-hover:text-red-500 transition-colors" />
                                </div>
                            )}
                        </button>

                        {/* Submenu */}
                        {item.subItems && openSubMenus[item.id] && sidebarOpen && (
                            <div className="ml-6 mt-1 space-y-1 border-l-2 border-zinc-800/50 pl-4 animate-in slide-in-from-top-2 duration-300">
                                {item.subItems.map((subItem) => (
                                    <button
                                        key={subItem.id}
                                        onClick={() => setActiveMenu(subItem.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${activeMenu === subItem.id
                                            ? "bg-red-600/10 text-red-400 border-l-2 border-red-500"
                                            : "hover:bg-zinc-900/30 text-zinc-600 hover:text-zinc-300"
                                        }`}
                                    >
                                        <subItem.icon className="w-4 h-4" />
                                        <span>{subItem.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-zinc-900/50">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-900 text-zinc-600 hover:text-red-500 transition-all group">
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    {sidebarOpen && <span className="text-sm font-medium">Déconnexion</span>}
                </button>
            </div>
        </aside>
    );
}
