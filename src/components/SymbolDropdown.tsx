import { useState, useRef, useEffect } from "react";
import symbolCategories from "../lib/data/symbols.json";
import ReactDOM from "react-dom";

type SymbolDropdownProps = {
    value: string;
    onChange: (symbol: string) => void;
};

export default function SymbolDropdown({ value, onChange }: SymbolDropdownProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null); // <-- added
    const [dropdownPos, setDropdownPos] = useState<{top: number, left: number, width: number}>({top: 0, left: 0, width: 0});

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            const target = e.target as Node;
            if (
                ref.current &&
                !ref.current.contains(target) &&
                (!dropdownRef.current || !dropdownRef.current.contains(target)) // <-- added
            ) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    useEffect(() => {
        if (open && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setDropdownPos({top: rect.top, left: rect.left, width: rect.width});
        }
    },[open]);

    const filteredCategories = symbolCategories.map(cat => ({
        ...cat,
        symbols: cat.symbols.filter(sym =>
            sym.value.toLowerCase().includes(search.toLowerCase()) ||
            sym.latex.toLowerCase().includes(search.toLowerCase())
        )
    })).filter(cat => cat.symbols.length > 0);

    const display = value
        ? symbolCategories.flatMap(c => c.symbols).find(s => s.value === value)?.value
        : "Select symbol...";

    return (
        <div className="flex w-full justify-end">
            <div ref={ref} className="relative flex-auto min-w-0 w-6 sm:w-8 md:w-12 lg:min-w-16 text-xs sm:text-sm md:text-md lg:text-lg whitespace-nowrap">
                <button
                    className="px-2 py-1 border rounded bg-slate-100 dark:bg-zinc-600 dark:text-zinc-100 text-left w-full border-0"
                    onClick={() => setOpen(o => !o)}
                >
                    <span className={`font-serif italic ${value ? "" : "text-gray-400"} flex`}>{display}</span>
                </button>
                {open && ReactDOM.createPortal(
                    <div
                        ref={dropdownRef}
                        className="bg-white border rounded shadow-lg z-50"
                        style={{
                            position: "fixed",
                            top: dropdownPos.top,
                            left: dropdownPos.left,
                            width: dropdownPos.width
                        }}
                    >
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search symbols..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full px-2 py-1 border-b bg-white dark:bg-zinc-600 text-black dark:text-white border-0 text-xs sm:text-sm md:text-md lg:text-lg"
                        />
                        <div className="max-h-48 overflow-y-auto">
                            {filteredCategories.length === 0 && (
                                <div className="px-2 py-1 text-gray-400">No symbols found</div>
                            )}
                            {filteredCategories.map(cat => (
                                <div key={cat.label}>
                                    <div className="px-2 py-1 font-bold dark:text-zinc-100 text-xs bg-gray-100 dark:bg-zinc-700">{cat.label}</div>
                                    {cat.symbols.map(sym => (
                                        <div
                                            key={sym.value}
                                            className="px-2 py-1 hover:bg-blue-100 dark:hover:bg-zinc-600 cursor-pointer bg-white dark:bg-zinc-700"
                                            onClick={() => {
                                                onChange(sym.value);
                                                setOpen(false);
                                                setSearch("");
                                            }}
                                        >
                                            <span className="font-serif italic dark:text-zinc-100">{sym.value}</span> <span className="text-gray-500 dark:text-zinc-400">{sym.latex}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </div>
    );
}