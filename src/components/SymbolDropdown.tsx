import { useState, useRef, useEffect } from "react";
import symbolCategories from "../lib/data/symbols.json";

type SymbolDropdownProps = {
    value: string;
    onChange: (symbol: string) => void;
};

export default function SymbolDropdown({ value, onChange }: SymbolDropdownProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    // Filtered symbols
    const filteredCategories = symbolCategories.map(cat => ({
        ...cat,
        symbols: cat.symbols.filter(sym =>
            sym.value.toLowerCase().includes(search.toLowerCase()) ||
            sym.latex.toLowerCase().includes(search.toLowerCase())
        )
    })).filter(cat => cat.symbols.length > 0);

    // Find display value
    const display = value
        ? symbolCategories.flatMap(c => c.symbols).find(s => s.value === value)?.value
        : "Select symbol...";

    return (
        <div ref={ref} className="relative flex-initial min-w-0 w-32">
            <button
                className="px-2 py-1 border rounded bg-white text-left w-full"
                onClick={() => setOpen(o => !o)}
            >
                <span className={`font-serif italic ${value ? "" : "text-gray-400"}`} style={{ minWidth: "2em", display: "inline-block" }}>{display}</span>
            </button>
            {open && (
                <div className="absolute left-0 top-0 w-full bg-white border rounded shadow-lg z-10">
                    <input
                        type="text"
                        autoFocus
                        placeholder="Search symbols..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full px-2 py-1 border-b"
                    />
                    <div className="max-h-48 overflow-y-auto">
                        {filteredCategories.length === 0 && (
                            <div className="px-2 py-1 text-gray-400">No symbols found</div>
                        )}
                        {filteredCategories.map(cat => (
                            <div key={cat.label}>
                                <div className="px-2 py-1 font-bold text-xs bg-gray-100">{cat.label}</div>
                                {cat.symbols.map(sym => (
                                    <div
                                        key={sym.value}
                                        className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                                        onClick={() => {
                                            onChange(sym.value);
                                            setOpen(false);
                                            setSearch("");
                                        }}
                                    >
                                        <span className="font-serif italic">{sym.value}</span> <span className="text-gray-500">{sym.latex}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}