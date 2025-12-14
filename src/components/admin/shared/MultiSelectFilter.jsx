import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function MultiSelectFilter({ options, selectedValues = [], onChange, placeholder = "Sélectionner..." }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (value) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter(v => v !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none hover:bg-zinc-800 transition-colors"
            >
                <span className="truncate max-w-[150px]">
                    {selectedValues.length === 0 ? placeholder : `${selectedValues.length} sélectionné(s)`}
                </span>
                <ChevronDown className="w-4 h-4 text-zinc-500" />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-56 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-1 animate-in fade-in zoom-in-95 duration-100">
                    {options.map((option) => {
                        const isSelected = selectedValues.includes(option.value);
                        return (
                            <div
                                key={option.value}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleOption(option.value);
                                }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${isSelected
                                    ? 'bg-red-500/10 text-red-500'
                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                }`}
                            >
                                <div className={`w-4 h-4 border rounded items-center justify-center flex ${isSelected ? 'bg-red-500 border-red-500' : 'border-zinc-700'
                                }`}>
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span>{option.label}</span>
                            </div>
                        );
                    })}
                    {selectedValues.length > 0 && (
                        <div
                            onClick={() => onChange([])}
                            className="mt-1 pt-2 border-t border-zinc-800 text-xs text-center text-zinc-500 hover:text-white cursor-pointer py-1"
                        >
                            Tout effacer
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
