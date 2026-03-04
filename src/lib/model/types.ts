// TypeScript types for Buckingham Pi variables and dimensions

export type Variable = {
    id: number;
    name: string;
    symbol: string;
    exponents: number[]; // Exponents corresponding to dimensions
};

export type Dimension = {
    id: number;
    name: string;
    symbol: string;
    isFundamental?: boolean; // Optional flag to indicate if it's a fundamental dimension
    isVisible?: boolean; // Optional flag to control visibility in the UI
}

export type IdType = number | string;