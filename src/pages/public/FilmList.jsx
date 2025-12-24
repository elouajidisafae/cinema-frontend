import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { publicApi } from "../../api";
import { Play, Info, Calendar, Clock, ArrowRight, Search, X, Star } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";

export default function FilmList() {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [heroFilm, setHeroFilm] = useState(null);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("q") || "";

    useEffect(() => {
        fetchFilms();
    }, []);

    const fetchFilms = async () => {
        try {
            const res = await publicApi.getAllFilms();
            setFilms(res.data);
            if (res.data.length > 0) {
                setHeroFilm(res.data[Math.floor(Math.random() * res.data.length)]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Filter films based on search
    const filteredFilms = films.filter(f =>
        f.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Play size={24} className="text-red-600 fill-current animate-pulse" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-[#040404] min-h-screen font-sans selection:bg-red-600 selection:text-white pb-20 relative">
            {/* STICKY BACKGROUND EFFECTS */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-red-600/10 rounded-full blur-[120px] animate-pulse duration-[4000ms]" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px]" />
            </div>

            <div className="relative z-10">
                {/* HERO SECTION - Only show if NO search */}
                {!searchQuery && heroFilm && (
                    <div className="relative h-[90vh] w-full overflow-hidden flex items-center mb-10">
                        {/* 1. Background Layer: Sharp & Full */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src={getImageUrl(heroFilm.afficheUrl)}
                                alt=""
                                className="w-full h-full object-cover object-top opacity-60"
                            />
                            {/* Gradient Overlays for Text Readability - Matching FilmDetail */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
                        </div>

                        {/* 2. Content Layer: Split View */}
                        <div className="container mx-auto px-6 relative z-10 w-full h-full flex flex-col justify-center">
                            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">

                                {/* Left: Text Content */}
                                <div className="flex-1 text-center md:text-left animate-in slide-in-from-bottom-10 fade-in duration-700">
                                    <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                                        <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-md shadow-lg shadow-red-900/40">
                                            À la une
                                        </span>
                                        <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                                            <Star size={14} fill="currentColor" /> 4.9
                                        </div>
                                    </div>

                                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                                        {heroFilm.titre}
                                    </h1>

                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-zinc-300 mb-8 text-sm font-medium">
                                        <span className="bg-white/10 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-white/20">
                                            {heroFilm.genre}
                                        </span>
                                        <div className="flex items-center gap-1"><Clock size={16} className="text-red-500" /> {heroFilm.duree} min</div>
                                        <div className="flex items-center gap-1 text-red-500 font-bold">4K HDR</div>
                                    </div>

                                    <p className="text-zinc-200 text-base md:text-lg mb-8 line-clamp-3 leading-relaxed max-w-xl drop-shadow-md mx-auto md:mx-0 font-light opacity-80">
                                        {heroFilm.description}
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                        <Link
                                            to={`/film/${heroFilm.id}`}
                                            className="bg-red-600 text-white hover:bg-red-700 px-10 py-4 rounded-full font-black flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                                        >
                                            <Play fill="currentColor" size={20} />
                                            Réserver ma place
                                        </Link>
                                    </div>
                                </div>

                                {/* Right: The Poster Itself (Uncropped, Floating) */}
                                <div className="hidden lg:block w-auto shrink-0 animate-in fade-in zoom-in duration-1000 delay-200 perspective-1000">
                                    <div className="relative group cursor-pointer transform transition-all duration-700 hover:rotate-y-12 hover:scale-105">
                                        <img
                                            src={getImageUrl(heroFilm.afficheUrl)}
                                            alt={heroFilm.titre}
                                            className="w-auto h-auto max-h-[60vh] max-w-[450px] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10 object-contain"
                                        />
                                        <div className="absolute -bottom-6 inset-x-0 h-8 bg-black/60 blur-2xl opacity-50 rounded-[100%]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SEARCH HEADER */}
                {searchQuery && (
                    <div className="container mx-auto px-6 pt-24 pb-10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black flex items-center gap-4 text-white">
                                <Search className="text-red-600" size={32} />
                                Résultats pour "{searchQuery}"
                            </h2>
                            <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all bg-zinc-900/50 hover:bg-red-600/10 border border-zinc-800 hover:border-red-600 px-6 py-2.5 rounded-full">
                                <X size={18} />
                                Tout voir
                            </Link>
                        </div>
                    </div>
                )}

                {/* TRENDING SECTION */}
                <div className="container mx-auto px-6 py-10 pt-20">
                    {!searchQuery && (
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-white flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
                                Top Sorties
                            </h2>
                            <div className="flex gap-2">
                                <div className="w-10 h-1bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="w-1/2 h-full bg-red-600"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className={`flex ${searchQuery ? 'flex-wrap justify-center md:justify-start' : 'overflow-x-auto'} gap-8 pb-10 pt-8 scrollbar-hide snap-x`}>
                        {(searchQuery ? filteredFilms : films.slice(0, 10)).map((film, idx) => (
                            <Link
                                to={`/film/${film.id}`}
                                key={film.id}
                                className="min-w-[220px] w-[220px] md:min-w-[260px] md:w-[260px] group relative snap-start animate-in fade-in slide-in-from-bottom-4 focus:outline-none rounded-3xl hover:z-50 transition-all"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <div className="aspect-[2/3] rounded-3xl overflow-hidden mb-4 relative shadow-2xl bg-zinc-900 border border-white/5 transition-all duration-500 ease-out group-hover:-translate-y-4 group-hover:border-red-600/50 group-hover:shadow-[0_20px_40px_rgba(220,38,38,0.15)] group-active:scale-95">
                                    <img
                                        src={getImageUrl(film.afficheUrl)}
                                        alt={film.titre}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Action Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                    <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded border border-white/10">
                                            {film.ageLimite || 'TP'}
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center translate-y-10 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50 transform group-hover:scale-110 transition-transform duration-500">
                                            <Play size={24} fill="currentColor" className="ml-1 text-white" />
                                        </div>
                                    </div>

                                    {/* Bottom Info Gradient */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black to-transparent">
                                        <div className="flex items-center gap-2 text-white font-bold text-xs">
                                            <Clock size={12} className="text-red-500" /> {film.duree} min
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-white group-hover:text-red-500 transition-colors line-clamp-1 mb-1">{film.titre}</h3>
                                <div className="flex items-center gap-3 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                                    <span className="text-red-500/80">{film.genre}</span>
                                    <span>•</span>
                                    <span>{new Date(film.dateSortie).getFullYear()}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* GENRE SWIMLANES */}
                {!searchQuery && ['Action', 'Aventure', 'Animation', 'Horreur', 'Science-Fiction'].map((genre, i) => {
                    const genreFilms = films.filter(f => f.genre === genre);
                    if (genreFilms.length === 0) return null;

                    return (
                        <div key={genre} className="container mx-auto px-6 py-10">
                            <div className="flex items-center justify-between mb-6 group/row">
                                <h2 className="text-2xl font-black text-zinc-400 group-hover/row:text-white transition-colors cursor-pointer flex items-center gap-3">
                                    {genre}
                                    <ArrowRight size={20} className="text-red-600 opacity-0 -translate-x-4 group-hover/row:opacity-100 group-hover/row:translate-x-0 transition-all" />
                                </h2>
                            </div>

                            <div className="flex overflow-x-auto gap-8 pb-10 pt-8 px-6 no-scrollbar snap-x snap-mandatory">
                                {genreFilms.map((film) => (
                                    <Link
                                        to={`/film/${film.id}`}
                                        key={film.id}
                                        className="min-w-[170px] w-[170px] md:min-w-[210px] md:w-[210px] group relative snap-start focus:outline-none rounded-3xl hover:z-50 transition-all"
                                    >
                                        <div className="aspect-[2/3] rounded-3xl overflow-hidden mb-4 relative bg-zinc-900 border border-white/5 transition-all duration-500 ease-out group-hover:-translate-y-4 group-hover:border-red-600/50 group-hover:shadow-[0_20px_40px_rgba(220,38,38,0.15)] group-active:scale-95">
                                            <img
                                                src={getImageUrl(film.afficheUrl)}
                                                alt={film.titre}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />

                                            {/* Action Overlays */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                            <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            <div className="absolute top-3 right-3 z-20">
                                                <div className="bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-1.5 py-0.5 rounded border border-white/10">
                                                    {film.ageLimite || 'TP'}
                                                </div>
                                            </div>

                                            <div className="absolute inset-0 flex items-center justify-center translate-y-10 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-600/50 transform group-hover:scale-110 transition-transform duration-500">
                                                    <Play size={18} fill="currentColor" className="ml-0.5 text-white" />
                                                </div>
                                            </div>

                                            {/* Bottom Info Gradient */}
                                            <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black to-transparent">
                                                <div className="flex items-center gap-2 text-white font-bold text-[10px]">
                                                    <Clock size={10} className="text-red-500" /> {film.duree} min
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-black text-white group-hover:text-red-500 line-clamp-1 transition-colors">{film.titre}</h3>
                                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{new Date(film.dateSortie).getFullYear()}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

