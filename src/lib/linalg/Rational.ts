export class Rational {
    numerator: number;
    denominator: number;

    constructor(numerator: number, denominator: number) {
        if (denominator === 0) throw new Error("Denominator cannot be zero");
        const sign = Math.sign(denominator);
        this.numerator = numerator * sign;
        this.denominator = Math.abs(denominator);
        this.reduce();
    }

    private gcd(a: number, b: number): number {
        return b === 0 ? Math.abs(a) : this.gcd(b, a % b);
    }

    private reduce() {
        const g = this.gcd(this.numerator, this.denominator);
        this.numerator /= g;
        this.denominator /= g;
    }

    add(other: Rational): Rational {
        const num = this.numerator * other.denominator + other.numerator * this.denominator;
        const denom = this.denominator * other.denominator;
        return new Rational(num, denom);
    }

    sub(other: Rational): Rational {
        const num = this.numerator * other.denominator - other.numerator * this.denominator;
        const denom = this.denominator * other.denominator;
        return new Rational(num, denom);
    }

    mul(other: Rational): Rational {
        const num = this.numerator * other.numerator;
        const denom = this.denominator * other.denominator;
        return new Rational(num, denom);
    }

    div(other: Rational): Rational {
        if (other.numerator === 0) throw new Error("Cannot divide by zero");
        const num = this.numerator * other.denominator;
        const denom = this.denominator * other.numerator;
        return new Rational(num, denom);
    }

    equals(other: Rational): boolean {
        return this.numerator === other.numerator && this.denominator === other.denominator;
    }

    toString(): string {
        return this.denominator === 1 ? `${this.numerator}` : `${this.numerator}/${this.denominator}`;
    }

    toNumber(): number {
        return this.numerator / this.denominator;
    }


}