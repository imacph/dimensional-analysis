import React, { useState } from 'react';
import { useCrudArray } from '../hooks/useCrudArray';
import type { Variable, Dimension } from '../lib/model/types';
import VariableList from './VariableList';
import DimensionList from './DimensionList';
import AddDropdown from './AddDropdown';

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

    return (
        <div className="flex flex-col w-full h-full gap-2 bg-slate-200">

            <div className="flex flex-row justify-start items-center bg-slate-500 gap-2 px-4 py-2 border-b-2 border-gray-300 relative">
                <button
                    className={`font-extrabold text-2xl text-white 
                        px-3 pb-3 pt-2 rounded hover:bg-slate-700 
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
            
            <div className="flex">
                <h1 className="text-2xl font-bold px-4 text-gray-700">Dimensions</h1>
                <DimensionList
                    dimensions={dimensions}
                    onEdit={editDimension}
                    onRemove={removeDimension}
                />
            </div>
            
            <div className="flex">
                <h1 className="text-2xl font-bold px-4 text-gray-700">Variables</h1>
                <VariableList
                    variables={variables}
                    onEdit={editVariable}
                    onRemove={removeVariable}
                />
            </div>
        </div>
    )
}