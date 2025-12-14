import { Eye, Edit, Trash2, RefreshCw } from "lucide-react";

export default function UserTable({ users, onEdit, onToggleStatus, onViewDetails, isArchiveView = false }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr className="border-b border-zinc-800/50 text-left">
                    <th className="py-4 px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Utilisateur</th>
                    <th className="py-4 px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Email</th>
                    <th className="py-4 px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Rôle</th>
                    <th className="py-4 px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Statut</th>
                    <th className="py-4 px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                {users.map((user) => (
                    <tr key={user.id} className="group hover:bg-zinc-900/30 transition-colors">
                        <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-zinc-700/50 text-white font-bold">
                                    {user.prenom?.[0]}{user.nom?.[0]}
                                </div>
                                <div>
                                    <div className="font-medium text-white">{user.prenom} {user.nom}</div>
                                </div>
                            </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-zinc-400">{user.email}</td>
                        <td className="py-4 px-4">
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${user.role === 'ADMIN' ? 'bg-red-600/10 text-red-400 border-red-900/30' :
                                    user.role === 'COMMERCIAL' ? 'bg-blue-600/10 text-blue-400 border-blue-900/30' :
                                        'bg-emerald-600/10 text-emerald-400 border-emerald-900/30'
                                }`}>
                                    {user.role}
                                </span>
                        </td>
                        <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                                {user.actif ? (
                                    <>
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-sm text-zinc-400">Actif</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <span className="text-sm text-zinc-400">Inactif</span>
                                    </>
                                )}
                            </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => onViewDetails(user)}
                                    className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                                    title="Voir détails"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>

                                {!isArchiveView && (
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="p-2 rounded-lg hover:bg-blue-900/20 text-zinc-500 hover:text-blue-400 transition-colors"
                                        title="Modifier"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                )}

                                <button
                                    onClick={() => onToggleStatus(user)}
                                    className={`p-2 rounded-lg transition-colors ${isArchiveView
                                        ? 'hover:bg-emerald-900/20 text-zinc-500 hover:text-emerald-400'
                                        : 'hover:bg-red-900/20 text-zinc-500 hover:text-red-400'
                                    }`}
                                    title={isArchiveView ? "Réactiver" : "Désactiver"}
                                >
                                    {isArchiveView ? <RefreshCw className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                {users.length === 0 && (
                    <tr>
                        <td colSpan="5" className="py-8 text-center text-zinc-500">
                            Aucun utilisateur trouvé.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
