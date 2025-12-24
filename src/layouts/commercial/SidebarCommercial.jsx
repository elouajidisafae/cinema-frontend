import { LayoutDashboard, LogOut, Menu, X, Film, Ticket, XCircle } from "lucide-react";

export default function SidebarCommercial({
                                              sidebarOpen,
                                              setSidebarOpen,
                                              activeMenu,
                                              setActiveMenu,
                                              logout
                                          }) {
    const menuItems = [
        { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
        { id: "seances/actives", label: "Séances Actives", icon: Film },
        { id: "seances/archives", label: "Séances Archivées", icon: XCircle },
        { id: "reservations", label: "Réservations", icon: Ticket },
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
                                <p className="text-[10px] text-zinc-600 tracking-wide">Espace Commercial</p>
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

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 mt-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveMenu(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${activeMenu === item.id
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50"
                            : "hover:bg-zinc-900/30 text-zinc-500 hover:text-white"
                        }`}
                    >
                        {/* Hover Glow Effect */}
                        {activeMenu !== item.id && (
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}

                        <div className="flex items-center gap-3 relative z-10">
                            <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${activeMenu === item.id ? 'scale-110' : 'group-hover:text-red-500'}`} />
                            {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                        </div>
                    </button>
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
