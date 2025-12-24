import { useState, useEffect } from 'react';
import { Armchair, Monitor } from 'lucide-react';

export default function SeatSelector({
    nombreRangees = 10,
    siegesParRangee = 15,
    occupiedSeats = [],
    selectedSeats = [],
    onSeatToggle,
    maxSeats = 10
}) {
    const [hoveredSeat, setHoveredSeat] = useState(null);

    const isSeatOccupied = (rangee, numero) => {
        return occupiedSeats.some(seat => seat.rangee === rangee && seat.numero === numero);
    };

    const isSeatSelected = (rangee, numero) => {
        return selectedSeats.some(seat => seat.rangee === rangee && seat.numero === numero);
    };

    const handleSeatClick = (rangee, numero) => {
        if (isSeatOccupied(rangee, numero)) return;

        const isCurrentlySelected = isSeatSelected(rangee, numero);

        // If trying to select and already at max, don't allow
        if (!isCurrentlySelected && selectedSeats.length >= maxSeats) {
            return;
        }

        onSeatToggle({ rangee, numero });
    };

    const getSeatClass = (rangee, numero) => {
        if (isSeatOccupied(rangee, numero)) {
            return 'bg-zinc-900 border-zinc-800 cursor-not-allowed opacity-40';
        }
        if (isSeatSelected(rangee, numero)) {
            return 'bg-red-600 border-red-500 shadow-lg shadow-red-600/50 scale-110';
        }
        return 'bg-zinc-950 border-zinc-700 hover:border-red-500 hover:bg-zinc-900 cursor-pointer hover:scale-105';
    };

    // Calculate responsive seat size
    const seatSize = siegesParRangee > 12 ? 'w-7 h-7 md:w-8 md:h-8' : 'w-8 h-8 md:w-10 md:h-10';
    const seatGap = siegesParRangee > 12 ? 'gap-1.5' : 'gap-2';

    return (
        <div className="w-full">
            {/* Cinema Screen */}
            <div className="mb-8">
                <div className="relative w-full max-w-4xl mx-auto">
                    <div className="h-2 bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full shadow-lg shadow-red-600/30 mb-2"></div>
                    <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
                        <Monitor size={16} />
                        <span className="font-medium">ÉCRAN</span>
                    </div>
                </div>
            </div>

            {/* Seat Grid */}
            <div className="overflow-x-auto pb-4">
                <div className="inline-block min-w-full">
                    <div className="flex flex-col items-center gap-2 md:gap-3">
                        {Array.from({ length: nombreRangees }, (_, rowIndex) => {
                            const rangee = rowIndex + 1;
                            return (
                                <div key={rangee} className="flex items-center gap-3">
                                    {/* Row Label */}
                                    <div className="w-8 text-center text-zinc-500 font-bold text-sm">
                                        {String.fromCharCode(64 + rangee)}
                                    </div>

                                    {/* Seats */}
                                    <div className={`flex ${seatGap}`}>
                                        {Array.from({ length: siegesParRangee }, (_, seatIndex) => {
                                            const numero = seatIndex + 1;
                                            const isOccupied = isSeatOccupied(rangee, numero);
                                            const isSelected = isSeatSelected(rangee, numero);
                                            const isHovered = hoveredSeat?.rangee === rangee && hoveredSeat?.numero === numero;

                                            return (
                                                <button
                                                    key={numero}
                                                    onClick={() => handleSeatClick(rangee, numero)}
                                                    onMouseEnter={() => setHoveredSeat({ rangee, numero })}
                                                    onMouseLeave={() => setHoveredSeat(null)}
                                                    disabled={isOccupied}
                                                    className={`
                                                        ${seatSize}
                                                        ${getSeatClass(rangee, numero)}
                                                        border-2 rounded-lg
                                                        transition-all duration-200
                                                        flex items-center justify-center
                                                        relative group
                                                    `}
                                                    title={isOccupied ? 'Occupé' : `${String.fromCharCode(64 + rangee)}${numero}`}
                                                >
                                                    <Armchair
                                                        size={siegesParRangee > 12 ? 14 : 16}
                                                        className={`
                                                            ${isOccupied ? 'text-zinc-700' : isSelected ? 'text-white' : 'text-zinc-400'}
                                                            transition-colors
                                                        `}
                                                    />

                                                    {/* Tooltip on hover */}
                                                    {isHovered && !isOccupied && (
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                                            {String.fromCharCode(64 + rangee)}{numero}
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Row Label (Right) */}
                                    <div className="w-8 text-center text-zinc-500 font-bold text-sm">
                                        {String.fromCharCode(64 + rangee)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-zinc-950 border-2 border-zinc-700 rounded flex items-center justify-center">
                        <Armchair size={14} className="text-zinc-400" />
                    </div>
                    <span className="text-zinc-400">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-600 border-2 border-red-500 rounded flex items-center justify-center shadow-lg shadow-red-600/50">
                        <Armchair size={14} className="text-white" />
                    </div>
                    <span className="text-zinc-400">Sélectionné</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-zinc-900 border-2 border-zinc-800 rounded flex items-center justify-center opacity-40">
                        <Armchair size={14} className="text-zinc-700" />
                    </div>
                    <span className="text-zinc-400">Occupé</span>
                </div>
            </div>

            {/* Selection Info */}
            {selectedSeats.length > 0 && (
                <div className="mt-6 p-4 bg-red-600/10 border border-red-600/30 rounded-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-300 font-medium">
                            {selectedSeats.length} siège{selectedSeats.length > 1 ? 's' : ''} sélectionné{selectedSeats.length > 1 ? 's' : ''}
                        </span>
                        <span className="text-red-500 text-sm">
                            {selectedSeats.map(s => `${String.fromCharCode(64 + s.rangee)}${s.numero}`).join(', ')}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
