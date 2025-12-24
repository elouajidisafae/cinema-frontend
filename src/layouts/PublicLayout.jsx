import { Outlet, Link, useNavigate } from "react-router-dom";
import { Film, User, Search, Menu, X, Facebook, Twitter, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import ToastProvider from "../components/ui/ToastProvider";

export default function PublicLayout() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery(""); // Optional: clear after search or keep it? Keeping it is usually better but let's clear for now or let the next page handle it. Actually clearing it might be annoying if user wants to refine. Let's keep it bound to URL if possible? Too complex for layout. Just navigate.
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white">
            <ToastProvider />

            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-gradient-to-b from-black/80 to-transparent py-5'}`}>
                <div className="container mx-auto px-6 flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center -rotate-6 transition-transform group-hover:rotate-0">
                            <Film className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">CINÉMANA</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-medium hover:text-red-500 transition-colors">Films</Link>
                        <Link to="/cinemas" className="text-sm font-medium hover:text-red-500 transition-colors">Cinémas</Link>
                        <Link to="/offres" className="text-sm font-medium hover:text-red-500 transition-colors">Offres</Link>
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Rechercher un film..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="bg-white/10 border border-transparent focus:border-red-600 rounded-full px-4 py-2 pl-10 text-sm w-48 transition-all focus:w-64 focus:outline-none"
                            />
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500" />
                        </div>

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 text-sm font-medium hover:text-white transition-colors focus:outline-none">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold shadow-lg shadow-red-900/20">
                                        {user.nomComplet ? user.nomComplet.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                                    </div>
                                    <span className="hidden lg:block">{user.nomComplet || "Client"}</span>
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden">
                                    <div className="p-2">
                                        <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                                            <p className="text-white text-xs font-bold truncate">{user.nomComplet}</p>
                                            <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Client</p>
                                        </div>
                                        <Link to="/client/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                            <User className="w-4 h-4" />
                                            Mon Espace
                                        </Link>
                                        <button onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <span>Déconnexion</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login/client" className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2 rounded-full transition-transform hover:scale-105">
                                    Connexion
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-black border-b border-white/10 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-4">
                        <Link to="/" className="text-lg font-medium">Films</Link>
                        <Link to="/cinemas" className="text-lg font-medium">Cinémas</Link>
                        <hr className="border-white/10 my-2" />
                        {user ? (
                            <Link to="/client/dashboard" className="text-lg font-bold text-red-500">Mon Espace</Link>
                        ) : (
                            <>
                                <Link to="/login/client" className="text-lg font-medium">Connexion</Link>
                                <Link to="/register" className="text-lg font-bold text-red-500">S'inscrire</Link>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-zinc-900/50 border-t border-white/5 py-16 mt-20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                    <Film className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">CINÉMANA</span>
                            </div>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                La meilleure expérience cinéma. Réservez vos places en quelques clics et profitez des dernières sorties en qualité premium.
                            </p>
                            <div className="flex gap-4 mt-6">
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"><Facebook size={18} /></a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"><Twitter size={18} /></a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"><Instagram size={18} /></a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6">Films</h4>
                            <ul className="space-y-3 text-zinc-500 text-sm">
                                <li><a href="#" className="hover:text-red-500 transition-colors">A l'affiche</a></li>
                                <li><a href="#" className="hover:text-red-500 transition-colors">Prochainement</a></li>
                                <li><a href="#" className="hover:text-red-500 transition-colors">Box Office</a></li>
                                <li><a href="#" className="hover:text-red-500 transition-colors">Avant-premières</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6">Aide</h4>
                            <ul className="space-y-3 text-zinc-500 text-sm">
                                <li><a href="#" className="hover:text-red-500 transition-colors">FAQ</a></li>
                                <li><a href="#" className="hover:text-red-500 transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-red-500 transition-colors">Conditions Générales</a></li>
                                <li><a href="#" className="hover:text-red-500 transition-colors">Mentions Légales</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6">Newsletter</h4>
                            <p className="text-zinc-500 text-sm mb-4">Recevez les dernières news et offres exclusives.</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Votre email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:border-red-600 focus:outline-none" />
                                <button className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 transition-colors">OK</button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/5 mt-16 pt-8 text-center text-zinc-600 text-xs">
                        &copy; 2025 CINÉMANA. Tous droits réservés.
                    </div>
                </div>
            </footer>
        </div>
    );
}
