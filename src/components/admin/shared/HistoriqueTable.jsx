import React, { useState } from 'react';
import { Download, Search, ChevronLeft, ChevronRight, Filter, FileSpreadsheet, FileText } from 'lucide-react';
import { downloadExcelFromBackend } from '../../../utils/exportUtils';

export default function HistoriqueTable({
                                            title,
                                            icon: Icon,
                                            data = [],
                                            columns = [],
                                            isLoading = false,
                                            filters,
                                            stats = [],
                                            exportEndpoint,  // Nouvel endpoint pour l'export backend
                                            exportParams = {}, // Paramètres/filtres pour l'export backend
                                            pageName = 'Export' // Nom de la page pour le fichier
                                        }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Pagination Logic
    const safeData = Array.isArray(data) ? data : [];
    const totalPages = Math.ceil(safeData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = safeData.slice(startIndex, startIndex + itemsPerPage);


    return (
        <div className="space-y-6">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-600/10 rounded-lg">
                            <Icon className="w-6 h-6 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">{title}</h1>
                    </div>
                    <p className="text-zinc-400">Consultez et gérez l'historique des activités.</p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    {exportEndpoint && (
                        <button
                            onClick={() => downloadExcelFromBackend(exportEndpoint, exportParams, pageName)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-green-600/10 hover:bg-green-600/20 text-green-500 rounded-xl transition-all text-sm font-medium border border-green-600/20"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Exporter Excel
                        </button>
                    )}
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.colorBg || 'bg-blue-500/10'}`}>
                                <stat.icon className={`w-4 h-4 ${stat.colorText || 'text-blue-500'}`} />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 uppercase font-bold">{stat.label}</p>
                                <p className="text-lg font-bold text-white">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-zinc-950/40 border border-zinc-800/50 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center backdrop-blur-xl relative z-20">
                <div className="flex-1 w-full md:w-auto flex flex-wrap gap-3 items-center">
                    {/* Filter Slot */}
                    {filters}
                </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-950 border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl relative z-10">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-black/40 border-b border-zinc-800">
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-widest text-[10px]">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-zinc-500">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                        Chargement des données...
                                    </div>
                                </td>
                            </tr>
                        ) : paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-zinc-500">
                                    Aucune donnée trouvée pour cette période.
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-zinc-800/20 transition-all duration-300 border-b border-zinc-800/30 last:border-0 group">
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 text-sm text-zinc-300 font-medium text-left">
                                            {col.render ? col.render(row) : (
                                                // Simple fallback for nested props
                                                col.accessor.includes('.')
                                                    ? col.accessor.split('.').reduce((obj, key) => obj?.[key], row)
                                                    : row[col.accessor]
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && data.length > 0 && (
                    <div className="px-6 py-4 border-t border-zinc-800/50 bg-zinc-950/50 flex items-center justify-between">
                        <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
                            Affichage <span className="text-white">{startIndex + 1}</span> - <span className="text-white">{Math.min(startIndex + itemsPerPage, data.length)}</span> <span className="text-zinc-700 px-2">|</span> Total <span className="text-white">{data.length}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-zinc-400 hover:text-white border border-transparent hover:border-zinc-700"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="px-4 py-1.5 bg-zinc-900/50 rounded-lg border border-zinc-800 text-xs font-bold text-zinc-400">
                                {currentPage} / {totalPages}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-xl hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-zinc-400 hover:text-white border border-transparent hover:border-zinc-700"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
