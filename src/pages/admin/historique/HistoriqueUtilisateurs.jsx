import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../api/admin.api';
import HistoriqueTable from '../../../components/admin/shared/HistoriqueTable';
import MultiSelectFilter from '../../../components/admin/shared/MultiSelectFilter';
import { Users, UserPlus, UserMinus, UserCheck, Search, Calendar } from 'lucide-react';

export default function HistoriqueUtilisateurs() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        operations: [],
        start: '',
        end: ''
    });

    const [statsData, setStatsData] = useState({ CREATION: 0, MODIFICATION: 0, SUPPRESSION: 0 });

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const params = {};
            if (filters.search) params.search = filters.search;
            // Serialize array as comma-separated string for Spring Boot
            if (filters.operations && filters.operations.length > 0) {
                params.operations = filters.operations.join(',');
            }
            if (filters.start) params.start = new Date(filters.start).toISOString();
            if (filters.end) params.end = new Date(filters.end).toISOString();

            const response = await adminApi.getFilteredUserHistory(params);
            setData(response.data);
        } catch (error) {
            console.error("Erreur chargement historique:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await adminApi.getGlobalUserHistoryStats();
            setStatsData(response.data);
        } catch (error) {
            console.error("Erreur chargement stats:", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(fetchHistory, 500);
        return () => clearTimeout(timeout);
    }, [filters]);

    const stats = [
        {
            label: "Créations",
            value: statsData.CREATION || 0,
            icon: UserPlus,
            colorBg: "bg-green-500/10",
            colorText: "text-green-500"
        },
        {
            label: "Modifications",
            value: statsData.MODIFICATION || 0,
            icon: UserCheck,
            colorBg: "bg-blue-500/10",
            colorText: "text-blue-500"
        },
        {
            label: "Suppressions",
            value: statsData.SUPPRESSION || 0,
            icon: UserMinus,
            colorBg: "bg-red-500/10",
            colorText: "text-red-500"
        }
    ];

    const columns = [
        { header: "Date", accessor: "dateOperation", render: (row) => new Date(row.dateOperation).toLocaleString('fr-FR') },
        { header: "Admin", accessor: "adminNomComplet" },
        {
            header: "Action", accessor: "operation", render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.operation === 'CREATION' ? 'bg-green-500/10 text-green-500' :
                    row.operation === 'SUPPRESSION' ? 'bg-red-500/10 text-red-500' :
                        'bg-blue-500/10 text-blue-500'
                }`}>
                    {row.operation}
                </span>
            )
        },
        { header: "Utilisateur Cible", accessor: "entiteNom" },
        {
            header: "Rôle",
            accessor: "entiteType", // Previously "Utilisateur", now mapped to Role
            render: (row) => (
                <span className={`px-2 py-0.5 rounded text-xs border ${row.entiteType === 'ADMIN' ? 'border-purple-500/30 text-purple-400' :
                    row.entiteType === 'COMMERCIAL' ? 'border-blue-500/30 text-blue-400' :
                        row.entiteType === 'CAISSIER' ? 'border-yellow-500/30 text-yellow-400' :
                            'border-zinc-700 text-zinc-400'
                }`}>
                    {row.entiteType}
                </span>
            )
        }
    ];

    const operationOptions = [
        { value: 'CREATION', label: 'Création' },
        { value: 'MODIFICATION', label: 'Modification' },
        { value: 'SUPPRESSION', label: 'Suppression' },
        { value: 'ACTIVATION', label: 'Activation' },
        { value: 'DESACTIVATION', label: 'Désactivation' }
    ];

    return (
        <HistoriqueTable
            title="Historique Utilisateurs"
            icon={Users}
            data={data}
            columns={columns}
            isLoading={isLoading}
            stats={stats}
            filters={
                <>
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        <input
                            type="datetime-local"
                            className="bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none w-32 md:w-auto"
                            value={filters.start}
                            onChange={(e) => setFilters(prev => ({ ...prev, start: e.target.value }))}
                        />
                        <span className="text-zinc-600">-</span>
                        <input
                            type="datetime-local"
                            className="bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none w-32 md:w-auto"
                            value={filters.end}
                            onChange={(e) => setFilters(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>

                    <MultiSelectFilter
                        options={operationOptions}
                        selectedValues={filters.operations}
                        onChange={(vals) => setFilters(prev => ({ ...prev, operations: vals }))}
                        placeholder="Opérations"
                    />

                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Rechercher (Admin)..."
                            className="bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none w-40"
                            value={filters.search}
                            onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
                        />
                    </div>
                </>
            }
        />
    );
}
