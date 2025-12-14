import React, { useState } from 'react';
import { Download, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function HistoriqueTable({
                                            title,
                                            icon: Icon,
                                            data = [],
                                            columns = [],
                                            isLoading = false,
                                            filters,
                                            stats = []
                                        }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Pagination Logic
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    const handleExportCSV = () => {
        if (!data || data.length === 0) return;

        const headers = columns.map(col => col.header).join(',');
        const rows = data.map(row =>
            columns.map(col => {
                let val = row[col.accessor];
                // Handle nested properties if accessor is 'user.name'
                if (col.accessor.includes('.')) {
                    val = col.accessor.split('.').reduce((obj, key) => obj?.[key], row);
                }
                // Handle render function
                if (col.render) {
                    // This might be tricky for CSV if render returns JSX.
                    // Best to have a specific 'csvValue' or just use raw value.
                    // For now, simpler approach: use raw value.
                    val = row[col.accessor] || '';
                }
                return `"${String(val || '').replace(/"/g, '""')}"`;
            }).join(',')
        );

        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
        link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, '_')}_${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Stats Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-600/10 rounded-lg">
                            <Icon className="w-6 h-6 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">{title}</h1>
                    </div>
                    <p className="text-zinc-400">Consultez et gérez l'historique des activités.</p>
                </div>

                <div className="flex gap-3">
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

            {/* Filters & Actions Bar */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center backdrop-blur-sm">
                <div className="flex-1 w-full md:w-auto flex flex-wrap gap-3 items-center">
                    {/* Filter Slot */}
                    {filters}
                </div>

                <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg flex items-center gap-2 transition-all text-sm font-medium border border-zinc-700"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-black/40 border-b border-zinc-800">
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-4 text-center text-xs font-bold text-zinc-400 uppercase tracking-wider">
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
                                <tr key={rowIndex} className="hover:bg-zinc-800/30 transition-colors group">
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 text-sm text-zinc-300 whitespace-nowrap text-center">
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
                    <div className="px-6 py-4 border-t border-zinc-800 bg-black/20 flex items-center justify-between">
                        <p className="text-sm text-zinc-500">
                            Affichage de <span className="text-white font-medium">{startIndex + 1}</span> à <span className="text-white font-medium">{Math.min(startIndex + itemsPerPage, data.length)}</span> sur <span className="text-white font-medium">{data.length}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-zinc-400 hover:text-white"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium text-zinc-400">
                                Page {currentPage} sur {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-zinc-400 hover:text-white"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
