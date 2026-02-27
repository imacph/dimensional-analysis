import type { Variable, Dimension } from "../lib/model/types";
import { useState } from "react";
type AddDropdownProps = {
    onAddVariable: (variable: Omit<Variable, "id">) => void;
    onAddDimension: (dimension: Omit<Dimension, "id">) => void;
    onClose: () => void;
};

export default function AddDropdown({ onAddVariable, onAddDimension, onClose }: AddDropdownProps) {


    const handleAddVariable = () => {
        const newVariable: Omit<Variable, "id"> = {
            name: "New Variable",
            symbol: "X",
            dimensions: [],
            dimensionExponents: [],
        };
        onAddVariable(newVariable);
        onClose();
    };

    const handleAddDimension = () => {
        const newDimension = { name: "New Dimension", symbol: "D" };
        onAddDimension(newDimension);
        onClose();
    };

    return (
        <div className="absolute top-full -mt-1 ml-2 left-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
            <div className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white bg-transparent"></div>
            <button
                className="block w-full text-left px-4 py-2 border-b-2 border-gray-100 hover:border-gray-200 hover:bg-gray-100 bg-transparent rounded-t-xl"
                onClick={handleAddDimension}
            >
                Dimension
            </button>
            <button
                className="block w-full text-left px-4 py-2 rounded-b-xl hover:bg-gray-100 bg-transparent"
                onClick={handleAddVariable}
            >
                Variable
            </button>
        </div>
    );
}