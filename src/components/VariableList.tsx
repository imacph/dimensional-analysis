import type { Variable } from '../lib/model/types';

type VariableListProps = {
    variables: Variable[];
    onEdit: (id: Variable["id"], field: keyof Variable, value: any) => void;
    onRemove: (id: Variable["id"]) => void;
};

export default function VariableList({ variables, onEdit, onRemove }: VariableListProps) {
    return (
        <ul>
            {variables.map(v => (
                <li key={v.id}>
                    <input
                        value={v.name}
                        onChange={e => onEdit(v.id, "name", e.target.value)}
                    />
                    <input
                        value={v.symbol}
                        onChange={e => onEdit(v.id, "symbol", e.target.value)}
                    />
                    <button onClick={()=> onRemove(v.id)}>×</button>
                </li>
            ))}
        </ul>
    );
}