import RawInputMatrix from "./RawInputMatrix";
import { usePiTool } from "../context/PiToolContext";

export default function ResultsPanel() {
    // ...existing code...
    // RREF calculation helper
    const { variables, dimensions } = usePiTool();

    // Build raw matrix: rows = dimensions (master order), cols = variables
    // Use dimension IDs to map exponents correctly
    const dimensionIdToIndex: Record<string | number, number> = {};
    dimensions.forEach((dim, idx) => {
        dimensionIdToIndex[dim.id] = idx;
    });

    const matrix: number[][] = dimensions.map((dim) =>
        variables.map(variable => {
            if (!variable.dimensionExponents) return 0;
            // If variable.dimensionExponents is an array, try to find the index of this dimension in the variable's dimension list
            // If variable has a dimensions array, use it to map
            if (variable.dimensions && Array.isArray(variable.dimensions)) {
                const varDimIdx = variable.dimensions.findIndex(did => did === dim.id);
                if (varDimIdx !== -1) {
                    return variable.dimensionExponents[varDimIdx] ?? 0;
                }
            }
            // Otherwise, assume master dimension order
            const masterIdx = dimensionIdToIndex[dim.id];
            return variable.dimensionExponents[masterIdx] ?? 0;
        })
    );

    // RREF algorithm (simple, for small matrices)
    function rref(input: number[][]): number[][] {
        // Gauss-Jordan elimination for RREF
        const m = input.map(row => [...row]);
        const rowCount = m.length;
        const colCount = m[0]?.length ?? 0;
        let row = 0;
        for (let col = 0; col < colCount && row < rowCount; col++) {
            // Find the pivot row
            let pivotRow = row;
            while (pivotRow < rowCount && Math.abs(m[pivotRow][col]) < 1e-10) {
                pivotRow++;
            }
            if (pivotRow === rowCount) {
                // No pivot in this column, move to next column
                continue;
            }
            // Swap current row with pivotRow
            if (pivotRow !== row) {
                [m[pivotRow], m[row]] = [m[row], m[pivotRow]];
            }
            // Normalize pivot row
            const pivotVal = m[row][col];
            for (let j = 0; j < colCount; j++) {
                m[row][j] /= pivotVal;
            }
            // Eliminate all other entries in this column
            for (let i = 0; i < rowCount; i++) {
                if (i !== row) {
                    const factor = m[i][col];
                    for (let j = 0; j < colCount; j++) {
                        m[i][j] -= factor * m[row][j];
                    }
                }
            }
            row++;
        }
        // Zero out near-zero entries
        for (let r = 0; r < rowCount; r++) {
            for (let c = 0; c < colCount; c++) {
                if (Math.abs(m[r][c]) < 1e-10) m[r][c] = 0;
            }
        }
        return m;
    }

    const rrefMatrix = rref(matrix);

    // Nullspace basis calculation
    function getNullspaceBasis(rref: number[][]): number[][] {
        const rowCount = rref.length;
        const colCount = rref[0]?.length ?? 0;
        // Find pivot columns: for each row, find first nonzero column
        const pivots: number[] = [];
        for (let i = 0; i < rowCount; i++) {
            const row = rref[i];
            const pivotCol = row.findIndex((v, idx) => Math.abs(v - 1) < 1e-10 && row.slice(0, idx).every(x => Math.abs(x) < 1e-10));
            if (pivotCol !== -1) pivots.push(pivotCol);
        }
        // Free variables are columns not in pivots
        const freeVars = [];
        for (let col = 0; col < colCount; col++) {
            if (!pivots.includes(col)) freeVars.push(col);
        }
        // Number of basis vectors = number of free variables
        const basis: number[][] = [];
        for (let k = 0; k < freeVars.length; k++) {
            const freeCol = freeVars[k];
            // Start with zeros
            const vec = Array(colCount).fill(0);
            // Set 1 in the position of this free variable
            vec[freeCol] = 1;
            // Set 0 in all other free variable positions (already zero)
            // Now solve for pivot columns
            for (let i = 0; i < pivots.length; i++) {
                const pivotCol = pivots[i];
                // The equation for this row: x_pivot + sum_j rref[i][j] x_j = 0, where j is free variable
                // So x_pivot = -sum_j rref[i][j] x_j
                // Only one x_j is nonzero (the current freeCol)
                vec[pivotCol] = -rref[i][freeCol];
            }
            basis.push(vec);
        }
        return basis;
    }

    const nullspaceBasis = getNullspaceBasis(rrefMatrix);

    return (
        <div className="flex flex-col w-full h-full border-2 border-gray-300 rounded-2xl p-4">
            <h2 className="flex text-xl lg:text-4xl font-bold mb-4">Results</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1 bg-slate-200 rounded-xl p-4">
                    <RawInputMatrix />
                </div>
                <div className="col-span-1 bg-slate-200 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">RREF</h3>
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${variables.length}, 1fr)`, gridTemplateRows: `repeat(${dimensions.length}, 1fr)`, gap: "8px" }}>
                        {rrefMatrix.map((row, rowIdx) =>
                            row.map((val, colIdx) => (
                                <div key={`rref-${rowIdx}-${colIdx}`} style={{ border: "1px solid #ccc", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", height: "48px", background: "#fff", color: "#333" }}>
                                    {Number.isFinite(val) ? val.toFixed(2) : "0"}
                                </div>
                            ))
                        )}
                    </div>
                    <h3 className="font-semibold mt-6 mb-2">Nullspace Basis</h3>
                    {nullspaceBasis.length === 0 ? (
                        <div className="text-gray-500">No nontrivial nullspace</div>
                    ) : (
                        <div className="space-y-2">
                            {nullspaceBasis.map((vec, idx) => (
                                <div key={`nullvec-${idx}`} className="flex gap-2">
                                    {vec.map((v, j) => (
                                        <span key={`nullvec-${idx}-${j}`} className="px-2 py-1 border rounded bg-gray-100 text-gray-800">
                                            {Number.isFinite(v) ? v.toFixed(2) : "0"}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}