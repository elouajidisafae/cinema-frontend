import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../api/admin.api';
import HistoriqueTable from '../../../components/admin/shared/HistoriqueTable';
import MultiSelectFilter from '../../../components/admin/shared/MultiSelectFilter';
import { Ticket, Calendar, Search, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function HistoriqueReservations() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statsData, setStatsData] = useState({ VALIDEE: 0, EN_ATTENTE: 0, ANNULEE: 0 });
    const [filters, setFilters] = useState({
        search: '',
        statuses: [],
        start: '',
        end: ''
    });

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.statuses && filters.statuses.length > 0) {
                params.statuses = filters.statuses.join(',');
            }
            if (filters.start) params.start = new Date(filters.start).toISOString();
            if (filters.end) params.end = new Date(filters.end).toISOString();

            const response = await adminApi.getFilteredReservations(params);
            setData(response.data);
        } catch (error) {
            console.error("Erreur chargement:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await adminApi.getGlobalReservationStats();
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
        { label: "Validées", value: statsData.VALIDEE || 0, icon: CheckCircle, colorBg: "bg-green-500/10", colorText: "text-green-500" },
        { label: "En Attente", value: statsData.EN_ATTENTE || 0, icon: Clock, colorBg: "bg-yellow-500/10", colorText: "text-yellow-500" },
        { label: "Annulées", value: statsData.ANNULEE || 0, icon: XCircle, colorBg: "bg-red-500/10", colorText: "text-red-500" },
    ];

    const columns = [
        { header: "Date", accessor: "dateOperation", render: (row) => new Date(row.dateOperation).toLocaleString('fr-FR') },
        { header: "Client", accessor: "adminNomComplet" }, // Used mapped adminNomComplet for Client Name
        {
            header: "Statut", accessor: "operation", render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.operation === 'VALIDEE' ? 'bg-green-500/10 text-green-500' :
                    row.operation === 'ANNULEE' ? 'bg-red-500/10 text-red-500' :
                        'bg-yellow-500/10 text-yellow-500'
                }`}>
                    {row.operation}
                </span>
            )
        },
        { header: "Détail Réservation", accessor: "entiteNom" },
    ];

    return (
        <HistoriqueTable
            title="Historique Réservations"
            icon={Ticket}
            data={data}
            columns={columns}
            isLoading={isLoading}
            stats={stats}
            filters={
                <>
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        <input type="datetime-local" className="bg-transparent text-sm text-white focus:outline-none w-32 md:w-auto" value={filters.start} onChange={(e) => setFilters(p => ({ ...p, start: e.target.value }))} />
                        <span className="text-zinc-600">-</span>
                        <input type="datetime-local" className="bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none w-32 md:w-auto" value={filters.end} onChange={(e) => setFilters(p => ({ ...p, end: e.target.value }))} />
                    </div>
                    <MultiSelectFilter
                        options={[
                            { value: 'VALIDEE', label: 'Validée' },
                            { value: 'EN_ATTENTE', label: 'En attente' },
                            { value: 'ANNULEE', label: 'Annulée' },
                            { value: 'REFUSEE', label: 'Refusée' }
                        ]}
                        selectedValues={filters.statuses}
                        onChange={(vals) => setFilters(prev => ({ ...prev, statuses: vals }))}
                        placeholder="Statuts"
                    />
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Rechercher (Client)..."
                            className="bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none w-40"
                            value={filters.search || ''}
                            onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
                        />
                    </div>
                </>
            }
        />
    );
}
