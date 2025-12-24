import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../api/admin.api';
import HistoriqueTable from '../../../components/admin/shared/HistoriqueTable';
import MultiSelectFilter from '../../../components/admin/shared/MultiSelectFilter';
import { Ticket, Calendar, Search, CheckCircle, Clock, XCircle, User, Film, Info } from 'lucide-react';

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
            if (filters.start) params.start = filters.start;
            if (filters.end) params.end = filters.end;

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
        {
            header: "Date Réservation",
            accessor: "dateOperation",
            render: (row) => (
                <div className="flex items-center justify-start gap-3">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{new Date(row.dateOperation).toLocaleString('fr-FR')}</span>
                </div>
            )
        },
        {
            header: "Client",
            accessor: "adminNomComplet",
            render: (row) => (
                <div className="flex items-center justify-start gap-3">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-zinc-100">{row.adminNomComplet}</span>
                </div>
            )
        },
        {
            header: "Film & Séance",
            accessor: "entiteNom",
            render: (row) => {
                // Formatting seance time
                const seanceDate = row.infoSupplementaire ? new Date(row.infoSupplementaire) : null;
                const formattedSeance = seanceDate
                    ? seanceDate.toLocaleString('fr-FR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                    })
                    : '';

                // Extracting film title (removing the "- X places" if present)
                const filmTitle = row.entiteNom.split(' - ')[0];

                return (
                    <div className="flex flex-col items-start gap-0.5">
                        <div className="flex items-center justify-start gap-2">
                            <Film className="w-4 h-4 text-red-500" />
                            <span className="font-bold text-red-500">{filmTitle}</span>
                        </div>
                        {formattedSeance && (
                            <span className="text-xs text-zinc-500">{formattedSeance}</span>
                        )}
                    </div>
                );
            }
        },
        {
            header: "Montant",
            accessor: "montant",
            align: 'center',
            render: (row) => (
                <span className="font-bold text-yellow-500">
                    {row.montant ? `${row.montant.toFixed(2)} Dh` : "0.00 Dh"}
                </span>
            )
        },
        {
            header: "Statut",
            accessor: "operation",
            align: 'right',
            render: (row) => (
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter border ${row.operation === 'VALIDEE'
                    ? 'bg-green-500/5 text-green-500 border-green-500/20' :
                    row.operation === 'ANNULEE'
                        ? 'bg-red-500/5 text-red-500 border-red-500/20' :
                        'bg-yellow-500/5 text-yellow-500 border-yellow-500/20'
                }`}>
                    {row.operation}
                </span>
            )
        },
    ];

    return (
        <HistoriqueTable
            title="Historique Réservations"
            icon={Ticket}
            data={data}
            columns={columns}
            isLoading={isLoading}
            stats={stats}
            pageName="HistoriqueReservations"
            exportEndpoint="/admin/historique/reservations/export/excel"
            exportParams={{
                search: filters.search,
                statuses: filters.statuses.join(','),
                start: filters.start || undefined,
                end: filters.end || undefined
            }}
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
                            { value: 'ANNULEE', label: 'Annulée' }
                        ]}
                        selectedValues={filters.statuses}
                        onChange={(vals) => setFilters(prev => ({ ...prev, statuses: vals }))}
                        placeholder="Statuts"
                    />
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Rechercher (Client ou Film)..."
                            className="bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none w-48"
                            value={filters.search || ''}
                            onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
                        />
                    </div>
                </>
            }
        />
    );
}
