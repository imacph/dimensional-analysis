import type { Variable, Dimension } from '../lib/model/types';
import VariableListElement from './VariableListElement';

type VariableListProps = {
    variables: Variable[];
    dimensions: Dimension[];
    onEdit: (id: Variable["id"], field: keyof Variable, value: any) => void;
    onEditMany: (id: Variable["id"], updates: Partial<Variable>) => void;
    onRemove: (id: Variable["id"]) => void;
    affectedVarIds?: number[]; // Optional prop to highlight variables affected by a dimension deletion
};

export default function VariableList({ variables, dimensions, onEdit, onEditMany, onRemove, affectedVarIds }: VariableListProps) {
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
                    highlight={affectedVarIds?.includes(v.id) ?? false}
                />
            ))}
        </ul>
    );
}


