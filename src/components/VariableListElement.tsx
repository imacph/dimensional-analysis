import type { Variable, Dimension } from '../lib/model/types';
import { useState } from 'react';
import VariableDimensionDropdown from './VariableDimensionDropdown';
import SymbolDropdown from './SymbolDropdown';
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
        <li className={`flex flex-col border-b-2 min-w-full border-gray-300 px-2 ${highlight ? 'bg-red-100' : 'bg-white'}`}>
            <div className="flex flex-row items-center justify-between h-12">
                <div className="flex items-center gap-2">
                    <input
                        className="font-semibold bg-transparent focus:border rounded-lg p-1 border-gray-300 focus:outline-none"
                        value={variable.name}
                        onChange={handleNameChange}
                    />
                    <SymbolDropdown
                        value={variable.symbol}
                        onChange={handleSymbolChange}
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        className="px-2 py-1 rounded bg-slate-300 hover:bg-slate-400"
                        onClick={() => setExpanded(e => !e)}
                    >
                        {expanded ? '▲' : '▼'}
                    </button>
                    <button
                        className="px-2 py-1 rounded bg-red-200 hover:bg-red-400"
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
        </li>
    );
}