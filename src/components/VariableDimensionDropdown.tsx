import type { Dimension, Variable } from '../lib/model/types';
import { useState } from 'react';


type VariableDimensionDropdownProps = {
    variable: Variable;
    dimensions: Dimension[];
    onEditMany: (v: Variable["id"], updates: Partial<Variable>) => void;
};

export default function VariableDimensionDropdown({ variable, dimensions, onEditMany }: VariableDimensionDropdownProps) {
    const [addDimId, setAddDimId] = useState<number>(NaN);
    const [showAddDropdown, setShowAddDropdown] = useState(false);

    // add selected dimension to variable (store only ID)
    const handleAddDimension = () => {
        console.log('handleAddDimension called', { addDimId, variable });
        if (isNaN(addDimId)) return;
        const newDims = [...(variable.dimensions ?? []), addDimId];
        const newExps = [...(variable.dimensionExponents ?? []), 1];
        console.log('Updating variable', { newDims, newExps });
        onEditMany(variable.id, { dimensions: newDims, dimensionExponents: newExps });
        setAddDimId(NaN);
    };

    // remove dimension from variable
    const handleRemoveDimension = (dimIdx: number) => {
        const newDims = [...(variable.dimensions ?? [])];
        const newExps = [...(variable.dimensionExponents ?? [])];
        newDims.splice(dimIdx, 1);
        newExps.splice(dimIdx, 1);
        onEditMany(variable.id, { dimensions: newDims, dimensionExponents: newExps });
    };

    // Edit exponent inline
    const handleExponentChange = (dimIdx: number, newExp: string | number) => {
        const newExps = [...(variable.dimensionExponents ?? [])];
        newExps[dimIdx] = newExp === "" ? 0 : Number(newExp);
        onEditMany(variable.id, { dimensionExponents: newExps });
    };

    // Filter out dimensions already in the variable
    const availableDims = dimensions.filter(
        d => !(variable.dimensions ?? []).includes(d.id)
    );

    return (
        <div className="px-2 py-1 rounded mt-1">
            {/* Add dimension UX: button reveals styled dropdown list */}
            <div className="flex items-center gap-2 mb-2 relative">
                <button
                    className={`px-2 py-1 rounded bg-green-200 hover:bg-green-500
                    disabled:bg-gray-300 disabled:hover:bg-gray-300
                    ${showAddDropdown ? "bg-green-400" : ""}`}
                    onClick={() => setShowAddDropdown(d => !d)}
                    disabled={availableDims.length === 0}
                >＋ Add Dimension</button>
                {showAddDropdown && availableDims.length > 0 && (
                    <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 min-w-[160px]">
                        <ul>
                            {availableDims.map(dim => (
                                <li
                                    key={String(dim.id)}
                                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                    onClick={() => {
                                        onEditMany(variable.id, {
                                            dimensions: [...(variable.dimensions ?? []), dim.id],
                                            dimensionExponents: [...(variable.dimensionExponents ?? []), 1],
                                        });
                                        setShowAddDropdown(false);
                                    }}
                                >
                                    {dim.name}
                                </li>
                            ))}
                        </ul>
                    </div>
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
    );
}