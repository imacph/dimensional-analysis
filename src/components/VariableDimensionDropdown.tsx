import type { Dimension, Variable } from '../lib/model/types';
import { useState } from 'react';


type VariableDimensionDropdownProps = {
    variable: Variable;
    dimensions: Dimension[];
    onEditMany: (v: Variable["id"], updates: Partial<Variable>) => void;
};

export default function VariableDimensionDropdown({ variable, dimensions, onEditMany }: VariableDimensionDropdownProps) {
    // Edit exponent inline
    const handleExponentChange = (dimIdx: number, newExp: string | number) => {
        const newExps = [...variable.exponents];
        newExps[dimIdx] = newExp === "" ? 0 : Number(newExp);
        onEditMany(variable.id, { exponents: newExps });
    };

    return (
        <div className="px-2 py-1 rounded mt-1">
            <ul>
                {dimensions.filter(d => d.isVisible).map((dim, idx) => (
                    <li key={String(dim.id)} className="flex items-center gap-2 py-1">
                        <span className="w-24">{dim.name}</span>
                        <input
                            type="number"
                            className="w-20 px-1 border rounded"
                            value={variable.exponents[idx] ?? ""}
                            onChange={e => handleExponentChange(idx, e.target.value)}
                            placeholder="Exponent"
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}