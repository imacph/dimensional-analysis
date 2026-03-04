
import { usePiTool } from "../context/PiToolContext";
import { Matrix } from "../lib/linalg/Matrix";
import MatrixDisplay from "./MatrixDisplay";
import PiGroupDisplay from "./PiGroupDisplay";

export default function ResultsPanel() {
    const { variables, dimensions } = usePiTool();


    const rawInputMatrix = Matrix.fromVariablesAndDimensions(variables, dimensions);
    const rrefMatrix = rawInputMatrix.rref();

    return (
        <div className="flex flex-col w-full h-full border-2 border-gray-300 rounded-2xl p-4">
            <h2 className="flex text-xl lg:text-4xl font-bold mb-4">Results</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1 bg-slate-200 rounded-xl p-4">
                    <div className="text-lg font-semibold mb-4">Input Matrix</div>
                    <MatrixDisplay matrix={rawInputMatrix} />
                </div>
                <div className="col-span-1 flex flex-col gap-2 bg-slate-200 rounded-xl p-4">
                    <div className="text-lg font-semibold mb-4">RREF Matrix</div>
                    <MatrixDisplay matrix={rrefMatrix} />
                    
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <PiGroupDisplay piGroups={rawInputMatrix.nullspaceBasis(rrefMatrix)} symbols={variables.map(v => v.symbol)} />
                <div className="col-span-1 flex flex-col gap-2 bg-slate-200 rounded-xl p-4">
                    <div className="text-lg font-semibold mb-4">Nullspace Basis</div>
                    <MatrixDisplay matrix={rawInputMatrix.nullspaceBasis(rrefMatrix)} />
                </div>
            </div>
        </div>
    )
}