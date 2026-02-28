import type { Variable, Dimension } from "../model/types";
import { Rational } from "./Rational";
export class Matrix {

    data: Rational[][];

    constructor(data: Rational[][]) {
        // Deep copy to prevent external mutations
        this.data = data.map(row => [...row]);
    }

    static fromVariablesAndDimensions(variables: Variable[], 
                                    dimensions: Dimension[]): Matrix {
        const matrix: Rational[][] = dimensions.map(dim => 
            variables.map(variable => {
                let exponent = 0;
                if (Array.isArray(variable.dimensions) && Array.isArray(variable.dimensionExponents)) {
                    const idx = variable.dimensions.findIndex(did => did === dim.id);
                    // findIndex returns -1 if not found, so we check for that
                    exponent = idx !== -1 ? variable.dimensionExponents[idx] : 0;
                }
                return new Rational(exponent, 1); // convert to Rational for matrix operations
            })  
        );
        return new Matrix(matrix);
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
}