import type { Variable, Dimension } from '../lib/model/types';
import VariableListElement from './VariableListElement';

type VariableListProps = {
    variables: Variable[];
    dimensions: Dimension[];
    onEdit: (id: Variable["id"], field: keyof Variable, value: any) => void;
    onEditMany: (id: Variable["id"], updates: Partial<Variable>) => void;
    onRemove: (id: Variable["id"]) => void;
};

export default function VariableList({ variables, dimensions, onEdit, onEditMany, onRemove }: VariableListProps) {
    return (
        <ul className="flex flex-col h-full">
            {variables.map(v => (
                <VariableListElement
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


