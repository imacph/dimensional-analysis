import MainPanel from "./MainPanel";
import { useCrudArray } from '../hooks/useCrudArray';
import type { Variable, Dimension } from '../lib/model/types';
import { PiToolContext } from '../context/PiToolContext';
import ResultsPanel from "./ResultsPanel";

import dimensionPresets from '../lib/data/dimensions.json';
import { useEffect } from "react";
import LZString from "lz-string";




export default function PiTool() {

    const MAX_VARIABLES = 20;
    const MAX_DIMENSIONS = 12;

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
        if (variables.length >= MAX_VARIABLES) {
            alert(`Maximum of ${MAX_VARIABLES} variables reached.`);
            return;
        }

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
    
    // --- Profile Serialization Helpers ---
    function encodeProfile(variables: Variable[], dimensions: Dimension[]) {
        const json = JSON.stringify({ variables, dimensions });
        return encodeURIComponent(LZString.compressToEncodedURIComponent(json));
    }

    function decodeProfile(encoded: string) {
        const json = LZString.decompressFromEncodedURIComponent(encoded);
        return JSON.parse(json);
    }

    // --- Load profile from URL on mount ---
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const encoded = params.get("profile");
        if (encoded) {
            try {
                const { variables: v, dimensions: d } = decodeProfile(encoded);
                setVariables(v ?? []);
                // Replace all dimensions
                if (Array.isArray(d)) {
                    // You may want to add validation here
                    dimensions.splice(0, dimensions.length, ...d);
                }
            } catch (e) {
                console.error("Failed to load profile from URL:", e);
            }
        }
    }, []);

    // --- Export/Share Functions ---
    function getShareableUrl() {
        const encoded = encodeProfile(variables, dimensions);
        return `${window.location.origin}${window.location.pathname}?profile=${encoded}`;
    }

    function copyShareableUrl() {
        const url = getShareableUrl();
        navigator.clipboard.writeText(url);
        alert("Shareable URL copied!");
    }

    function downloadProfile() {
        const data = JSON.stringify({ variables, dimensions }, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "profile.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    function importProfileFromFile(file: File) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const profile = JSON.parse(e.target?.result as string);
                setVariables(profile.variables ?? []);
                // Replace all dimensions
                if (Array.isArray(profile.dimensions)) {
                    dimensions.splice(0, dimensions.length, ...profile.dimensions);
                }
            } catch (e) {
                alert("Invalid profile file.");
            }
        };
        reader.readAsText(file);
    }

    return (<PiToolContext.Provider value={{
        variables, dimensions,
        addVariable, editVariable, editVariableMany, removeVariable,
        addDimension, editDimension, removeDimension, reorderVariables,
        getShareableUrl, copyShareableUrl, downloadProfile, importProfileFromFile
    }}>

        <div className="hidden sm:flex flex-col sm:col-span-2 h-100% p-4 rounded-lg bg-slate-600 shadow-lg justify-between items-center">
            <div className="flex flex-col justify-start items-start">
                <h1 className="flex text-4xl font-bold mb-4 text-center text-white w-full">Dimensional Analysis Tool</h1>
                <button className="bg-slate-100 cursor-pointer rounded p-2 hover:bg-red-500 border-2 hover:text-white hover:border-white border-gray-300"
                    onClick={()=>{
                    setVariables([]);
                    dimensions.splice(0, dimensions.length, ...initialDimensions);
                }}>Reset & Clear all ⟳</button>
            </div>
            <div className="flex flex-col gap-1 mt-4 w-full">
                <button onClick={copyShareableUrl} className="flex bg-slate-100 cursor-pointer justify-center rounded p-2 hover:bg-slate-200">Copy Shareable URL</button>
                <button onClick={downloadProfile} className="flex bg-slate-100 cursor-pointer justify-center rounded p-2 hover:bg-slate-200">Download Profile</button>
                <label className="flex bg-slate-100 cursor-pointer justify-center rounded p-2 hover:bg-slate-200" >
                    Import Profile
                    <input type="file" accept="application/json" style={{ display: "none" }}
                        onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) importProfileFromFile(file);
                        }} />
                </label>
            </div>
        </div>
        <div className="col-span-10 w-full h-full">
            <div className="grid grid-cols-10 gap-2 w-full h-full">
                <div className="col-span-7 h-full">
                    <ResultsPanel />
                </div>
                <div className="col-span-3 flex flex-col gap-4 border-2 rounded-2xl border-gray-300 h-full w-full">
                    <MainPanel />
                </div>
            </div>
        </div>
    </PiToolContext.Provider>);
}
