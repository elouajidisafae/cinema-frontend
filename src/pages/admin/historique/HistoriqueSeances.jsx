import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../api/admin.api';
import HistoriqueTable from '../../../components/admin/shared/HistoriqueTable';
import MultiSelectFilter from '../../../components/admin/shared/MultiSelectFilter';
import { PlayCircle, Calendar, Search, Check, Plus, Trash, User, Activity } from 'lucide-react';

export default function HistoriqueSeances() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statsData, setStatsData] = useState({ CREATION: 0, MODIFICATION: 0, SUPPRESSION: 0 });
    const [filters, setFilters] = useState({
        search: '',
        operations: [],
        start: '',
        end: ''
    });

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.operations && filters.operations.length > 0) {
                params.operations = filters.operations.join(',');
            }
            if (filters.start) params.start = filters.start;
            if (filters.end) params.end = filters.end;

            const response = await adminApi.getFilteredSeanceHistory(params);
            setData(response.data);
        } catch (error) {
            console.error("Erreur chargement historique:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await adminApi.getGlobalSeanceHistoryStats();
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
        { label: "Créations", value: statsData.CREATION || 0, icon: Plus, colorBg: "bg-green-500/10", colorText: "text-green-500" },
        { label: "Modifications", value: statsData.MODIFICATION || 0, icon: Check, colorBg: "bg-blue-500/10", colorText: "text-blue-500" },
        { label: "Suppressions", value: statsData.SUPPRESSION || 0, icon: Trash, colorBg: "bg-red-500/10", colorText: "text-red-500" },
    ];

    const columns = [
        {
            header: "Date Opération",
            accessor: "dateOperation",
            render: (row) => (
                <div className="flex items-center justify-start gap-3">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{new Date(row.dateOperation).toLocaleString('fr-FR')}</span>
                </div>
            )
        },
        {
            header: "Commercial",
            accessor: "adminNomComplet",
            render: (row) => (
                <div className="flex items-center justify-start gap-3">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-zinc-100">{row.adminNomComplet}</span>
                </div>
            )
        },
        {
            header: "Action",
            accessor: "operation",
            render: (row) => (
                <div className="flex items-center justify-start gap-2">
                    <Activity className={`w-4 h-4 ${row.operation === 'CREATION' ? 'text-green-400' :
                        row.operation === 'SUPPRESSION' ? 'text-red-400' : 'text-blue-400'
                    }`} />
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter border ${row.operation === 'CREATION' ? 'bg-green-500/5 text-green-500 border-green-500/20' :
                        row.operation === 'SUPPRESSION' ? 'bg-red-500/5 text-red-500 border-red-500/20' :
                            'bg-blue-500/5 text-blue-500 border-blue-500/20'
                    }`}>
                        {row.operation}
                    </span>
                </div>
            )
        },
        {
            header: "Séance",
            accessor: "entiteNom",
            align: 'right',
            render: (row) => (
                <div className="flex items-center justify-start gap-2">
                    <PlayCircle className="w-4 h-4 text-red-500" />
                    <span className="font-bold text-red-500">{row.entiteNom}</span>
                </div>
            )
        },
    ];

    return (
        <HistoriqueTable
            title="Historique Séances"
            icon={PlayCircle}
            data={data}
            columns={columns}
            isLoading={isLoading}
            stats={stats}
            pageName="HistoriqueSeances"
            exportEndpoint="/admin/historique/seances/export/excel"
            exportParams={{
                search: filters.search,
                operations: filters.operations.join(','),
                start: filters.start || undefined,
                end: filters.end || undefined
            }}
            filters={
                <>
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        <input type="datetime-local" className="bg-transparent text-sm text-white focus:outline-none w-32 md:w-auto" value={filters.start} onChange={(e) => setFilters(p => ({ ...p, start: e.target.value }))} />
                        <span className="text-zinc-600">-</span>
                        <input type="datetime-local" className="bg-transparent text-sm text-white focus:outline-none w-32 md:w-auto" value={filters.end} onChange={(e) => setFilters(p => ({ ...p, end: e.target.value }))} />
                    </div>
                    <MultiSelectFilter
                        options={[
                            { value: 'CREATION', label: 'Création' },
                            { value: 'MODIFICATION', label: 'Modification' },
                            { value: 'SUPPRESSION', label: 'Suppression' },
                            { value: 'ACTIVATION', label: 'Activation' },
                            { value: 'DESACTIVATION', label: 'Désactivation' }
                        ]}
                        selectedValues={filters.operations}
                        onChange={(vals) => setFilters(prev => ({ ...prev, operations: vals }))}
                        placeholder="Opérations"
                    />
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Rechercher (Commercial ou Séance)..."
                            className="bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none w-56"
                            value={filters.search || ''}
                            onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
                        />
                    </div>
                </>
            }
        />
    );
}
