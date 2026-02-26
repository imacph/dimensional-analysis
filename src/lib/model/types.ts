// TypeScript types for Buckingham Pi variables and dimensions

export type Variable = {
    id: number;
    name: string;
    symbol: string;
    dimensions?: Dimension[];
    dimensionExponents?: number[];
};

export type Dimension = {
    id: number;
    name: string;
    symbol: string;
}

export type IdType = number | string;