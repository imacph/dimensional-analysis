import type { Variable, Dimension } from "../model/types";
import { Rational } from "./Rational";
export class Matrix {

    data: Rational[][];

    constructor(data: Rational[][]) {
        // Deep copy to prevent external mutations
        this.data = data.map(row => [...row]);
    }

    static fromVariablesAndDimensions(variables: Variable[], dimensions: Dimension[]): Matrix {
        // Build matrix: each row corresponds to a dimension, each column to a variable
        let matrix: Rational[][] = dimensions.map((_, dimIdx) =>
            variables.map(variable => new Rational(variable.exponents[dimIdx] ?? 0, 1))
        );

        // Remove trivial rows (all zeros)
        matrix = matrix.filter(row => row.some(cell => !cell.equals(new Rational(0, 1))));

        return new Matrix(matrix);
    }

    static identity(size: number): Matrix {
        const data: Rational[][] = [];
        for (let i = 0; i < size; i++) {
            const row: Rational[] = [];
            for (let j = 0; j < size; j++) {
                row.push(i === j ? new Rational(1, 1) : new Rational(0, 1));
            }
            data.push(row);
        }
        return new Matrix(data);
    }

    get rows(): number {
        return this.data.length;
    }

    get cols(): number {
        // if there are no rows, or if they have zero length, return 0
        return this.data[0]?.length ?? 0;
    }

    clone(): Matrix {
        return new Matrix(this.data.map(row => [...row]));
    }

    rref(): Matrix {
        // deep copy the matrix 
        const m = this.clone();
        const rowCount = m.rows;
        const colCount = m.cols;
        const mData = m.data;
        let row = 0;
        for (let col = 0; col < colCount && row < rowCount; col++) {
            let pivotRow = row;
            // Find pivot row (where entry is not zero)
            while (
                pivotRow < rowCount &&
                mData[pivotRow][col].equals(new Rational(0, 1))
            ) {
                pivotRow++;
            }
            // end of column, no pivot found
            if (pivotRow === rowCount) continue; 
            // if pivot row is different from current row, swap them
            if (pivotRow !== row) {
                [mData[pivotRow], mData[row]] = [mData[row], mData[pivotRow]];
            }
            const pivotVal = mData[row][col];
            // normalize the pivot row
            for (let j = 0; j < colCount; j++) {
                mData[row][j] = mData[row][j].div(pivotVal);
            }
            // eliminate the current column in all other rows
            for (let i = 0; i < rowCount; i++) {
                if (i !== row) {
                    const factor = mData[i][col];
                    for (let j = 0; j < colCount; j++) {
                        // subtract factor * pivot row from all non-pivot rows
                        mData[i][j] = mData[i][j].sub(factor.mul(mData[row][j]));
                    }
                }
            }
            row++;
        }
        // zero out very small values to clean up the matrix
        for (let r = 0; r < rowCount; r++) {
            for (let c = 0; c < colCount; c++) {
                if (Math.abs(mData[r][c].toNumber()) < 1e-10) mData[r][c] = new Rational(0, 1);
            }
        }
        return m;
    }

    rowReductionMatrix(returnRREF: boolean = false): Matrix {
        const m = this.clone();
        const rowCount = m.rows;
        const colCount = m.cols;
        const mData = m.data;
        const identity = Matrix.identity(rowCount).data;

        const augmentedMatrix = new Matrix(mData.map((m, i) => [...m, ...identity[i]]));

        const augmentedRREF = augmentedMatrix.rref();

        // Extract the left and right parts of the augmented RREF
        if (!returnRREF) {
           
            const rowReductionPart = augmentedRREF.data.map(row => row.slice(colCount));
        
            return new Matrix(rowReductionPart);
        } else {

            return new Matrix(augmentedRREF.data);
        }
    }

    nullspaceBasis(rrefMatrix?: Matrix): Matrix {
        const rref = rrefMatrix || this.rref();
        const pivotCols: number[] = [];
        // Identify pivot columns
        for (let r = 0; r < rref.rows; r++) {
            for (let c = 0; c < rref.cols; c++) {
                if (!rref.data[r][c].equals(new Rational(0, 1))) {
                    pivotCols.push(c);
                    break;
                }
            }
        }

        // Free columns are those that are not pivot columns
        // nullspace dimension = number of free columns
        const freeCols = [];
        for (let c = 0; c < rref.cols; c++) {
            if (!pivotCols.includes(c)) {
                freeCols.push(c);
            }
        }

        const basis: Rational[][] = [];

        // For each free column, create a basis vector
        for (const freeCol of freeCols) {
            const vec = new Array(rref.cols).fill(new Rational(0, 1));
            vec[freeCol] = new Rational(1, 1); // set free variable to 1
            // Set the pivot variables according to the RREF
            for (let r = 0; r < rref.rows; r++) {
                const pivotCol = pivotCols[r];
                if (pivotCol !== undefined) {
                    vec[pivotCol] = vec[pivotCol].sub(rref.data[r][freeCol]);
                }
            }
            basis.push(vec);
        }
        return new Matrix(basis);
    }
}