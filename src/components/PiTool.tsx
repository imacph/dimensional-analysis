import MainPanel from "./MainPanel";
import { useCrudArray } from '../hooks/useCrudArray';
import type { Variable, Dimension } from '../lib/model/types';
import { PiToolContext } from '../context/PiToolContext';
import ResultsPanel from "./ResultsPanel";



export default function PiTool() {
    const {
        items: variables,
        add: addVariableOrig,
        edit: _editVariable,
        editMany: _editVariableMany,
        remove: removeVariable,
        setItems: setVariables
    } = useCrudArray<Variable>([]);

    // Debug wrapper for addVariable
    const addVariable = (v: Omit<Variable, "id">) => {
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

    // Reorder handler for drag-and-drop
    const reorderVariables = (newOrder: Variable[]) => {
        setVariables(newOrder);
    };

    // Dimension CRUDD
    const {
        items: dimensions,
        add: addDimension,
        edit: editDimension,
        remove: removeDimension,
    } = useCrudArray<Dimension>([]);

    return (<PiToolContext.Provider value={{
        variables, dimensions,
        addVariable, editVariable, editVariableMany, removeVariable,
        addDimension, editDimension, removeDimension, reorderVariables
    }}>
        <div className="grid grid-cols-10 gap-2 w-full h-full">
            <div className="col-span-7 h-full">
                <ResultsPanel />
            </div>
            <div className="col-span-3 flex flex-col gap-4 border-2 rounded-2xl border-gray-300 h-full w-full">
                <MainPanel />
            </div>
        </div>
    </PiToolContext.Provider>);
}
