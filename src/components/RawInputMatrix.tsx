import { usePiTool } from "../context/PiToolContext";
import React from "react";
import type { Variable, Dimension } from "../lib/model/types";


export default function RawInputMatrix() {
    const { variables, dimensions } = usePiTool();

    // Helper: get exponent for variable/dimension
    function getExponent(variable: Variable, dimIdx: number) {
        // dimensionExponents is an array, index by dimIdx
        if (!variable.dimensionExponents) return 0;
        return variable.dimensionExponents[dimIdx] ?? 0;
    }

    // Build grid rows using regular CSS grid
    const gridStyle = {
        display: "grid",
        gridTemplateColumns: `repeat(${variables.length}, 1fr)`,
        gridTemplateRows: `repeat(${dimensions.length}, 1fr)`,
        gap: "8px",
        padding: "8px"
    };

    return (
        <div style={gridStyle}>
            {dimensions.map((dimension, rowIdx) =>
                variables.map((variable, colIdx) => (
                    <div
                        key={`cell-${rowIdx}-${colIdx}`}
                        style={{ border: "1px solid #ccc", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", height: "48px", background: "#fff", color: "#333" }}
                    >
                        {getExponent(variable, rowIdx)}
                    </div>
                ))
            )}
        </div>
    );
}