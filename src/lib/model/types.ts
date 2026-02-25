// TypeScript types for Buckingham Pi variables and dimensions

export type FundamentalDim = string; // e.g. "M" | "L" | "T" | "I" | "Θ" | "N" | "J" etc.

export type DimVector = Record<FundamentalDim, number>;
// Use number initially; consider rationals later if you support 1/2 exponents.

export interface DimVar {
  id: string;
  symbol: string;
  name: string;
  dims: DimVector;
  units?: string;       // optional display hint only
  tags?: string[];      // "fluid", "mechanics", ...
}
