import { Matrix } from "../lib/linalg/Matrix";

export default function MatrixDisplay({ matrix }: { matrix: Matrix }) {


    const gridStyle = {
        display: "grid",
        gridTemplateColumns: `repeat(${matrix.cols}, 1fr)`,
        gridTemplateRows: `repeat(${matrix.rows}, 1fr)`,
    };

    return (
        <div style={gridStyle} className="border border-gray-500">
            {matrix.data.map((row, rowIdx) =>
                row.map((val, colIdx) => (
                    <div
                        key={`cell-${rowIdx}-${colIdx}`}
                        className="border bg-white border-gray-100 flex items-center justify-center p-2 text-sm"
                    >
                        {val.toString()}
                    </div>
                ))
            )}
        </div>
    );
}