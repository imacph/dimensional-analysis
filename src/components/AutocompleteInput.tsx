import { useState } from 'react';

type Suggestion = {
    label: string;
    symbol?: { value: string; latex?: string };
    dimensions?: number[];
};

type AutocompleteInputProps = {
    value: string;
    onChange: (value: string) => void;
    suggestions: Suggestion[];
    onSelectSuggestion?: (suggestion: Suggestion) => void;
    placeholder?: string;
};

export default function AutocompleteInput({
    value,
    onChange,
    suggestions,
    onSelectSuggestion,
    placeholder
}: AutocompleteInputProps) {
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filtered = showSuggestions
    ? (value
        ? suggestions.filter(s => s.label.toLowerCase().includes(value.toLowerCase()))
        : suggestions)
    : [];

    return (
        <div className="relative w-12 sm:w-20 md:w-28 lg:w-40 lg:text-lg md:text-md sm:text-sm text-xs">
            <input
                value={value}
                onChange={e => {
                    onChange(e.target.value);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                placeholder={placeholder}
                className="border rounded p-1 w-full bg-white dark:bg-zinc-600 text-black dark:text-white border-0"
            />
            {showSuggestions && filtered.length > 0 && (
                <ul className="absolute bg-white dark:bg-zinc-700 border-0 rounded shadow z-10 w-full max-h-40 overflow-auto">
                    {filtered.map(s => (
                        <li
                            key={s.label}
                            className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-zinc-600 cursor-pointer dark:text-zinc-200"
                            onMouseDown={() => {
                                onChange(s.label);
                                setShowSuggestions(false);
                                onSelectSuggestion?.(s);
                            }}
                        >
                            {s.label} {s.symbol?.value ? `(${s.symbol.value})` : ""}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}