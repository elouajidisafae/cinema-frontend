import { X, Mail, Shield, CheckCircle, XCircle, Calendar, CreditCard, User, BadgeCheck } from "lucide-react";

export default function UserDetails({ user, onClose }) {
    if (!user) return null;

    return (
        <div className="max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="relative bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl">
                {/* Subtle background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 p-3 rounded-xl bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 text-zinc-500 hover:text-white hover:bg-red-600/20 hover:border-red-600/30 hover:rotate-90 transition-all duration-300"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content Container */}
                <div className="relative p-6">
                    {/* Top Section - Profile */}
                    <div className="flex flex-col items-center text-center mb-6">
                        {/* Avatar Section */}
                        <div className="relative mb-4">
                            <div className="relative group">
                                {/* Glowing ring */}
                                <div className="absolute -inset-1 bg-red-600/20 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>

                                {/* Avatar */}
                                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center border-4 border-zinc-800/50 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                    <span className="relative text-4xl font-black bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                                        {user.prenom?.[0]}{user.nom?.[0]}
                                    </span>
                                </div>

                                {/* Status Badge - Positioned to the right */}
                                <div className={`absolute bottom-2 -right-1 p-1.5 rounded-full border-4 border-zinc-950 ${user.actif ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/50' : 'bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/50'}`}>
                                    {user.actif ?
                                        <BadgeCheck className="w-4 h-4 text-white" strokeWidth={2.5} /> :
                                        <XCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div>
                            <h2 className="text-3xl font-black mb-2">
                                <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                                    {user.prenom} {user.nom}
                                </span>
                            </h2>
                            <div className="inline-block px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600/20 to-red-800/20 border border-red-500/30 backdrop-blur-sm">
                                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">{user.role}</span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/30 to-transparent blur-sm"></div>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3">
                        {/* Quick Stats Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <Shield className="w-3.5 h-3.5 text-red-500" />
                                    <span className="text-[10px] text-zinc-600 font-semibold uppercase">ID</span>
                                </div>
                                <p className="text-lg font-bold text-white">{user.id}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <CreditCard className="w-3.5 h-3.5 text-red-500" />
                                    <span className="text-[10px] text-zinc-600 font-semibold uppercase">CIN</span>
                                </div>
                                <p className="text-lg font-bold text-white">{user.cin || "N/A"}</p>
                            </div>
                        </div>

                        {/* Email Card */}
                        <div className="group relative p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50 hover:border-red-900/50 backdrop-blur-sm transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:to-red-800/5 transition-all duration-300"></div>
                            <div className="relative flex items-center gap-3">
                                <div className="p-3 rounded-lg bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30">
                                    <Mail className="w-5 h-5 text-red-400" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-0.5">Email Professionnel</p>
                                    <p className="text-sm text-white font-medium truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Dates Card */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-red-500" />
                                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Naissance</span>
                                </div>
                                <p className="text-sm font-bold text-white">{user.dateNaissance || "-"}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-red-500" />
                                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Embauche</span>
                                </div>
                                <p className="text-sm font-bold text-white">{user.dateEmbauche || "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
