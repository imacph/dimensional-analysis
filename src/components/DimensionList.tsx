import type { Dimension,Variable } from '../lib/model/types';
import SymbolDropdown from './SymbolDropdown';
import AutocompleteInput from './AutocompleteInput';
import dimensionPresets from '../lib/data/dimensions.json';
type DimensionListProps = {
    dimensions: Dimension[];
    onEdit: (id: Dimension["id"], field: keyof Dimension, value: any) => void;
    onRemove: (id: Dimension["id"]) => void;
    deleteAttempt?: { dimId: number, affectedVarIds: number[] } | null;
    onCancelDelete?: () => void;
    variables?: Variable[];
};

const fundamentalUnits = dimensionPresets.find(c => c.category === "Fundamental Units")?.contents ?? [];


export default function DimensionList({ dimensions, onEdit, onRemove, deleteAttempt, onCancelDelete, variables }: DimensionListProps) {
    return (
        <ul className="flex flex-col h-full w-max min-w-full">
            {deleteAttempt && (
                <li className="flex flex-none flex-row justify-between bg-red-200 text-red-800 p-2 border-b-2 border-gray-300 gap-1 min-w-full w-max">
                    <div className="flex flex-col">
                        <strong>Cannot delete {dimensions?.find(d => d.id === deleteAttempt.dimId)?.name || `dimension ${deleteAttempt.dimId}`}</strong> It is used by the following variable{deleteAttempt.affectedVarIds.length > 1 ? 's' : ''}:
                        <ul>
                            {deleteAttempt.affectedVarIds.map(id => {
                                const variable = variables?.find(v => v.id === id);
                                return <li key={id}>{variable ? `• ${variable.name}` : `Variable ${id}`}</li>;
                            })}
                        </ul>
                    </div>
                    <button className="flex text-gray-500 px-2 py-1 rounded w-min mt-2 ml-2 text-2xl hover:text-gray-900" onClick={onCancelDelete}>
                        ×
                    </button>
                </li>
            )}
            
            {dimensions.filter(d => d.isVisible).map(d => (
                <li key={d.id} className="flex flex-none flex-row min-w-full items-center justify-between h-14 bg-white border-b-2 border-gray-300 px-2 gap-4">
                    <div className="flex flex-row items-center justify-start gap-1 h-full w-full">
                        <div className="flex-shrink-0 min-w-[6em]">
                            <AutocompleteInput
                                //className="flex font-semibold bg-transparent focus:border rounded p-1 border-gray-300 focus:outline-none placeholder:text-gray-400"
                                value={d.name}
                                onChange={e => onEdit(d.id, "name", e)}
                                placeholder="Label"
                                suggestions={fundamentalUnits}
                            />
                        </div>
                        <div className="flex-shrink-0 min-w-[6em] items-center flex h-full">
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