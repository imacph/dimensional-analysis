import type { Variable, Dimension } from '../lib/model/types';
import VariableListElement from './VariableListElement';
import { useState } from 'react';
type VariableListProps = {
    variables: Variable[];
    dimensions: Dimension[];
    onEdit: (id: Variable["id"], field: keyof Variable, value: any) => void;
    onEditMany: (id: Variable["id"], updates: Partial<Variable>) => void;
    onRemove: (id: Variable["id"]) => void;
    affectedVarIds?: number[]; // Optional prop to highlight variables affected by a dimension deletion
};

export default function VariableList({ variables, dimensions, onEdit, onEditMany, onRemove, affectedVarIds }: VariableListProps) {
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

    function handleDragStart(idx: number) {
        setDraggedIdx(idx);
    }
    function handleDragOver(e: React.DragEvent<HTMLLIElement>, idx: number) {
        e.preventDefault();
        if (draggedIdx === null || draggedIdx === idx) return;
        const reordered = [...variables];
        const [moved] = reordered.splice(draggedIdx, 1);
        reordered.splice(idx, 0, moved);
        setDraggedIdx(idx);
    }
    return (
        <ul className="flex flex-col h-full w-max min-w-full">
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


