import type { Variable, Dimension } from '../lib/model/types';
import { useState } from 'react';
type VariableListProps = {
    variables: Variable[];
    dimensions: Dimension[];
    onEdit: (id: Variable["id"], field: keyof Variable, value: any) => void;
    onEditMany?: (id: Variable["id"], updates: Partial<Variable>) => void;
    onRemove: (id: Variable["id"]) => void;
};

export default function VariableList({ variables, dimensions, onEdit, onEditMany, onRemove }: VariableListProps) {
    return (
        <ul className="flex flex-col h-full">
            {variables.map(v => (
                <VariableDropdownItem
                    key={v.id}
                    variable={v}
                    dimensions={dimensions ?? []}
                    onEdit={onEdit}
                    onRemove={onRemove}
                    onEditMany={onEditMany}
                />
            ))}
        </ul>
    );
}

function VariableDropdownItem({ variable, dimensions, onEdit, onRemove, onEditMany }: {
    variable: Variable;
    dimensions: Dimension[];
    onEdit: (v: Variable["id"], field: keyof Variable, value: any) => void;
    onRemove: (v: Variable["id"]) => void;
    onEditMany?: (v: Variable["id"], updates: Partial<Variable>) => void;
}) {
    // Open dropdown by default for new variables (no dimensions)
    const [expanded, setExpanded] = useState((variable.dimensions ?? []).length === 0);
    const [addDimId, setAddDimId] = useState<number>(NaN);
    const [showAddDropdown, setShowAddDropdown] = useState(false);

    // add selected dimension to variable (store only ID)
    const handleAddDimension = () => {
        if (isNaN(addDimId)) return;
        const newDims = [...(variable.dimensions ?? []), addDimId];
        const newExps = [...(variable.dimensionExponents ?? []), 1];
        if (typeof onEditMany === "function") {
            onEditMany(variable.id, { dimensions: newDims, dimensionExponents: newExps });
        } else {
            onEdit(variable.id, "dimensions", newDims);
            onEdit(variable.id, "dimensionExponents", newExps);
        }
        setAddDimId(NaN);
    };

    // remove dimension from variable
    const handleRemoveDimension = (dimIdx: number) => {
        const newDims = [...(variable.dimensions ?? [])];
        const newExps = [...(variable.dimensionExponents ?? [])];
        newDims.splice(dimIdx, 1);
        newExps.splice(dimIdx, 1);
        if (typeof onEditMany === "function") {
            onEditMany(variable.id, { dimensions: newDims, dimensionExponents: newExps });
        } else {
            onEdit(variable.id, "dimensions", newDims);
            onEdit(variable.id, "dimensionExponents", newExps);
        }
    };

    // Edit exponent inline
    const handleExponentChange = (dimId: number, newExp: string | number) => {
        const newExps = [...(variable.dimensionExponents ?? [])];
        // Ensure value is a number
        newExps[dimId] = newExp === "" ? 0 : Number(newExp);
        onEdit(variable.id, "dimensionExponents", newExps);
    }

    // Edit variable name/symbol inline
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onEdit(variable.id, "name", e.target.value);
    };

    // Filter out dimensions already in the variable
    const availableDims = dimensions.filter(
        d => !(variable.dimensions ?? []).includes(d.id)
    );
    return (
        <li className="flex flex-col border-b px-2">
            <div className="flex items-center justify-between h-12">
                <input
                    className="font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-400"
                    value={variable.name}
                    onChange={handleNameChange}
                />
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
                <div className="bg-slate-100 px-2 py-1 rounded mt-1">
                    {/* Add dimension UX: single button reveals dropdown */}
                    <div className="flex items-center gap-2 mb-2">
                        <button
                            className="px-2 py-1 rounded bg-green-200 hover:bg-green-400"
                            onClick={() => setShowAddDropdown(d => !d)}
                            disabled={availableDims.length === 0}
                        >＋ Add Dimension</button>
                        {showAddDropdown && availableDims.length > 0 && (
                            <select
                                className="border rounded px-2 py-1"
                                value={isNaN(addDimId) ? "" : String(addDimId)}
                                onChange={e => setAddDimId(e.target.value === "" ? NaN : Number(e.target.value))}
                                style={{ minWidth: 120 }}
                            >
                                <option value="">Select dimension...</option>
                                {availableDims.map(dim => (
                                    <option key={String(dim.id)} value={String(dim.id)}>{dim.name}</option>
                                ))}
                            </select>
                        )}
                        {showAddDropdown && !isNaN(addDimId) && (
                            <button
                                className="px-2 py-1 rounded bg-blue-200 hover:bg-blue-400"
                                onClick={handleAddDimension}
                            >Add</button>
                        )}
                    </div>
                    {/* Assigned dimensions list */}
                    <ul>
                        {(variable.dimensions ?? []).map((dimId, idx) => {
                            const dimObj = dimensions.find(d => d.id === dimId);
                            return (
                                <li key={String(dimId)} className="flex items-center gap-2 py-1">
                                    <span className="w-24">{dimObj ? dimObj.name : `Dimension ${dimId}`}</span>
                                    <input
                                        type="number"
                                        className="w-20 px-1 border rounded"
                                        value={variable.dimensionExponents?.[idx] ?? ""}
                                        onChange={e => handleExponentChange(idx, e.target.value)}
                                        placeholder="Exponent"
                                    />
                                    <button
                                        className="px-2 py-1 rounded bg-red-100 hover:bg-red-300"
                                        onClick={() => handleRemoveDimension(idx)}
                                        title="Remove dimension"
                                    >×</button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </li>
    )
}


