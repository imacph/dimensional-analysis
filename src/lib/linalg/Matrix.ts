import type { Variable, Dimension } from "../model/types";

export class Matrix {

    data: number[][];

    constructor(data: number[][]) {
        // Deep copy to prevent external mutations
        this.data = data.map(row => [...row]);
    }

    static fromVariablesAndDimensions(variables: Variable[], 
                                    dimensions: Dimension[]): Matrix {
        const matrix: number[][] = dimensions.map(dim => 
            variables.map(variable => {
                let exponent = 0;
                if (Array.isArray(variable.dimensions) && Array.isArray(variable.dimensionExponents)) {
                    const idx = variable.dimensions.findIndex(did => did === dim.id);
                    // findIndex returns -1 if not found, so we check for that
                    exponent = idx !== -1 ? variable.dimensionExponents[idx] : 0;
                }
                return exponent;
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
            
            while (pivotRow < rowCount && Math.abs(mData[pivotRow][col]) < 1e-10) {
                pivotRow++;
            }
            // end of column, no pivot found
            if (pivotRow === rowCount) continue; 
            // if pivot row is different from current row, swap them
            if (pivotRow !== row) {
                // swap the current row with the pivot row
                [mData[pivotRow], mData[row]] = [mData[row], mData[pivotRow]];
            }
            const pivotVal = mData[row][col];
            // normalize the pivot row
            for (let j = 0; j < colCount; j++) {
                mData[row][j] /= pivotVal;
            }
            // eliminate the current column in all other rows
            for (let i = 0; i < rowCount; i++) {
                if (i !== row) {
                    const factor = mData[i][col];
                    for (let j=0; j < colCount; j++) {
                        // subtract factor * pivot row from all non-pivot rows
                        mData[i][j] -= factor * mData[row][j];
                    }
                }
            }
            row++;
        }
        // zero out very small values to clean up the matrix
        for (let r=0; r < rowCount; r++) {
            for (let c=0; c < colCount; c++) {
                if (Math.abs(mData[r][c]) < 1e-10) mData[r][c] = 0;
            }
        }
        return m;
    }
}