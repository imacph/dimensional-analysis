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
        add: addVariable,
        edit: editVariable,
        remove: removeVariable,
    } = useCrudArray<Variable>([]);

    const {
        items: dimensions,
        add: addDimension,
        edit: editDimension,
        remove: removeDimension,
    } = useCrudArray<Dimension>([]);

    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [topHeight, setTopHeight] = useState(0.5);
    const [isDragging, setIsDragging] = useState(false);

    // Mouse move handler for resizing the panels
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const container = document.getElementById('main-panel-container');
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        const fraction = Math.min(Math.max(offsetY / rect.height, 0.1), 0.9); // Limit to 10%-90%
        setTopHeight(fraction);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
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
                    <DimensionList
                        dimensions={dimensions}
                        onEdit={editDimension}
                        onRemove={removeDimension}
                    />
                </div>
                <div className="flex h-3 border-b-2 border-gray-400 
                                bg-slate-500 items-center justify-center cursor-row-resize">
                    <div
                        className="flex cursor-row-resize h-1/3 w-1/4 bg-gray-200 rounded-lg"
                        onMouseDown={() => setIsDragging(true)}
                    >
                    </div>
                </div>
                <div className="flex flex-col">
                    {listTitle("Variables")}
                    <VariableList
                        variables={variables}
                        onEdit={editVariable}
                        onRemove={removeVariable}
                    />
                </div>
            </div>
        </div>
    )
}