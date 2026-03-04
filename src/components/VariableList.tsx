import type { Variable, Dimension } from '../lib/model/types';
import VariableListElement from './VariableListElement';
import { useState } from 'react';
type VariableListProps = {
    variables: Variable[];
    dimensions: Dimension[];
    onEdit: (id: Variable["id"], field: keyof Variable, value: any) => void;
    onEditMany: (id: Variable["id"], updates: Partial<Variable>) => void;
    onRemove: (id: Variable["id"]) => void;
    onReorder: (newOrder: Variable[]) => void;
    affectedVarIds?: number[]; // Optional prop to highlight variables affected by a dimension deletion
};

export default function VariableList({ variables, dimensions, onEdit, onEditMany, onRemove, onReorder, affectedVarIds }: VariableListProps) {
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

    function handleDragStart(idx: number) {
        console.log('Drag start', idx);
        setDraggedIdx(idx);
    }
    function handleDragOver(e: React.DragEvent<HTMLLIElement>, idx: number) {
        e.preventDefault();
        console.log('Drag over', idx, 'draggedIdx:', draggedIdx);
    }
    function handleDrop(e: React.DragEvent<HTMLLIElement>, idx: number) {
        e.preventDefault();
        console.log('Drop', idx, 'draggedIdx:', draggedIdx);
        if (draggedIdx === null || draggedIdx === idx) return;
        const reordered = [...variables];
        const [moved] = reordered.splice(draggedIdx, 1);
        reordered.splice(idx, 0, moved);
        setDraggedIdx(null);
        onReorder(reordered);
    }
    function handleDragEnd() {
        console.log('Drag end');
        setDraggedIdx(null);
    }

    return (
        <ul className="flex flex-col h-full w-max min-w-full">
            {variables.map((v, idx) => (
                <li
                    key={v.id}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={e => handleDragOver(e, idx)}
                    onDrop={e => handleDrop(e, idx)}
                    onDragEnd={handleDragEnd}
                    style={{
                        opacity: draggedIdx === idx ? 0.5 : 1,
                        cursor: 'move'
                    }}
                >
                    <VariableListElement
                        variable={v}
                        dimensions={dimensions ?? []}
                        onEdit={onEdit}
                        onRemove={onRemove}
                        onEditMany={onEditMany}
                        highlight={affectedVarIds?.includes(v.id) ?? false}
                    />
                </li>
            ))}
        </ul>
    );
}


