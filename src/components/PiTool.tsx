
import React, { useState } from "react";
import type { Dimension, IdType, Variable } from "../lib/model/types";
import { useCrudArray } from "../hooks/useCrudArray";
import MainPanel from "./MainPanel";

export default function PiTool() {
    // Minimal variable CRUD state
    const {
        items: variables,
        add: handleAddVar,
        edit: handleEditVar,
        remove: handleRemoveVar
    } = useCrudArray<Variable>([]);

    // State for new variable form
    const [newVar, setNewVar] = useState({ name: "", symbol: "" });

    // Minimal dimension CRUD state 
    const {
        items: dimensions,
        add: handleAddDim,
        edit: handleEditDim,
        remove: handleRemoveDim
    } = useCrudArray<Dimension>([]);

    const [newDim, setNewDim] = useState({ name: "", symbol: "" });
    const [dimMode, setDimMode] = useState<"list" | "edit" | "add">("list");

    const [varMode, setVarMode] = useState<"list" | "edit" | "add" | "select-delete">("list");
    const [selectedVarId, setSelectedVarId] = useState<IdType | null>(null);

    // For templates, omit the id since it will be assigned on creation
    const variableTemplates: Omit<Variable, "id">[] = [
        { name: "Velocity", symbol: "v", 
            dimensions: [
                { id: 0, name: "Length", symbol: "L" },
                { id: 0, name: "Time", symbol: "T" }
            ],
            dimensionExponents: [1, -1]
         },
        { name: "Force", symbol: "F", 
            dimensions: [
                { id: 0, name: "Mass", symbol: "M" },
                { id: 0, name: "Length", symbol: "L" },
                { id: 0, name: "Time", symbol: "T" }
            ],
            dimensionExponents: [1, 1, -2]
        },
    ];

    const dimensionTemplates: Omit<Dimension, "id">[] = [
        { name: "Length", symbol: "L" },
        { name: "Time", symbol: "T" },
    ];

    const variable = variables.find(v => v.id === selectedVarId);

    const [selectedDimId, setSelectedDimId] = useState<IdType | "">("");
    const [newExponent, setNewExponent] = useState<number>(1);

    const handleAddDimToVar = () => {
        if (!variable || selectedDimId === "") return;
        const dimToAdd = dimensions.find(d => d.id === selectedDimId);
        if (!dimToAdd) return;
        const newDims = [...(variable.dimensions || []), dimToAdd];
        const newExponents = [...(variable.dimensionExponents || []), newExponent];
        handleEditVar(variable.id, "dimensions", newDims);
        handleEditVar(variable.id, "dimensionExponents", newExponents);
        setSelectedDimId("");
        setNewExponent(1);
    }

    return (
        <div className="grid grid-cols-10 gap-2 w-full h-full">
            <div className="col-span-7 p-4 h-full">
                <h2 className="text-xl lg:text-4xl font-bold mb-4">Results</h2>
                {/* Display results here */}
            </div>
            <div className="col-span-3 flex flex-col gap-4 border-2 rounded-lg border-gray-300 h-full w-full">
                <MainPanel />
            </div>
        </div>
    );
}
