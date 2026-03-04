import React from 'react';
import 'katex/dist/katex.min.css';
import { Matrix } from '../lib/linalg/Matrix';
import { Rational } from '../lib/linalg/Rational';
import KatexBlock from './KatexBlock';
interface PiGroupDisplayProps {
  piGroups: Matrix;
  symbols: string[];
}

const PiGroupDisplay: React.FC<PiGroupDisplayProps> = ({ piGroups, symbols }) => (
  <div className="flex flex-row justify-between col-span-1 bg-slate-200 rounded-xl py-4 px-16 items-center">
    <div className="flex flex-row justify-start font-semibold mb-4 items-center gap-2 h-full">
        <div className="text-2xl font-serif text-gray-600">Π</div>
        <div className="text-2xl text-gray-600">Groups</div>
    </div>
    <ul className="flex flex-col gap-2 justify-center bg-white border border-gray-500 p-2 px-6">
    {piGroups.data.map((group: Rational[], idx: number) => {
      // Separate terms by exponent type
      const numNormal: string[] = [];
      const numRoot: string[] = [];
      const denNormal: string[] = [];
      const denRoot: string[] = [];
      const denOther: string[] = [];
      const numOther: string[] = [];
      group.forEach((exp, i) => {
        if (!exp.equals(new Rational(0, 1))) {
          // Positive exponents
          if (exp.toNumber() > 0) {
            if (exp.denominator === 2 && exp.numerator === 1) {
              numRoot.push(symbols[i]);
            } else if (exp.denominator === 2) {
              numOther.push(`${symbols[i]}^{${exp.toString()}}`);
            } else if (exp.equals(new Rational(1, 1))) {
              numNormal.push(`${symbols[i]}`);
            } else {
              numNormal.push(`${symbols[i]}^{${exp.toString()}}`);
            }
          }
          // Negative exponents
          else if (exp.toNumber() < 0) {
            const absExp = exp.mul(new Rational(-1, 1));
            if (absExp.denominator === 2 && absExp.numerator === 1) {
              denRoot.push(symbols[i]);
            } else if (absExp.denominator === 2) {
              denOther.push(`${symbols[i]}^{${absExp.toString()}}`);
            } else if (absExp.equals(new Rational(1, 1))) {
              denNormal.push(`${symbols[i]}`);
            } else {
              denNormal.push(`${symbols[i]}^{${absExp.toString()}}`);
            }
          }
        }
      });

      // Build root part if needed
      let rootLatex = '';
      if (numRoot.length > 0 || denRoot.length > 0) {
        const rootNum = numRoot.length > 0 ? numRoot.join(' ') : '1';
        const rootDen = denRoot.length > 0 ? denRoot.join(' ') : '';
        rootLatex = rootDen
          ? `\\sqrt{\\frac{${rootNum}}{${rootDen}}}`
          : `\\sqrt{${rootNum}}`;
      }

      // Build numerator and denominator
      const numeratorParts = [
        ...(numNormal.length > 0 ? [numNormal.join(' ')] : []),
        ...(numOther.length > 0 ? [numOther.join(' ')] : []),
        ...(rootLatex ? [rootLatex] : [])
      ];
      const numerator = numeratorParts.length > 0 ? numeratorParts.join(' ') : '1';
      const denominatorParts = [
        ...(denNormal.length > 0 ? [denNormal.join(' ')] : []),
        ...(denOther.length > 0 ? [denOther.join(' ')] : [])
      ];
      const denominator = denominatorParts.length > 0 ? denominatorParts.join(' ') : null;

      // only use fraction if there's a denominator
      const latex = denominator
        ? `\\frac{${numerator}}{${denominator}}`
        : numerator;
      return (
        <li key={idx} className="mb-4">
          <KatexBlock math={`\\Pi_{${idx + 1}} = ${latex}`} />
        </li>
      );
    })}
    </ul>
  </div>
);

export default PiGroupDisplay;