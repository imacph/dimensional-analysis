
import React, { useState } from "react";

type Variable = {
    id: number;
    name: string;
    symbol: string;
    dimensions?: Dimension[];
    dimensionExponents?: number[];
};

type Dimension = {
    id: number;
    name: string;
    symbol: string;
}


type IdType = number | string;

function useCrudArray<T extends { id: IdType }>(initial: T[] = []) {
    const [items, setItems] = useState<T[]>(initial);

    const add = (item: Omit<T, "id">) => {
        setItems([...items, { ...item, id: Date.now() } as T]);
    };

    const edit = (id: IdType, field: keyof T, value: any) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const remove = (id: IdType) => {
        setItems(items.filter(i => i.id !== id));
    };

    return { items, add, edit, remove, setItems };
}

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

    const [varMode, setVarMode] = useState<"list" | "edit" | "add">("list");
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

    return (
        <div className="grid grid-cols-10 gap-2 w-full h-full">
            <div className="col-span-7 p-4 h-full">
                <h2 className="text-xl lg:text-4xl font-bold mb-4">Results</h2>
                {/* Display results here */}
            </div>
            <div className="col-span-3 flex flex-col gap-4 px-4 border-l-2 border-gray-300 h-full w-full">
                <div className="flex flex-col justify-center items-center gap-2">
                    <h2 className="text-xl lg:text-3xl font-bold mb-4 text-center">Dimensions</h2>
                    {/* Input fields for dimensions */}
                    {
                        dimMode === "list" ? (
                            <>
                            <div className="flex flex-row gap-2 mb-2 w-full justify-center">
                                <button className="flex flex-auto bg-slate-500 w-full hover:bg-slate-700 text-white font-bold py-1 px-3 rounded mb-4"
                                    onClick={() => setDimMode("edit")}
                                >Edit Dimensions ...</button>
                                <button
                                    className="flex flex-auto bg-slate-500 w-full hover:bg-slate-700 text-white font-bold py-1 px-3 rounded mb-4"
                                    onClick={() => setDimMode("add")}
                                >Add Dimension +</button>
                            </div>
                            <ul className="w-full">
                                {dimensions.length === 0 ? (
                                    <li className="text-center text-gray-500 w-full">No dimensions added</li>
                                ) : (
                                    dimensions.map(d => (
                                        <li key={d.id} className="flex flex-row justify-center items-center gap-2 mb-2 w-full">
                                            <span className="flex-1 text-left">{d.name}</span>
                                            <span className="w-16 text-right">{d.symbol}</span>
                                        </li>
                                    ))
                                )}
                            </ul>
                            </>
                        ) : dimMode === "edit" ? ( <>
                            <div className="flex flex-row gap-2 mb-2 w-full justify-center">
                                <button className="flex flex-auto bg-slate-500 w-full hover:bg-slate-700 text-white font-bold py-1 px-3 rounded mb-4"
                                    onClick={() => setDimMode("list")}
                                >List Dimensions ←</button>
                                <button
                                    className="flex flex-auto bg-slate-500 w-full hover:bg-slate-700 text-white font-bold py-1 px-3 rounded mb-4"
                                    onClick={() => setDimMode("add")}
                                >Add Dimension +</button>
                            </div>
                            <ul className="w-full">
                                {dimensions.length === 0 ? (
                                    <li className="text-center text-gray-500">No dimensions added</li>
                                ) : (
                                    dimensions.map(d => (
                                        <li key={d.id} className="flex flex-row items-center gap-2 mb-2">
                                            <input
                                                className="border rounded px-1 py-0.5 flex-1"
                                                value={d.name}
                                                onChange={e => handleEditDim(d.id, "name", e.target.value)}
                                                placeholder="Name"
                                            />
                                            <input
                                                className="border rounded px-1 py-0.5 w-16"
                                                value={d.symbol}
                                                onChange={e => handleEditDim(d.id, "symbol", e.target.value)}
                                                placeholder="Symbol"
                                            />
                                            <button
                                                className="text-red-600 font-bold px-2"
                                                onClick={() => handleRemoveDim(d.id)}
                                                title="Remove"
                                            >×</button>
                                        </li>
                                    ))
                                )}
                            </ul>
                            
                        </>) : (<>
                         <div className="flex flex-row gap-2 mb-2 w-full justify-center">
                                <button className="flex flex-auto bg-slate-500 w-full hover:bg-slate-700 text-white font-bold py-1 px-3 rounded mb-4"
                                    onClick={() => setDimMode("list")}
                                >List Dimensions ←</button>
                                <button
                                    className="flex flex-auto bg-slate-500 w-full hover:bg-slate-700 text-white font-bold py-1 px-3 rounded mb-4"
                                    onClick={() => null}
                                >Select Template</button>
                            </div>
                            <div className="mb-2">
                                <div className="font-semibold mb-1">Template Dimenions:</div>
                                {dimensionTemplates.map((tpl, i) => (
                                    <button
                                        key={i}
                                        className="border px-2 py-1 rounded mr-2 mb-2"
                                        onClick={() => {
                                            handleAddDim(tpl);
                                            setDimMode("list");
                                        }}
                                    >
                                        {tpl.symbol} — {tpl.name}
                                    </button>
                                ))}
                            </div>
                            <div className="font-semibold mb-1 w-full text-center">Or create custom:</div>
                            <div className="flex flex-row gap-2 mb-2 w-full justify-center">
                                <input
                                    className="flex flex-3 border rounded px-2 py-1 w-full"
                                    placeholder="Symbol"
                                    value={newDim.symbol}
                                    onChange={e => setNewDim(d => ({ ...d, symbol: e.target.value }))}
                                />
                                <input
                                    className="flex flex-3 border rounded px-2 py-1 w-full"
                                    placeholder="Name"
                                    value={newDim.name}
                                    onChange={e => setNewDim(d => ({ ...d, name: e.target.value }))}
                                />
                                <button
                                    className="flex flex-1 w-full bg-green-500 text-white px-3 py-1 rounded"
                                    onClick={() => {
                                        handleAddDim(newDim);
                                        setNewDim({ name: "", symbol: "" });
                                        setDimMode("list");
                                    }}
                                >Add</button>
                            </div>
                        </>)
                    }
                </div>
                <div className="flex flex-col items-center gap-4 border-t-2 pt-6">
                <h2 className="text-xl lg:text-3xl font-bold mb-4 text-center">Variables</h2>
                {/* Add Variable Form */}
                <div className="flex flex-row gap-2 mb-2">
                    <input
                        className="flex-1 border rounded px-2 py-1"
                        placeholder="Symbol"
                        value={newVar.symbol}
                        onChange={e => setNewVar(v => ({ ...v, symbol: e.target.value }))}
                    />
                    <input
                        className="flex-1 border rounded px-2 py-1"
                        placeholder="Name"
                        value={newVar.name}
                        onChange={e => setNewVar(v => ({ ...v, name: e.target.value }))}
                    />
                    <button
                        onClick={handleAddVar}
                        className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-1 px-3 rounded"
                    >
                        +
                    </button>
                
                </div>
                {/* List Variables */}
                <ul className="flex-1 overflow-y-auto">
                    { variables.length === 0 ? <li className="text-center text-gray-500">No variables added</li> : variables.map(v => (
                        <li key={v.id} className="flex items-center gap-2 mb-2">
                            <input
                                className="border rounded px-1 py-0.5 w-16"
                                value={v.symbol}
                                onChange={e => handleEditVar(v.id, "symbol", e.target.value)}
                                placeholder="Symbol"
                            />
                            <input
                                className="border rounded px-1 py-0.5 flex-1"
                                value={v.name}
                                onChange={e => handleEditVar(v.id, "name", e.target.value)}
                                placeholder="Name"
                            />
                            <button
                                onClick={() => handleRemoveVar(v.id)}
                                className="text-red-600 font-bold px-2"
                                title="Remove"
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
                </div>
            </div>
        </div>
    );
}
