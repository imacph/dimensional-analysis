import type { Dimension } from '../lib/model/types';

type DimensionListProps = {
    dimensions: Dimension[];
    onEdit: (id: Dimension["id"], field: keyof Dimension, value: any) => void;
    onRemove: (id: Dimension["id"]) => void;
};

export default function DimensionList({ dimensions, onEdit, onRemove }: DimensionListProps) {
    return (
        <ul>
            {dimensions.map(d => (
                <li key={d.id}>
                    <input
                        value={d.name}
                        onChange={e => onEdit(d.id, "name", e.target.value)}
                    />
                    <input
                        value={d.symbol}
                        onChange={e => onEdit(d.id, "symbol", e.target.value)}
                    />
                    <button onClick={()=> onRemove(d.id)}>×</button>
                </li>
            ))}
        </ul>
    );
}