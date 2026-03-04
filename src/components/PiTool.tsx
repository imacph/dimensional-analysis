import MainPanel from "./MainPanel";
import { useCrudArray } from '../hooks/useCrudArray';
import type { Variable, Dimension } from '../lib/model/types';
import { PiToolContext } from '../context/PiToolContext';
import ResultsPanel from "./ResultsPanel";

import dimensionPresets from '../lib/data/dimensions.json';
import { useEffect } from "react";





export default function PiTool() {

    const fundamentalUnits = dimensionPresets.find(c => c.category === "Fundamental Units")?.contents ?? [];

    const initialDimensions: Dimension[] = fundamentalUnits.map((unit, index) => ({
        id: index,
        name: unit.label,
        symbol: unit.symbols?.[0] ?? "",
        isFundamental: true,
        isVisible: false, // Start with fundamental dimensions hidden by default
    }));


    const {
        items: variables,
        add: _addVariable,
        edit: _editVariable,
        editMany: _editVariableMany,
        remove: removeVariable,
        setItems: setVariables
    } = useCrudArray<Variable>([]);

    // Debug wrapper for addVariable
    const addVariable = (v: Omit<Variable, "id">) => {
        _addVariable({
            ...v,
            exponents: Array(dimensions.length).fill(0),
        });
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
        edit: _editDimension,
        remove: _removeDimension,
    } = useCrudArray<Dimension>(initialDimensions);
    


    const editDimension = (id: Dimension["id"], field: keyof Dimension, value: any) => {
        if (field === "name") {
            // Find matching fundamental in the current dimensions list
            const matchingFundamental = dimensions.find(
                d => d.isFundamental && d.name === value
            );
            if (matchingFundamental && !matchingFundamental.isVisible) {
                
                _editDimension(matchingFundamental.id, "isVisible", true);
                removeDimension(id);
                return;
            }
        }
        _editDimension(id, field, value);
    };

    const removeDimension = (id: Dimension["id"]) => {
        // if it's a fundamental, just hide it instead of removing
        const dim = dimensions.find(d => d.id === id);
        if (dim?.isFundamental) {
            _editDimension(id, "isVisible", false);
            return;
        }

        _removeDimension(id);
    }
    
    useEffect(() => {
        setVariables(vars =>
            vars.map(v => ({
                ...v,
                exponents: dimensions.map((_, idx) => (v.exponents?.[idx] ?? 0))
            }))
        );
    }, [dimensions]);
    
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
