import { Matrix } from "../lib/linalg/Matrix";

export default function MatrixDisplay({ matrix }: { matrix: Matrix }) {

    // handle case of zero rows or columns
    if (matrix.rows === 0 || matrix.cols === 0) {
        return (
            <div className="border border-gray-500 p-4 text-center bg-slate-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-500 italic">
                {matrix.rows === 0 && matrix.cols === 0 && "Nothing to Display"}
                {matrix.rows === 0 && matrix.cols > 0 && "No Rows"}
                {matrix.cols === 0 && matrix.rows > 0 && "No Columns"}
            </div>
        )
    }
    const gridStyle = {
        display: "grid",
        gridTemplateColumns: `repeat(${matrix.cols}, 1fr)`,
        gridTemplateRows: `repeat(${matrix.rows}, 1fr)`,
    };


    // if the matrix isn't empty
    return (
        <div style={gridStyle} className="border border-gray-500">
            {matrix.data.map((row, rowIdx) =>
                row.map((val, colIdx) => (
                    <div
                        key={`cell-${rowIdx}-${colIdx}`}
                        className="border bg-slate-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-500 flex items-center justify-center p-2 text-sm dark:text-zinc-200"
                    >
                        {val.toString()}
                    </div>
                ))
            )}
        </div>
    );
}