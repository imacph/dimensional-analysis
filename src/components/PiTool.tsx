import MainPanel from "./MainPanel";
import { useCrudArray } from '../hooks/useCrudArray';
import type { Variable, Dimension } from '../lib/model/types';
import { PiToolContext } from '../context/PiToolContext';


export default function PiTool() {
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

    return (<PiToolContext.Provider value={{
        variables, dimensions,
        addVariable, editVariable, editVariableMany, removeVariable,
        addDimension, editDimension, removeDimension
    }}>
        <div className="grid grid-cols-10 gap-2 w-full h-full">
            <div className="col-span-7 p-4 h-full">
                <h2 className="text-xl lg:text-4xl font-bold mb-4">Results</h2>
                {/* Display results here */}
            </div>
            <div className="col-span-3 flex flex-col gap-4 border-2 rounded-2xl border-gray-300 h-full w-full">
                <MainPanel 
                    variables={variables}
                    dimensions={dimensions}
                    addVariable={addVariable}
                    editVariable={editVariable}
                    editVariableMany={editVariableMany}
                    removeVariable={removeVariable}
                    addDimension={addDimension}
                    editDimension={editDimension}
                    removeDimension={removeDimension}
                />
            </div>
        </div>
    </PiToolContext.Provider>);
}
