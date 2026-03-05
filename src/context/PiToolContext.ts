import React, { createContext, useContext } from "react";
import type { Variable, Dimension } from "../lib/model/types";

interface PiToolContextType {
    variables: Variable[];
    dimensions: Dimension[];
    addVariable: (v: Omit<Variable, "id">) => void;
    editVariable: (id: Variable["id"], field: keyof Variable, value: any) => void;
    editVariableMany: (id: Variable["id"], updates: Partial<Variable>) => void;
    removeVariable: (id: Variable["id"]) => void;
    addDimension: (d: Omit<Dimension, "id">) => void;
    editDimension: (id: Dimension["id"], field: keyof Dimension, value: any) => void;
    removeDimension: (id: Dimension["id"]) => void;
    reorderVariables: (newOrder: Variable[]) => void; 
    getShareableUrl: () => string;
    copyShareableUrl: () => void;
    downloadProfile: () => void;
    importProfileFromFile: (file: File) => void;
}

export const PiToolContext = createContext<PiToolContextType | undefined>(undefined);

export const usePiTool = () => {
    const ctx = useContext(PiToolContext);
    if (!ctx) throw new Error("usePiTool must be used within PiToolProvider");
    return ctx;
};