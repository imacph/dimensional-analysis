import { Matrix } from "../lib/linalg/Matrix";

export default function MatrixDisplay({ matrix }: { matrix: Matrix }) {


    const gridStyle = {
        display: "grid",
        gridTemplateColumns: `repeat(${matrix.cols}, 1fr)`,
        gridTemplateRows: `repeat(${matrix.rows}, 1fr)`,
        gap: "8px",
        padding: "8px"
    };

    return (
        <div style={gridStyle}>
            {matrix.data.map((row, rowIdx) =>
                row.map((val, colIdx) => (
                    <div
                        key={`cell-${rowIdx}-${colIdx}`}
                        style={{ border: "1px solid #ccc", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", height: "48px", background: "#fff", color: "#333" }}
                    >
                        {Number.isFinite(val) ? val : 0}
                    </div>
                ))
            )}
        </div>
    );
}