import { useState } from 'react';

type Suggestion = {
    label: string;
    symbols?: string[];
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
        <div className="relative">
            <input
                value={value}
                onChange={e => {
                    onChange(e.target.value);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                placeholder={placeholder}
                className="border rounded p-1 w-full"
            />
            {showSuggestions && filtered.length > 0 && (
                <ul className="absolute bg-white border rounded shadow z-10 w-full max-h-40 overflow-auto">
                    {filtered.map(s => (
                        <li
                            key={s.label}
                            className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                            onMouseDown={() => {
                                onChange(s.label);
                                setShowSuggestions(false);
                                onSelectSuggestion?.(s);
                            }}
                        >
                            {s.label} {s.symbols?.[0] ? `(${s.symbols[0]})` : ""}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}