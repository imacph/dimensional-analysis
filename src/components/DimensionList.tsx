import type { Dimension } from '../lib/model/types';
import SymbolDropdown from './SymbolDropdown';
type DimensionListProps = {
    dimensions: Dimension[];
    onEdit: (id: Dimension["id"], field: keyof Dimension, value: any) => void;
    onRemove: (id: Dimension["id"]) => void;
};

export default function DimensionList({ dimensions, onEdit, onRemove }: DimensionListProps) {
    return (
        <ul className="flex flex-col h-full w-max min-w-full">
            {dimensions.map(d => (
                <li key={d.id} className="flex flex-row min-w-full items-center justify-between h-14 bg-white border-b-2 border-gray-300 px-2 gap-4">
                    <div className="flex flex-row items-center justify-start gap-1 w-full">
                        <div className="flex-shrink-0 min-w-[6em]">
                            <input
                                className="flex font-semibold bg-transparent focus:border rounded p-1 border-gray-300 focus:outline-none placeholder:text-gray-400"
                                value={d.name}
                                onChange={e => onEdit(d.id, "name", e.target.value)}
                                placeholder="Label"
                            />
                        </div>
                        <div className="flex-shrink-0 min-w-[6em]">
                            <SymbolDropdown
                                value={d.symbol}
                                onChange={symbol => onEdit(d.id, "symbol", symbol)}
                            />
                        </div>
                    </div>
                    <button className = "flex pr-2 pb-1 text-gray-400 hover:text-gray-900 text-2xl"
                     onClick={()=> onRemove(d.id)}>×</button>
                </li>
            ))}
        </ul>
    );
}