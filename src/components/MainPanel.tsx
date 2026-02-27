import React, { useState } from 'react';
import { useCrudArray } from '../hooks/useCrudArray';
import type { Variable, Dimension } from '../lib/model/types';
import VariableList from './VariableList';
import DimensionList from './DimensionList';
import AddDropdown from './AddDropdown';


function listTitle(title: string) {
    return (
        <div className="flex flex-row justify-start items-center bg-slate-300 border-b-2 border-gray-400">
            <h1 className="flex text-lg font-bold px-4 text-gray-700">{title}</h1>
        </div>
    )
}

export default function MainPanel() {

    const {
        items: variables,
        add: addVariableOrig,
        edit: _editVariable,
        editMany: _editVariableMany,
        remove: removeVariable,
    } = useCrudArray<Variable>([]);

    // Debug wrapper for addVariable
    const addVariable = (v: Omit<Variable, "id">) => {
        console.log('addVariable called', v);
        addVariableOrig(v);
    };

    // Custom edit handler to match useCrudArray signature
    const editVariable = (id: Variable["id"], field: keyof Variable, value: any) => {
        _editVariable(id, field, value);
    };

    // Batch edit handler for updating multiple fields
    const editVariableMany = (id: Variable["id"], updates: Partial<Variable>) => {
        _editVariableMany(id, updates);
    };

    const {
        items: dimensions,
        add: addDimension,
        edit: editDimension,
        remove: removeDimension,
    } = useCrudArray<Dimension>([]);

    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [topHeight, setTopHeight] = useState(0.5);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState<number | null>(null);

    // Mouse move handler for resizing the panels
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const container = document.getElementById('main-panel-container');
        if (!container) return;
        const rect = container.getBoundingClientRect();
        let offsetY = e.clientY - rect.top;
        if (dragOffset !== null) {
            offsetY -= dragOffset;
        }
        const fraction = Math.min(Math.max(offsetY / rect.height, 0.1), 0.9); // Limit to 10%-90%
        setTopHeight(fraction);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragOffset(null);
    };

    // Add event listeners for mouse move and mouse up when dragging
    React.useEffect(() => {
        if (!isDragging) return;

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // Change cursor when dragging and prevent selecting text
    React.useEffect(() => {
        if (isDragging) {
            document.body.style.cursor = "row-resize";
            document.body.style.userSelect = "none";
        } else {
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }
        // Cleanup on unmount or when isDragging changes
        return () => {
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [isDragging]);

    return (
        <div className="flex flex-col h-full gap-0 bg-slate-200 rounded-2xl">

            <div className="flex flex-row justify-start items-center bg-slate-500 gap-2 px-2 py-2 border-b-2 border-gray-300 relative rounded-t-xl">
                <button
                    className={`font-extrabold text-2xl text-white 
                        px-3 pb-3 pt-2 rounded-lg hover:bg-slate-700 
                        ${showAddDropdown ? "bg-slate-600" : "bg-slate-500"}`}
                    onClick={() => setShowAddDropdown((prev) => !prev)}
                >＋</button>
                {showAddDropdown && (
                    <AddDropdown
                        onAddVariable={addVariable}
                        onAddDimension={addDimension}
                        onClose={() => setShowAddDropdown(false)}
                    />
                )}
            </div>
            <div id="main-panel-container" className="flex flex-col h-full gap-0 bg-slate-100 h-full">
                <div style = {{height: `${topHeight* 100}%`}} className="flex flex-col border-b-2 border-gray-400">
                    {listTitle("Dimensions")}
                    <div className="flex flex-col h-full overflow-y-auto">
                        <DimensionList
                            dimensions={dimensions}
                            onEdit={editDimension}
                            onRemove={removeDimension}
                        />
                    </div>
                </div>
                <div
                    className="flex h-2 border-b-2 border-gray-400 bg-slate-500 items-center justify-center cursor-row-resize"
                    onMouseDown={e => {
                        const container = document.getElementById('main-panel-container');
                        if (container) {
                            const rect = container.getBoundingClientRect();
                            const offsetY = e.clientY - rect.top;
                            const panelHeight = rect.height * topHeight;
                            setDragOffset(offsetY - panelHeight);
                        } else {
                            setDragOffset(0);
                        }
                        setIsDragging(true);
                    }}
                ></div>
                <div className="flex flex-col flex-1 min-h-0">
                    {listTitle("Variables")}
                    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto h-full">
                        <VariableList
                            dimensions={dimensions}
                            variables={variables}
                            onEdit={editVariable}
                            onEditMany={editVariableMany}
                            onRemove={removeVariable}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}