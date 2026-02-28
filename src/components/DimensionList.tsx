import type { Dimension } from '../lib/model/types';
import SymbolDropdown from './SymbolDropdown';
type DimensionListProps = {
    dimensions: Dimension[];
    onEdit: (id: Dimension["id"], field: keyof Dimension, value: any) => void;
    onRemove: (id: Dimension["id"]) => void;
};

export default function DimensionList({ dimensions, onEdit, onRemove }: DimensionListProps) {
    return (
        <ul className="flex flex-col h-full">
            {dimensions.map(d => (
                <li key={d.id} className="flex flex-none flex-row items-center h-14 bg-white border-b-2 border-gray-300 px-2">
                    <input
                        value={d.name}
                        onChange={e => onEdit(d.id, "name", e.target.value)}
                    />
                    <SymbolDropdown
                        value={d.symbol}
                        onChange={symbol => onEdit(d.id, "symbol", symbol)}
                    />
                    <button onClick={()=> onRemove(d.id)}>×</button>
                </li>
            ))}
        </ul>
    );
}