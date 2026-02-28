
import { usePiTool } from "../context/PiToolContext";
import { Matrix } from "../lib/linalg/Matrix";
import MatrixDisplay from "./MatrixDisplay";

export default function ResultsPanel() {
    const { variables, dimensions } = usePiTool();


    const rawInputMatrix = Matrix.fromVariablesAndDimensions(variables, dimensions);
    const rrefMatrix = rawInputMatrix.rref();

    return (
        <div className="flex flex-col w-full h-full border-2 border-gray-300 rounded-2xl p-4">
            <h2 className="flex text-xl lg:text-4xl font-bold mb-4">Results</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1 bg-slate-200 rounded-xl p-4">
                    <MatrixDisplay matrix={rawInputMatrix} />
                </div>
                <div className="col-span-1 bg-slate-200 rounded-xl p-4">
                    <MatrixDisplay matrix={rrefMatrix} />
                </div>
            </div>
        </div>
    )
}