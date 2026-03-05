import React, { useState } from 'react';
import { usePiTool } from '../context/PiToolContext';
import VariableList from './VariableList';
import DimensionList from './DimensionList';
import AddDropdown from './AddDropdown';


function listTitle(title: string) {
    return (
        <div className="flex flex-row justify-start items-center bg-slate-300 dark:bg-zinc-600 border-b-2 border-gray-400 dark:border-zinc-500">
            <h1 className="flex text-lg font-bold px-4 text-gray-700 dark:text-zinc-200">{title}</h1>
        </div>
    )
}


export default function MainPanel() {
    const { variables, dimensions, 
        addVariable, editVariable, editVariableMany, 
        removeVariable, addDimension, editDimension, removeDimension,
        reorderVariables 
    } = usePiTool();

    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [topHeight, setTopHeight] = useState(0.5);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState<number | null>(null);
    const [deleteAttempt, setDeleteAttempt] = useState<{ dimId: number, affectedVarIds: number[] } | null>(null);
    
    // Helper to check if a dimension is used in a variable
    const getVariablesUsingDimension = (dimIdx: number) => {
    return variables
        .filter(v => v.exponents[dimIdx] !== 0)
        .map(v => v.id); // Return variable IDs that use this dimension index
    };

    // Handler for attempting to delete a dimension
    const handleRemoveDimension = (dimId: number) => {
        const dimIdx = dimensions.findIndex(d => d.id === dimId); // Get the index!
        const affectedVarIds = getVariablesUsingDimension(dimIdx);
        if (affectedVarIds.length > 0) {
            setDeleteAttempt({ dimId, affectedVarIds });
        } else {
            removeDimension(dimId);
        }
    }

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

    // Mouse up handler to stop dragging
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
        <div className="flex flex-col h-full gap-0 rounded-2xl">

            <div className="flex flex-row justify-start items-center bg-slate-500 dark:bg-zinc-800 gap-2 px-2 py-2 border-b-2 border-gray-300 dark:border-zinc-500 relative rounded-t-xl">
                <button
                    className={`font-extrabold text-2xl text-white 
                        px-3 pb-3 pt-2 rounded-lg hover:bg-slate-700 dark:hover:bg-zinc-700
                        ${showAddDropdown ? "bg-slate-600 dark:bg-zinc-700" : "bg-slate-500 dark:bg-zinc-600"}`}
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
            <div id="main-panel-container" className="flex flex-col h-full gap-0 bg-slate-100 dark:bg-zinc-700 h-full rounded-b-xl">
                <div style = {{height: `${topHeight* 100}%`}} className="flex flex-col border-b-2 border-gray-400 dark:border-zinc-500">
                    {listTitle("Dimensions")}
                    <div className="flex flex-col h-full overflow-auto w-full">
                        <DimensionList
                            dimensions={dimensions}
                            onEdit={editDimension}
                            onRemove={handleRemoveDimension}
                            deleteAttempt={deleteAttempt}
                            onCancelDelete={() => setDeleteAttempt(null)}
                            variables={variables}
                        />
                    </div>
                </div>
                <div
                    className="relative h-2 border-b-2 border-gray-400 dark:border-zinc-500 bg-slate-500 dark:bg-zinc-800 items-center justify-center cursor-row-resize"
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
                >
                    <div className="w-full h-full text-white absolute -top-3 left-0 flex items-center justify-center text-3xl">...</div>
                </div>
                <div className="flex flex-col flex-1 min-h-0">
                    {listTitle("Variables")}
                    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto h-full">
                        <VariableList
                            dimensions={dimensions}
                            variables={variables}
                            onEdit={editVariable}
                            onEditMany={editVariableMany}
                            onRemove={removeVariable}
                            onReorder={reorderVariables}
                            affectedVarIds={deleteAttempt ? deleteAttempt.affectedVarIds : []}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}