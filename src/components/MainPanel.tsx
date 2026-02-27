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
            <div className="flex flex-col h-full gap-0 bg-slate-100">
                <div className="flex flex-col h-1/2 border-b-2 border-gray-300">
                    <div className="flex flex-row justify-start items-center bg-slate-300 border-b-2 border-gray-400">
                        <h1 className="flex text-lg font-bold px-4 text-gray-700">Dimensions</h1>
                    </div>
                    <DimensionList
                        dimensions={dimensions}
                        onEdit={editDimension}
                        onRemove={removeDimension}
                    />
                </div>
                
                <div className="flex flex-col">
                    <div className="flex flex-row justify-start items-center bg-slate-300 border-b-2 border-gray-400">
                        <h1 className="flex text-lg font-bold px-4 text-gray-700">Variables</h1>
                    </div>
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