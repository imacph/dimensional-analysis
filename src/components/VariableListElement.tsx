import type { Variable, Dimension } from '../lib/model/types';
import { useState } from 'react';
import VariableDimensionDropdown from './VariableDimensionDropdown';
import SymbolDropdown from './SymbolDropdown';
import dimensionPresets from '../lib/data/dimensions.json';
import AutocompleteInput from './AutocompleteInput';

const allPresets = dimensionPresets.flatMap(c => c.contents);
const fundamentalUnits = dimensionPresets.find(c => c.category === "Fundamental Units")?.contents ?? [];



type VariableListElementProps = {
    variable: Variable;
    dimensions: Dimension[];
    onEdit: (v: Variable["id"], field: keyof Variable, value: any) => void;
    onRemove: (v: Variable["id"]) => void;
    onEditMany: (v: Variable["id"], updates: Partial<Variable>) => void;
    highlight?: boolean; // Optional prop to highlight this variable (e.g., if affected by dimension deletion)
};

export default function VariableListElement({ variable, dimensions, onEdit, onRemove, onEditMany, highlight }: VariableListElementProps) {
    // Open dropdown by default for new variables (no dimensions)
    const [expanded, setExpanded] = useState((variable.dimensions ?? []).length === 0);

    // Sync expanded state if variable.dimensions changes (e.g., new variable gets its first dimension)
    // If you want to auto-collapse after adding a dimension, uncomment the effect below.
    // React.useEffect(() => {
    //     if ((variable.dimensions ?? []).length > 0) setExpanded(false);
    // }, [variable.dimensions]);

    // Edit variable name/symbol inline
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onEdit(variable.id, "name", e.target.value);
    };

    // Edit variable symbol inline
    const handleSymbolChange = (symbol: string) => {
        onEdit(variable.id, "symbol", symbol);
    }
    return (
        <div className={`flex flex-col border-b-2 min-w-full border-gray-300 px-2 ${highlight ? 'bg-red-100' : 'bg-white'}`}>
            <div className="flex flex-row items-center justify-between h-12 gap-1">
                <div className="flex items-center justify-start gap-2 w-full">
                    <button
                        className="px-1 py-1 text-gray-400 hover:text-gray-900"
                        onClick={() => setExpanded(e => !e)}
                    >
                        <span
                            className={`inline-block transition-all duration-200 ease-in-out transform ${
                                expanded ? "rotate-0 opacity-100" : "-rotate-90 opacity-100"
                            }`}
                        >
                            ▼
                        </span>
                    </button>
                    <AutocompleteInput
                        //className="flex flex-1 max-w-[8rem] font-semibold bg-transparent focus:border rounded-lg p-1 border-gray-300 focus:outline-none"
                        value={variable.name}
                        onChange={val => onEdit(variable.id, "name", val)}
                        placeholder='Label'
                        suggestions={allPresets}
                        onSelectSuggestion={preset=> {
                            onEditMany(variable.id, {
                                name: preset.label,
                                symbol: preset.symbol ?? variable.symbol,
                                dimensions: preset.dimensions ?? variable.dimensions,
                                dimensionExponents: preset.dimensions ? preset.dimensions.map(_ => 1) : variable.dimensionExponents
                            })
                        }}
                    />
                </div>
                <div className="flex gap-2 justify-end items-center">
                    <SymbolDropdown
                        value={variable.symbol}
                        onChange={handleSymbolChange}
                    />
                    <button
                        className="flex text-gray-500 rounded w-min text-2xl mx-2 hover:text-gray-900 mb-1"
                        onClick={() => onRemove(variable.id)}
                        title="Remove variable"
                    >
                        ×
                    </button>
                </div>
            </div>
            {expanded && (
                <VariableDimensionDropdown
                    variable={variable}
                    dimensions={dimensions}
                    onEditMany={onEditMany}
                />
            )}
        </div>
    );
}