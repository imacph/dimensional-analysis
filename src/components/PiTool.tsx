import MainPanel from "./MainPanel";
import { useCrudArray } from '../hooks/useCrudArray';
import type { Variable, Dimension } from '../lib/model/types';
import { PiToolContext } from '../context/PiToolContext';
import ResultsPanel from "./ResultsPanel";

import dimensionPresets from '../lib/data/dimensions.json';
import { useEffect,useState } from "react";
import LZString from "lz-string";



export default function PiTool() {

    const MAX_VARIABLES = 20;
    const MAX_DIMENSIONS = 12;

    const fundamentalUnits = dimensionPresets.find(c => c.category === "Fundamental Units")?.contents ?? [];

    const initialDimensions: Dimension[] = fundamentalUnits.map((unit, index) => ({
        id: index,
        name: unit.label,
        symbol: unit.symbol?.value ?? "",
        isFundamental: true,
        isVisible: false, // Start with fundamental dimensions hidden by default
    }));


    const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark'));

    const toggleDarkMode = () => {
        document.body.classList.toggle('dark');
        setIsDarkMode(document.body.classList.contains('dark'));
    };

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

        <div className="hidden sm:flex flex-col sm:col-span-2 h-100% w-full rounded-xl dark:text-zinc-200 border-gray-400 border-2 dark:border-zinc-500 bg-slate-600 dark:bg-zinc-800 shadow-lg justify-between items-center">
            
            <div className="flex flex-col justify-start items-center w-full p-4 m-4 gap-4">
                <h1 className="flex text-4xl font-bold mb-4 text-center text-white w-full">Dimensional Analysis Tool</h1>
                <button
                    className="flex flex-row justify-between px-4 py-2 rounded dark:bg-slate-200 bg-zinc-700 dark:text-black text-zinc-100 shadow w-full hover:bg-zinc-800 dark:hover:bg-slate-300 hover:shadow-2xl shadow-xl"
                    onClick={toggleDarkMode}
                >
                    <div>{isDarkMode ? "Light Mode" : "Dark Mode"}</div>
                    <div>{isDarkMode ? "🌞" : "🌙"}</div>
                </button>
                <a
                    href="https://github.com/imacph/dimensional-analysis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row items-center justify-between p-2 rounded bg-slate-100 dark:bg-zinc-700 text-black dark:text-white shadow w-full hover:dark:bg-zinc-500 hover:bg-slate-200 dark:hover:bg-zinc-600"
                >
                    <div>View on GitHub</div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.804 5.624-5.475 5.921.43.371.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                </a>
            </div>
            
            <div className="flex flex-col gap-0 w-full border-gray-500 dark:border-zinc-500 p-4">
                <button onClick={copyShareableUrl} 
                    className="flex flex-row w-full bg-slate-100 dark:bg-zinc-600 cursor-pointer justify-between rounded-t-lg p-2 hover:bg-slate-200 dark:hover:bg-zinc-500 border-b-2 border-gray-300 dark:border-zinc-500">
                    <div>Copy Shareable URL</div> <div>📋</div>
                </button>
                <button onClick={downloadProfile} 
                    className="flex flex-row bg-slate-100 dark:bg-zinc-600 cursor-pointer justify-between p-2 hover:bg-slate-200 dark:hover:bg-zinc-500 border-gray-300 dark:border-zinc-500">
                    <div>Download Profile</div> <div>💾</div>
                </button>
                <label className="flex flex-row bg-slate-100 dark:bg-zinc-600 cursor-pointer justify-between p-2 hover:bg-slate-200 dark:hover:bg-zinc-500 border-t-2 border-gray-300 dark:border-zinc-500" >
                    <div>Import Profile</div> <div>📥</div>
                    <input type="file" accept="application/json" style={{ display: "none" }}
                        onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) importProfileFromFile(file);
                        }} />
                </label>
                <button className="flex flex-row bg-slate-100 dark:bg-zinc-600 cursor-pointer justify-between rounded-b-lg p-2 hover:dark:bg-red-500 hover:bg-red-500 border-t-2 hover:text-white hover:border-white border-gray-300 dark:border-zinc-500"
                    onClick={()=>{
                    setVariables([]);
                    dimensions.splice(0, dimensions.length, ...initialDimensions);
                }}><div>Reset & Clear all</div> <div>⟳</div>
                </button>
            </div>
            
        </div>
        <div className="col-span-10 w-full h-full">
            <div className="grid grid-cols-10 gap-2 w-full h-full">
                <div className="col-span-7 h-full">
                    <ResultsPanel />
                </div>
                <div className="col-span-3 flex flex-col gap-4 border-2 rounded-2xl dark:border-zinc-500 border-gray-300 h-full w-full">
                    <MainPanel />
                </div>
            </div>
        </div>
    </PiToolContext.Provider>);
}
