import type { Dimension, Variable } from '../lib/model/types';



type VariableDimensionDropdownProps = {
    variable: Variable;
    dimensions: Dimension[];
    onEditMany: (v: Variable["id"], updates: Partial<Variable>) => void;
};

export default function VariableDimensionDropdown({ variable, dimensions, onEditMany }: VariableDimensionDropdownProps) {
    // Edit exponent inline
    const handleExponentChange = (expIdx: number, newExp: string | number) => {
        const newExps = [...variable.exponents];
        newExps[expIdx] = newExp === "" ? 0 : Number(newExp);
        onEditMany(variable.id, { exponents: newExps });
    };

    return (
        <div className="px-2 py-1 rounded mt-1">
            <ul>
                {dimensions
                    .map((dim, fullIdx) => ({ dim, fullIdx }))
                    .filter(({ dim }) => dim.isVisible)
                    .map(({ dim, fullIdx }) => (
                        <li key={dim.id} className="flex items-center gap-2 py-1">
                            <span className="w-24">{dim.name}</span>
                            <input
                                type="number"
                                className="w-20 px-1 border rounded"
                                value={variable.exponents[fullIdx] ?? 0}
                                onChange={e => handleExponentChange(fullIdx, e.target.value)}
                                placeholder="Exponent"
                            />
                        </li>
                    ))}
            </ul>
        </div>
    );
}