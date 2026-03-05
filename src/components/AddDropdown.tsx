import { usePiTool } from "../context/PiToolContext";
import type { Variable, Dimension } from "../lib/model/types";

type AddDropdownProps = {
    onAddVariable: (variable: Omit<Variable, "id">) => void;
    onAddDimension: (dimension: Omit<Dimension, "id">) => void;
    onClose: () => void;
};

export default function AddDropdown({ onAddVariable, onAddDimension, onClose }: AddDropdownProps) {
    const { dimensions,  
        } = usePiTool();

    const handleAddVariable = () => {
        const newVariable: Omit<Variable, "id"> = {
            name: "",
            symbol: "",
            exponents: Array(dimensions.length).fill(0),
        };
        onAddVariable(newVariable);
        onClose();
    };

    const handleAddDimension = () => {
        const newDimension = { 
            name: "", 
            symbol: "",
            isVisible: true, // New dimensions are visible by default
            isFundamental: false, // New dimensions are not fundamental by default
        };
        onAddDimension(newDimension);
        onClose();
    };

    return (
        <div className="absolute top-full -mt-1 ml-2 left-2 bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-500 rounded-xl shadow-lg z-10">
            <div className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white dark:border-b-zinc-700 bg-transparent"></div>
            <button
                className="block w-full text-left dark:text-zinc-200 px-4 py-2 border-b-2 border-gray-100 dark:border-zinc-500 hover:border-gray-200 dark:hover:border-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-600 bg-transparent rounded-t-xl"
                onClick={handleAddDimension}
            >
                Dimension
            </button>
            <button
                className="block w-full text-left dark:text-zinc-200 px-4 py-2 rounded-b-xl hover:bg-gray-100 dark:hover:bg-zinc-600 bg-transparent"
                onClick={handleAddVariable}
            >
                Variable
            </button>
        </div>
    );
}