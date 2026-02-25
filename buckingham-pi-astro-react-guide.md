# Buckingham Pi Dimensional Analysis Web App (Astro + React Islands)
*A practical build guide for an interactive “define variables → compute Π groups → explore results” app.*

---

## 0) What you’re building
An interactive web app where users can:
1. Define a **system** by listing dimensional variables (each with a symbol, label/name, and dimensions).
2. Choose a **dimension basis** (e.g., M–L–T or other fundamental dimensions).
3. Run the **Buckingham Π method** to compute:
   - the number of Π groups:  
     **k = n − r**  
     where *n* = number of variables, *r* = rank of the dimension matrix.
   - one or more **dimensionless groups** expressed as monomials of the variables.
4. Inspect the **nullspace basis** and optionally produce **“nice”** groups (integer exponents, simple forms).
5. Start from a **built‑in library** of common physical variables (e.g., force, density, viscosity, gravity, etc.) and edit/add custom ones.

---

## 1) Stack & high-level architecture
- **Astro** for routing, page composition, static generation, and content.
- **React islands** for the interactive editor + results visualization.
- Optional: **client-side persistence** via `localStorage` (shareable URLs later).
- Optional: **serverless** computation endpoint (not required; client-only is fine).

Recommended structure:
- `src/pages/` Astro routes
- `src/components/react/` React islands
- `src/lib/` core algorithm + variable library + utilities
- `src/styles/` global styles (or a CSS framework)

---

## 2) Core domain model (TypeScript)
You want two things:
1) A canonical set of **fundamental dimensions** (basis).
2) A list of **variables** with a dimension vector in that basis.

### 2.1 Fundamental dimensions
Represent a basis as an ordered list:
- Example: `["M", "L", "T"]`
- You can allow basis customization later, but start with a small default.

### 2.2 Variables
Each variable has:
- `id` (stable UUID/string)
- `symbol` (e.g., `"F"`)
- `name` (e.g., `"Force"`)
- `dims` mapping fundamental dimension → rational exponent (often integer)
- optional metadata: units, synonyms, notes, tags, category

TypeScript types:
```ts
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
```

**Important invariant:** every variable’s `dims` should have entries for all basis dims (missing = 0).

---

## 3) The math: Buckingham Π via nullspace
Given:
- basis dimension count: `m`
- number of variables: `n`
Build the **dimension matrix** `A` of size `m × n`, where column `j` is the dimension vector of variable `j`.

A dimensionless group corresponds to an exponent vector `x ∈ ℝ^n` such that:
- `A x = 0`

So Π groups come from a **basis for the nullspace** of `A`.
- `r = rank(A)`
- `k = n - r` nullity
- each nullspace basis vector gives one Π monomial:
  - `Π = ∏_{j=1..n} v_j^{x_j}`

### 3.1 Practical computation choices
You have a few viable approaches:

**Approach A (recommended): exact rational nullspace**
- Use rational arithmetic via a small fraction library (or implement your own).
- Perform **Gauss–Jordan elimination** on `A` to RREF in rationals.
- Extract nullspace basis with free variables set to basis vectors.
- Convert basis vectors to integers by clearing denominators (LCM), then reduce by gcd.

Pros: stable, produces clean integer exponents, no numerical noise.  
Cons: more code.

**Approach B: numeric SVD/QR nullspace**
- Use a numeric linear algebra library (or write basic SVD via `ml-matrix`).
- Extract nullspace from small singular values.
- Post-process to “nice” rational approximations.

Pros: less exact math code.  
Cons: fragile for near-singular systems; rounding heuristics needed.

For a first version, do **Approach A**.

---

## 4) Implementing rational RREF + nullspace (client-side)
### 4.1 Fractions
Implement a small `Fraction`:
- numerator `p` (bigint)
- denominator `q` (bigint, positive)
- normalize by `gcd(|p|, q)`

Operations: add/sub/mul/div/neg/eq/isZero/toNumber.

### 4.2 Matrix operations
- Store `A` as `Fraction[][]` of shape `m × n`.
- Perform Gauss–Jordan elimination to RREF:
  1. pivot selection by scanning rows for non-zero
  2. swap rows
  3. scale pivot row to make pivot = 1
  4. eliminate pivot column from other rows

Track pivot columns.

### 4.3 Nullspace basis extraction
After RREF:
- pivot columns `P`
- free columns `F` (complement)
For each free column `f`:
- create `x` length `n`:
  - set `x[f] = 1`
  - set each pivot variable `x[p] = -RREF[row_of_pivot][f]`
  - other free variables 0

That yields a nullspace basis vector in fractions.
Convert to integer vector:
- L = LCM of denominators
- x_int = L * x
- reduce by gcd of numerators
- optionally normalize sign (e.g., make first nonzero positive)

### 4.4 Output formatting
- Present as:
  - exponent vector
  - Π as monomial string: `F^1 * ρ^-1 * V^-2 * L^2` etc.
- Also allow a “pretty” mode:
  - omit `^1`
  - show negative exponents as division
  - optionally sort factors: positive exponents first

---

## 5) UX: what the user should see
### 5.1 Screens / components
**/app (main tool page)**
- Left: variable table/editor
- Right: computed results
- Top: choose basis dims (or select preset: MLT, MLTΘ, etc.)
- Buttons:
  - “Add variable”
  - “Load preset set”
  - “Reset”
  - “Compute Π groups”
  - “Export / Share” (later)

**Variable table**
Columns:
- Symbol
- Name
- Dimensions (editable)
- Units (optional)
- Remove

Dimension editor options:
- compact inline like: `M^1 L^2 T^-2`
- or grid inputs: one column per fundamental dimension

**Results panel**
- Show `n`, `r`, `k`
- Show RREF (optional toggle)
- Show Π basis list (k items)
- Each Π item:
  - monomial
  - exponent vector
  - “copy”
  - “re-parameterize” (advanced)

### 5.2 Validation
- Must have at least 1 variable
- Must have consistent basis dims across variables
- Detect rank `r` and if `k=0` display “No nontrivial dimensionless groups”

---

## 6) Built-in library of standard variables
You want a starter library to load quickly. Use a JSON file in `src/lib/variables/`.

### 6.1 Suggested default basis
Start with **MLT** (mass, length, time).
Later add presets:
- MLTΘ (temperature Θ)
- MLTQI (charge/current I)
- MLTN (amount of substance N)
- luminous intensity J (rare for this app)

### 6.2 Example library (MLT)
Below are common mechanics/fluid variables with typical dimensions:

- Length `L`: `L^1`
- Time `t`: `T^1`
- Mass `m`: `M^1`
- Velocity `V`: `L^1 T^-1`
- Acceleration `a`: `L^1 T^-2`
- Force `F`: `M^1 L^1 T^-2`
- Pressure `p`: `M^1 L^-1 T^-2`
- Density `ρ`: `M^1 L^-3`
- Dynamic viscosity `μ`: `M^1 L^-1 T^-1`
- Kinematic viscosity `ν`: `L^2 T^-1`
- Surface tension `σ`: `M^1 T^-2`
- Gravity `g`: `L^1 T^-2`
- Energy `E`: `M^1 L^2 T^-2`
- Power `P`: `M^1 L^2 T^-3`

Store as:
```ts
export const presetMLT = {
  basis: ["M","L","T"],
  vars: [
    { symbol: "L", name: "Length", dims: {M:0,L:1,T:0}, units: "m" },
    { symbol: "t", name: "Time",   dims: {M:0,L:0,T:1}, units: "s" },
    { symbol: "V", name: "Velocity", dims: {M:0,L:1,T:-1}, units: "m/s" },
    { symbol: "ρ", name: "Density",  dims: {M:1,L:-3,T:0}, units: "kg/m^3" }
  ]
} as const;
```

---

## 7) Project setup (Astro + React)
### 7.1 Create the project
```bash
npm create astro@latest buckingham-pi-app
cd buckingham-pi-app
npm install
```

Choose:
- TypeScript: yes
- React: add integration

Add React:
```bash
npx astro add react
```

Optional (nice-to-have):
- eslint/prettier
- a small UI library (or just CSS)

### 7.2 File layout
```
src/
  pages/
    index.astro
    app.astro
  components/
    react/
      PiTool.tsx
      VariableTable.tsx
      DimEditor.tsx
      ResultsPanel.tsx
  lib/
    math/
      fraction.ts
      rref.ts
      nullspace.ts
      formatPi.ts
    presets/
      presetMLT.ts
      presetMLTTheta.ts
    model/
      types.ts
    storage/
      localState.ts
  styles/
    global.css
```

### 7.3 Astro page with React island
`src/pages/app.astro`
```astro
---
import PiTool from "../components/react/PiTool";
---

<html lang="en">
  <head>
    <title>Buckingham Π Tool</title>
  </head>
  <body>
    <main>
      <h1>Buckingham Π Tool</h1>
      <PiTool client:load />
    </main>
  </body>
</html>
```

---

## 8) Core algorithm module boundaries
Keep algorithm pure and testable:

- `fraction.ts`: `Fraction` + gcd/lcm helpers
- `rref.ts`: `rref(matrix)` returns `{ rref, pivotCols, rank }`
- `nullspace.ts`: `nullspaceBasis(rrefResult)` returns integer exponent vectors
- `formatPi.ts`: pretty-print `Π` monomial string

Suggested API:
```ts
export interface PiResult {
  n: number;
  m: number;
  rank: number;
  nullity: number;
  basis: string[];
  vars: { symbol: string; name: string }[];
  exponentVectors: number[][]; // each length n
}

export function buckinghamPi(basis: string[], vars: DimVar[]): PiResult;
```

---

## 9) “Nice” Π groups: heuristics that work well
Nullspace basis is not unique. You can improve readability by:

1. **Integer normalization**: clear denominators, divide by gcd.
2. **Sign normalization**: make first nonzero exponent positive.
3. **Sparsity preference (optional)**:
   - Try small integer linear combinations of basis vectors (bounded search) to reduce number of nonzero exponents.
   - This is a later enhancement; keep v1 simple.

4. **Pivot selection influence**:
   - In RREF, pivot choice influences which vars appear in the basis.
   - A UI option “prefer repeating variables” can force certain vars to be pivots by ordering columns.

Practical UI trick:
- Let user mark a subset as **repeating variables**, and reorder columns so they become pivots when possible.

---

## 10) Worked example to include in the app
### Example: Reynolds number form
Variables: `ρ, V, L, μ` with MLT basis.
- ρ: `M^1 L^-3`
- V: `L^1 T^-1`
- L: `L^1`
- μ: `M^1 L^-1 T^-1`

Expected Π group:
- `Re = ρ V L / μ`

Your algorithm should return (up to equivalent basis transforms):
- exponent vector `[1, 1, 1, -1]` (ordered `[ρ, V, L, μ]`)

---

## 11) Persistence & shareable systems
### 11.1 Local persistence (easy)
Store current state:
- basis dims
- variables list
in `localStorage` as JSON.

### 11.2 Share via URL (later)
Encode state as:
- compressed JSON in querystring (e.g., base64url + LZ-string)
or
- short ID stored in a KV store (requires backend)

---

## 12) Testing strategy
### 12.1 Unit tests for math
Add a test runner (Vitest works well in TS projects):
- `Fraction` arithmetic
- RREF correctness on known matrices
- Nullspace basis on canonical examples

Test fixtures:
- Reynolds number
- Froude number (with g)
- Drag coefficient (with force)

### 12.2 UI tests (later)
- basic interaction: add variable, edit dims, compute, copy Π string

---

## 13) “MVP first” milestone plan
### Milestone 1: UI skeleton
- Astro page
- React tool layout
- Variable CRUD
- preset loader

### Milestone 2: Exact nullspace
- Fraction
- RREF
- Nullspace basis
- Pretty formatting

### Milestone 3: UX polish
- Validation messages
- Copy buttons
- Toggle views (RREF hidden by default)
- Example gallery

### Milestone 4: “repeating variables” mode
- user selects repeating vars
- reorder columns before RREF

### Milestone 5: Sharing/persistence
- localStorage
- URL encoding

---

## 14) Implementation notes & pitfalls
- **Rank detection:** with exact rationals, rank is simply number of pivots.
- **Underdetermined basis dims:** If user includes a basis dim not used by any variable, it adds zero rows (rank unaffected) but still fine.
- **Zero variable:** disallow variable with all-zero dimension vector unless you explicitly support already-dimensionless inputs.
- **Duplicate symbols:** enforce uniqueness or auto-disambiguate.

---

## 15) Small extension ideas (after v1)
- Support multiple bases & automatic basis suggestion (detect independent dims used).
- Allow fractional exponents (rare but possible in some scaling laws).
- Provide “dimension check” for user equations.
- Export LaTeX for Π groups.
- Embed short explanations of rank/nullity for learning.

---

## 16) Definition of done (v1)
You’re “done” when a user can:
- load a preset (MLT)
- add/edit variables
- click compute
- see **k** Π groups as readable monomials
- copy a Π group
- reload and keep their system saved locally

---

## Appendix A: Sample JSON preset (copy/paste)
```json
{
  "basis": ["M","L","T"],
  "vars": [
    {"symbol":"ρ","name":"Density","dims":{"M":1,"L":-3,"T":0},"units":"kg/m^3"},
    {"symbol":"V","name":"Velocity","dims":{"M":0,"L":1,"T":-1},"units":"m/s"},
    {"symbol":"L","name":"Length","dims":{"M":0,"L":1,"T":0},"units":"m"},
    {"symbol":"μ","name":"Dynamic viscosity","dims":{"M":1,"L":-1,"T":-1},"units":"Pa·s"}
  ]
}
```
