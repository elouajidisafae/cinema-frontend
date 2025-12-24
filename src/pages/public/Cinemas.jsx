import { Monitor, Speaker, Armchair, MapPin, Star, Zap, Navigation, Phone, Clock, Coffee, Utensils, Music, Users, Crown, Sparkles, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function Cinemas() {
    const amenities = [
        {
            icon: Monitor,
            title: "Projection Laser 4K",
            desc: "Une image ultra-nette avec des contrastes infinis pour une immersion totale."
        },
        {
            icon: Speaker,
            title: "Son Dolby Atmos",
            desc: "Un son tridimensionnel qui se déplace autour de vous avec un réalisme à couper le souffle."
        },
        {
            icon: Armchair,
            title: "Confort Premium",
            desc: "Des sièges larges et inclinables avec un espacement généreux pour vos jambes."
        },
        {
            icon: Zap,
            title: "Expérience HFR",
            desc: "High Frame Rate pour une fluidité exceptionnelle dans les scènes d'action."
        }
    ];

    return (
        <div className="min-h-screen bg-[#040404] text-white pb-20 relative font-sans">
            {/* STICKY BACKGROUND EFFECTS - ENHANCED */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-red-600/15 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-red-600/15 rounded-full blur-[140px] animate-pulse duration-[5000ms]" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-black" />
            </div>

            <div className="relative z-10">
                {/* HERO SECTION */}
                <div className="relative h-[65vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop"
                            alt="Cinema Hall"
                            className="w-full h-full object-cover opacity-60 scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>

                    <div className="relative z-10 text-center px-6 animate-in slide-in-from-bottom-10 fade-in duration-700">
                        <span className="text-red-600 font-bold tracking-widest uppercase text-sm mb-4 block">Bienvenue chez vous</span>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 text-white">CINÉMANA</h1>
                        <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
                            Votre destination cinéma par excellence. Une technologie de pointe au service de vos émotions.
                        </p>
                    </div>
                </div>

                {/* AMENITIES GRID */}
                <div className="container mx-auto px-6 py-20">
                    <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-left duration-500">
                        <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
                        <h2 className="text-3xl font-black text-white">Technologies & Équipements</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {amenities.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl hover:border-red-600/50 transition-all duration-300 hover:bg-zinc-900 hover:scale-105 hover:shadow-2xl hover:shadow-red-900/20 group animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="w-14 h-14 bg-red-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-red-600/20 transition-all duration-300">
                                    <item.icon className="w-7 h-7 text-red-500 group-hover:rotate-12 transition-transform duration-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-red-500 transition-colors">{item.title}</h3>
                                <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECTION: NOS SALLES D'EXCEPTION */}
                <div className="bg-zinc-900/30 py-24 border-y border-white/5">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
                            <span className="text-red-500 font-bold tracking-widest uppercase text-sm mb-4 block">Immersion Totale</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Nos Salles d'Exception</h2>
                            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                                Découvrez une nouvelle façon de vivre le cinéma avec nos différentes typologies de salles conçues pour votre confort.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* VIP ROOM */}
                            <div className="group relative overflow-hidden rounded-3xl h-[450px] cursor-default shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=2070&auto=format&fit=crop"
                                    alt="Salle VIP"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                <div className="absolute bottom-0 p-8 w-full transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Crown className="text-yellow-500 fill-yellow-500" size={24} />
                                        <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-yellow-500/20">Ultra Premium</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-2">Salles VIP</h3>
                                    <p className="text-zinc-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        Fauteuils en cuir inclinables, service à table et menu gourmand exclusif.
                                    </p>
                                </div>
                            </div>

                            {/* IMAX / 3D ROOM */}
                            <div className="group relative overflow-hidden rounded-3xl h-[450px] cursor-default shadow-2xl">
                                <img
                                    src="/imax.jpg"
                                    alt="Salle IMAX"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                <div className="absolute bottom-0 p-8 w-full transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Monitor className="text-red-500" size={24} />
                                        <span className="bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-red-500/20">Immersion Totale</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-2">Salles IMAX</h3>
                                    <p className="text-zinc-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        L'écran le plus grand de la ville avec un son qui vous transporte au cœur de l'action.
                                    </p>
                                </div>
                            </div>

                            {/* CLASSIC ROOM */}
                            <div className="group relative overflow-hidden rounded-3xl h-[450px] cursor-default shadow-2xl">
                                <img
                                    src="/confort.jpg"
                                    alt="Salle Classique"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                <div className="absolute bottom-0 p-8 w-full transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles className="text-zinc-300" size={24} />
                                        <span className="bg-white/10 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-white/20">Standard Or</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-2">Salles Confort</h3>
                                    <p className="text-zinc-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        L'expérience cinéma authentique avec une qualité d'image et de son irréprochable.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: L'EXPÉRIENCE GOURMANDE */}
                <div className="py-24 overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2 relative">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-600/20 blur-3xl rounded-full animate-pulse"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <img
                                        src="/pop.jpg"
                                        alt="Popcorn"
                                        className="rounded-2xl h-80 w-full object-cover shadow-2xl group animate-in fade-in slide-in-from-left duration-700"
                                    />
                                    <img
                                        src="https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?q=80&w=1974&auto=format&fit=crop"
                                        alt="Candy Bar"
                                        className="rounded-2xl h-80 w-full object-cover shadow-2xl animate-in fade-in slide-in-from-right duration-700"
                                    />
                                </div>
                            </div>
                            <div className="lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-right duration-700">
                                <span className="text-red-600 font-black tracking-[0.3em] uppercase text-sm">Saveurs & Plaisirs</span>
                                <h2 className="text-5xl font-black leading-tight">L'Expérience Gourmande</h2>
                                <p className="text-zinc-400 text-lg leading-relaxed">
                                    Parce qu'une séance n'est pas complète sans ses gourmandises. Notre bar à confiseries vous propose une sélection premium pour ravir vos papilles.
                                </p>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="flex gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-red-600/20 transition-all">
                                        <Utensils className="text-red-500 shrink-0" size={24} />
                                        <div>
                                            <h4 className="font-bold text-white mb-1">Popcorn Artisanal</h4>
                                            <p className="text-zinc-500 text-sm">Sucré, salé ou caramélisé le jour même.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-red-600/20 transition-all">
                                        <Coffee className="text-red-500 shrink-0" size={24} />
                                        <div>
                                            <h4 className="font-bold text-white mb-1">Espace Lounge</h4>
                                            <p className="text-zinc-500 text-sm">Cafés premium et pâtisseries fraîches.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: PRIVATISATION & ÉVÉNEMENTS */}
                <div className="py-24 bg-gradient-to-b from-zinc-900/40 to-black">
                    <div className="container mx-auto px-6">
                        <div className="bg-zinc-900/80 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 md:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                                <div className="lg:w-1/2 space-y-6">
                                    <h2 className="text-4xl md:text-5xl font-black">Événements & Privatisation</h2>
                                    <p className="text-zinc-400 text-lg">
                                        Organisez vos moments les plus mémorables dans nos salles. Anniversaires, séminaires ou projections privées, nous créons l'événement sur mesure pour vous.
                                    </p>
                                    <ul className="space-y-4 text-zinc-300">
                                        <li className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                            Privatisation de salles VIP
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                            Cocktails & Collations personnalisées
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                            Support technique dédié
                                        </li>
                                    </ul>
                                    <button className="mt-4 bg-white text-black font-black px-10 py-4 rounded-full hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl">
                                        Demander un Devis
                                    </button>
                                </div>
                                <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5 hover:bg-zinc-800 transition-colors">
                                            <Users className="text-red-500 mb-4" size={32} />
                                            <h4 className="font-bold text-lg mb-2">Groupes</h4>
                                            <p className="text-zinc-500 text-sm">Sorties scolaires ou entre amis.</p>
                                        </div>
                                        <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5 hover:bg-zinc-800 transition-colors">
                                            <Music className="text-red-500 mb-4" size={32} />
                                            <h4 className="font-bold text-lg mb-2">Afterworks</h4>
                                            <p className="text-zinc-500 text-sm">Combinez travail et plaisir.</p>
                                        </div>
                                    </div>
                                    <div className="mt-8 space-y-4">
                                        <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5 hover:bg-zinc-800 transition-colors h-full flex flex-col justify-center">
                                            <Sparkles className="text-red-500 mb-4" size={32} />
                                            <h4 className="font-bold text-lg mb-2">Anniversaires</h4>
                                            <p className="text-zinc-500 text-sm">Une fête magique sur grand écran.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LOCATION / INFO */}
                <div className="container mx-auto px-6 mb-20">
                    <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-left duration-500">
                        <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
                        <h2 className="text-3xl font-black text-white">Nous Trouver</h2>
                    </div>
                    <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-red-900/30 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-2xl shadow-red-900/10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-3xl md:text-4xl font-black text-white">Votre Cinéma CINÉMANA</h2>
                            <p className="text-zinc-400 text-lg">
                                Situé au cœur de Casablanca, CINÉMANA vous accueille pour une expérience cinéma inoubliable. Parking gratuit et accès facile.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group">
                                    <div className="w-10 h-10 bg-red-600/10 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                                        <MapPin className="text-red-600 group-hover:text-white transition-colors" size={20} />
                                    </div>
                                    <span className="font-medium">Boulevard Mohammed V, Casablanca, Maroc</span>
                                </div>
                                <div className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group">
                                    <div className="w-10 h-10 bg-red-600/10 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                                        <Clock className="text-red-600 group-hover:text-white transition-colors" size={20} />
                                    </div>
                                    <span className="font-medium">Ouvert 7j/7 de 10h à 00h</span>
                                </div>
                                <div className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group">
                                    <div className="w-10 h-10 bg-red-600/10 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                                        <Phone className="text-red-600 group-hover:text-white transition-colors" size={20} />
                                    </div>
                                    <span className="font-medium">+212 522-XXXXXX</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Link to="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/30 group">
                                    <Star className="group-hover:rotate-180 transition-transform duration-500" size={20} />
                                    Voir les séances
                                </Link>
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=Megarama+Casablanca"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105 group"
                                >
                                    <Navigation className="group-hover:translate-x-1 transition-transform" size={20} />
                                    Itinéraire
                                </a>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 aspect-video bg-zinc-800 rounded-2xl overflow-hidden border border-red-900/30 shadow-2xl shadow-red-900/10">
                            <iframe
                                src="https://maps.google.com/maps?q=33.5712104,-7.6298629&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="CINÉMANA Location - Megarama Casablanca"
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
