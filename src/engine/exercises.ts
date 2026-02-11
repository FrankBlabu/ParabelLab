/**
 * Exercise generators
 *
 * Provides deterministic exercise generation for learning modules.
 */

import type {
  Exercise,
  ExerciseBlank,
  ExerciseStep,
  Difficulty,
  TransformationType,
} from '../types/exercise';
import type { VertexFormParams } from '../types/parabola';
import { vertexToNormal, normalToVertex } from './conversion';
import { formatNormalForm } from '../utils/formatting';

const DEFAULT_SEED = 1337;

type RandomSource = () => number;

const EASY_RANGE = { min: -5, max: 5 } as const;
const MEDIUM_A_VALUES = [-2, -1, 1, 2, 3] as const;
const HARD_FRACTIONAL_VALUES = [-4.5, -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5, 4.5] as const;

const createSeededRandom = (seed: number): RandomSource => {
  let current = seed >>> 0;
  return () => {
    current = (current * 1664525 + 1013904223) >>> 0;
    return current / 2 ** 32;
  };
};

const randomInt = (random: RandomSource, min: number, max: number): number => {
  const value = Math.floor(random() * (max - min + 1)) + min;
  return value;
};

const pickFromArray = <T>(random: RandomSource, values: readonly T[]): T => {
  const index = Math.floor(random() * values.length);
  return values[index];
};

const generateVertexParams = (random: RandomSource, difficulty: Difficulty): VertexFormParams => {
  if (difficulty === 'easy') {
    return {
      a: 1,
      d: randomInt(random, EASY_RANGE.min, EASY_RANGE.max),
      e: randomInt(random, EASY_RANGE.min, EASY_RANGE.max),
    };
  }

  if (difficulty === 'medium') {
    return {
      a: pickFromArray(random, MEDIUM_A_VALUES),
      d: randomInt(random, EASY_RANGE.min, EASY_RANGE.max),
      e: randomInt(random, EASY_RANGE.min, EASY_RANGE.max),
    };
  }

  return {
    a: pickFromArray(random, HARD_FRACTIONAL_VALUES),
    d: pickFromArray(random, HARD_FRACTIONAL_VALUES),
    e: pickFromArray(random, HARD_FRACTIONAL_VALUES),
  };
};

const createStep = (params: {
  id: string;
  instruction: string;
  explanation: string;
  template: string;
  blanks: readonly ExerciseBlank[];
  hint?: string;
}): ExerciseStep => ({
  id: params.id,
  instruction: params.instruction,
  explanation: params.explanation,
  template: params.template,
  blanks: params.blanks,
  hint: params.hint,
});

export const generateVertexToNormalExercise = (
  difficulty: Difficulty,
  seed: number = DEFAULT_SEED,
): Exercise => {
  const random = createSeededRandom(seed);
  const vertexParams = generateVertexParams(random, difficulty);
  const normalParams = vertexToNormal(vertexParams);

  const steps: ExerciseStep[] = [
    createStep({
      id: 'vertex-to-normal-b',
      instruction: 'Berechne den b-Term der Normalform.',
      explanation: 'Der b-Term ergibt sich aus b = -2 · a · d.',
      template: 'b = -2 · a · d = {b}',
      blanks: [
        {
          id: 'b',
          correctAnswer: normalParams.b,
          label: 'b',
        },
      ],
      hint: 'Setze a und d in die Formel b = -2 · a · d ein.',
    }),
    createStep({
      id: 'vertex-to-normal-c',
      instruction: 'Berechne den c-Term der Normalform.',
      explanation: 'Der c-Term ergibt sich aus c = a · d² + e.',
      template: 'c = a · d² + e = {c}',
      blanks: [
        {
          id: 'c',
          correctAnswer: normalParams.c,
          label: 'c',
        },
      ],
      hint: 'Berechne zuerst d² und multipliziere dann mit a.',
    }),
  ];

  return {
    id: `vertex-to-normal-${difficulty}`,
    title: 'Scheitelpunktform in Normalform umwandeln',
    description: 'Bestimme die Koeffizienten b und c der Normalform.',
    steps,
    parabolaParams: vertexParams,
  };
};

export const generateNormalToVertexExercise = (
  difficulty: Difficulty,
  seed: number = DEFAULT_SEED,
): Exercise => {
  const random = createSeededRandom(seed + 7);
  const vertexParams = generateVertexParams(random, difficulty);
  const normalParams = vertexToNormal(vertexParams);
  const restoredVertex = normalToVertex(normalParams);

  const steps: ExerciseStep[] = [
    createStep({
      id: 'normal-to-vertex-d',
      instruction: 'Berechne die x-Koordinate des Scheitelpunkts (d).',
      explanation: 'Der Wert d ergibt sich aus d = -b / (2a).',
      template: 'd = -b / (2a) = {d}',
      blanks: [
        {
          id: 'd',
          correctAnswer: restoredVertex.d,
          tolerance: 0.001,
          label: 'd',
        },
      ],
      hint: 'Teile -b durch 2a.',
    }),
    createStep({
      id: 'normal-to-vertex-e',
      instruction: 'Berechne die y-Koordinate des Scheitelpunkts (e).',
      explanation: 'Der Wert e ergibt sich aus e = c - b² / (4a).',
      template: 'e = c - b² / (4a) = {e}',
      blanks: [
        {
          id: 'e',
          correctAnswer: restoredVertex.e,
          tolerance: 0.001,
          label: 'e',
        },
      ],
      hint: 'Berechne b² und teile durch 4a.',
    }),
  ];

  return {
    id: `normal-to-vertex-${difficulty}`,
    title: 'Normalform in Scheitelpunktform umwandeln',
    description: 'Berechne den Scheitelpunkt aus der Normalform.',
    steps,
    parabolaParams: restoredVertex,
  };
};

/**
 * Generates a detailed vertex-to-normal form exercise with 4 pedagogical steps.
 *
 * Steps:
 * 1. Apply binomial formula: (x - d)² = x² - 2dx + d²
 * 2. Substitute back (display only, no blanks)
 * 3. Distribute factor a: ax² - 2adx + ad² + e
 * 4. Combine constant terms to get final normal form coefficients
 *
 * Handles special cases:
 * - Negative d: sign flips in binomial (x + |d|)² = x² + 2|d|x + d²
 * - a = 1: coefficient not shown explicitly in display text
 */
export const generateModule1Exercise = (
  difficulty: Difficulty,
  seed: number = DEFAULT_SEED,
): Exercise => {
  const random = createSeededRandom(seed);
  const vertexParams = generateVertexParams(random, difficulty);
  const { a, d, e } = vertexParams;
  const normalParams = vertexToNormal(vertexParams);

  // Step 1: Binomial expansion (x - d)² = x² - 2dx + d²
  // The two values the student fills in: 2|d| and d²
  const twiceAbsD = Math.abs(2 * d);
  const dSquared = d * d;

  // Determine sign inside binomial for display
  const binomialSign = d >= 0 ? '-' : '+';
  const absD = Math.abs(d);
  const binomialContent = d === 0 ? 'x' : `x ${binomialSign} ${absD}`;

  // Step 3: After distributing a: a·x² ± 2a|d|·x + a·d² + e
  const aTimesD2 = a * dSquared;

  // Step 4: Final normal form: combine a·d² + e = c
  // The student provides a, b, c of final normal form

  const steps: ExerciseStep[] = [];

  // --- Step 1: Apply the binomial formula ---
  if (d === 0) {
    // Special case: (x - 0)² = x², no blanks needed — skip to step 3
    steps.push(
      createStep({
        id: 'module1-step1',
        instruction: `Wende die binomische Formel an: (${binomialContent})² = ...`,
        explanation:
          'Da d = 0 ist, ist (x)² = x². Die binomische Formel ist hier trivial.',
        template: `(${binomialContent})² = x²`,
        blanks: [],
        hint: 'Da d = 0 ist, bleibt nur x² uebrig.',
      }),
    );
  } else {
    // Template: (x ± d)² = x² ± {twoD}x + {dSq}
    // The sign in the expansion follows the original sign
    const expansionSign = d > 0 ? '-' : '+';
    steps.push(
      createStep({
        id: 'module1-step1',
        instruction: `Wende die binomische Formel an: (${binomialContent})² = ...`,
        explanation:
          d > 0
            ? `Die 2. binomische Formel lautet: (a - b)² = a² - 2ab + b². Hier ist a = x und b = ${absD}.`
            : `Die 1. binomische Formel lautet: (a + b)² = a² + 2ab + b². Hier ist a = x und b = ${absD}.`,
        template: `(${binomialContent})² = x² ${expansionSign} {twoD}x + {dSq}`,
        blanks: [
          { id: 'twoD', correctAnswer: twiceAbsD, label: '2d' },
          { id: 'dSq', correctAnswer: dSquared, label: 'd²' },
        ],
        hint: `Berechne 2 · ${absD} und ${absD}².`,
      }),
    );
  }

  // --- Step 2: Substitute back (display only) ---
  const expandedInner =
    d === 0
      ? 'x²'
      : `x² ${d > 0 ? '-' : '+'} ${twiceAbsD}x + ${dSquared}`;
  const aPrefix = a === 1 ? '' : a === -1 ? '-' : `${a} · `;
  const eSuffix = e === 0 ? '' : e > 0 ? ` + ${e}` : ` - ${Math.abs(e)}`;

  steps.push(
    createStep({
      id: 'module1-step2',
      instruction: 'Setze das Ergebnis in die Funktionsgleichung ein.',
      explanation: `Der Ausdruck (${binomialContent})² wird durch das Ergebnis der binomischen Formel ersetzt.`,
      template: `f(x) = ${aPrefix}(${expandedInner})${eSuffix}`,
      blanks: [],
      hint: 'Dieser Schritt dient zur Uebersicht — es gibt nichts auszufuellen.',
    }),
  );

  // --- Step 3: Distribute factor a ---
  if (a === 1 && e === 0) {
    // Trivial: f(x) = x² ± 2dx + d², nothing extra to distribute
    steps.push(
      createStep({
        id: 'module1-step3',
        instruction: 'Multipliziere den Faktor a aus.',
        explanation:
          'Da a = 1 ist, aendert sich beim Ausmultiplizieren nichts.',
        template: d !== 0 ? `f(x) = x² ${d > 0 ? '-' : '+'} ${twiceAbsD}x + ${dSquared}` : 'f(x) = x²',
        blanks: [],
        hint: 'Da a = 1 ist, bleiben die Terme unveraendert.',
      }),
    );
  } else {
    // Student fills in: a·1 = a (for x² coeff), |2ad| (for x coeff), a·d² (for constant before +e)
    const absB = Math.abs(normalParams.b);
    const bSign = normalParams.b >= 0 ? '+' : '-';
    const distributeTemplate =
      d === 0
        ? `f(x) = {aCoeff}x²${eSuffix}`
        : `f(x) = {aCoeff}x² ${bSign} {bAbs}x + {ad2}${eSuffix}`;
    const distributeBlanks: ExerciseBlank[] =
      d === 0
        ? [{ id: 'aCoeff', correctAnswer: a, label: 'a' }]
        : [
            { id: 'aCoeff', correctAnswer: a, label: 'a' },
            { id: 'bAbs', correctAnswer: absB, label: '|b|' },
            { id: 'ad2', correctAnswer: aTimesD2, label: 'ad²' },
          ];

    const explanationText =
      d === 0
        ? `Multipliziere a = ${a} mit jedem Summanden: ${a} · x² und ${a} · ${dSquared}.`
        : `Multipliziere a = ${a} mit jedem Summanden: ${a} · x², ${a} · ${twiceAbsD}x und ${a} · ${dSquared}.`;

    steps.push(
      createStep({
        id: 'module1-step3',
        instruction: 'Multipliziere den Faktor a mit jedem Term in der Klammer.',
        explanation: explanationText,
        template: distributeTemplate,
        blanks: distributeBlanks,
        hint: `Multipliziere ${a} mit jedem Term einzeln.`,
      }),
    );
  }

  // --- Step 4: Combine constant terms ---
  const finalA = normalParams.a;
  const finalB = normalParams.b;
  const finalC = normalParams.c;
  const finalBSign = finalB >= 0 ? '+' : '-';
  const finalCSign = finalC >= 0 ? '+' : '-';

  if (d === 0 && e === 0) {
    // Trivial: just ax², no combining needed
    steps.push(
      createStep({
        id: 'module1-step4',
        instruction: 'Fasse die Konstanten zusammen und gib die Normalform an.',
        explanation:
          'Da d = 0 und e = 0 sind, ist die Normalform bereits f(x) = ax².',
        template: 'f(x) = {finalA}x²',
        blanks: [{ id: 'finalA', correctAnswer: finalA, label: 'a' }],
        hint: 'Hier muss nur a eingetragen werden.',
      }),
    );
  } else if (d === 0) {
    // f(x) = ax² + e → a and c
    steps.push(
      createStep({
        id: 'module1-step4',
        instruction: 'Fasse die Konstanten zusammen und gib die Normalform an.',
        explanation: `Da d = 0 ist, gibt es keinen linearen Term. Der konstante Term ist c = ${finalC}.`,
        template: `f(x) = {finalA}x² ${finalCSign} {finalCabs}`,
        blanks: [
          { id: 'finalA', correctAnswer: finalA, label: 'a' },
          { id: 'finalCabs', correctAnswer: Math.abs(finalC), label: '|c|' },
        ],
        hint: `Berechne a · d² + e = ${aTimesD2} + ${e}.`,
      }),
    );
  } else {
    steps.push(
      createStep({
        id: 'module1-step4',
        instruction:
          'Fasse die konstanten Terme zusammen und gib die Normalform an.',
        explanation: `Fasse ${aTimesD2} und ${e} zusammen: c = ${aTimesD2} + ${e} = ${finalC}. Die Normalform lautet f(x) = ${finalA}x² ${finalBSign} ${Math.abs(finalB)}x ${finalCSign} ${Math.abs(finalC)}.`,
        template: `f(x) = {finalA}x² ${finalBSign} {finalBabs}x ${finalCSign} {finalCabs}`,
        blanks: [
          { id: 'finalA', correctAnswer: finalA, label: 'a' },
          { id: 'finalBabs', correctAnswer: Math.abs(finalB), label: '|b|' },
          { id: 'finalCabs', correctAnswer: Math.abs(finalC), label: '|c|' },
        ],
        hint: `Berechne a · d² + e = ${aTimesD2} + ${e} = ${finalC}.`,
      }),
    );
  }

  return {
    id: `module1-vertex-to-normal-${difficulty}-${seed}`,
    title: 'Scheitelpunktform in Normalform umwandeln',
    description: `Wandle f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}(${binomialContent})²${eSuffix} Schritt fuer Schritt in die Normalform um.`,
    steps,
    parabolaParams: vertexParams,
  };
};

export const generateModule2Exercise = (
  difficulty: Difficulty,
  seed: number = DEFAULT_SEED,
): Exercise => {
  const random = createSeededRandom(seed);

  // Generate normal form parameters based on difficulty
  let a: number;
  let b: number;
  let c: number;

  if (difficulty === 'easy') {
    // a = 1, even b (no fractions in b/2)
    a = 1;
    b = randomInt(random, -4, 4) * 2;
    if (b === 0) b = 2; // Avoid trivial case
    c = randomInt(random, -5, 5);
  } else if (difficulty === 'medium') {
    // a = 1, any b (allows fractions)
    a = 1;
    b = randomInt(random, -7, 7);
    if (b === 0) b = randomInt(random, -3, 3);
    if (b === 0) b = 1; // Avoid b = 0
    c = randomInt(random, -8, 8);
  } else {
    // Hard: a ≠ 1, requires factoring
    a = pickFromArray(random, [-2, -1, 2, 3] as const);
    b = randomInt(random, -8, 8);
    if (b === 0) b = randomInt(random, -4, 4);
    if (b === 0) b = 1; // Avoid b = 0
    c = randomInt(random, -8, 8);
  }

  // Compute correct answers using conversion function
  const vertexParams = normalToVertex({ a, b, c });
  const { d, e } = vertexParams;

  const steps: ExerciseStep[] = [];

  // Helper function to determine sign character
  const getSignChar = (value: number): string => (value >= 0 ? '+' : '-');

  if (a === 1) {
    // 6-step simplified path for a = 1
    const bHalf = b / 2;
    const bHalfSq = bHalf * bHalf;
    const bSign = getSignChar(b);
    const bAbs = Math.abs(b);
    const binomSign = getSignChar(bHalf);
    const binomAbs = Math.abs(bHalf);
    const cSign = getSignChar(c);
    const cAbs = Math.abs(c);
    const eSign = getSignChar(e);
    const eAbs = Math.abs(e);

    // Step 1: Calculate b/2
    steps.push(
      createStep({
        id: 'module2-step1',
        instruction: 'Berechne die Hälfte des Koeffizienten vor x.',
        explanation:
          'Um die quadratische Ergänzung durchzuführen, teile b durch 2.',
        template: `b/2 = ${b}/2 = {bHalf}`,
        blanks: [
          {
            id: 'bHalf',
            correctAnswer: bHalf,
            tolerance: 0.001,
            label: 'b/2',
          },
        ],
        hint: `Teile ${b} durch 2.`,
      }),
    );

    // Step 2: Square (b/2)
    steps.push(
      createStep({
        id: 'module2-step2',
        instruction: 'Berechne das Quadrat von b/2.',
        explanation:
          'Quadriere das Ergebnis aus Schritt 1. Dies ist der Ergänzungsterm.',
        template: `(b/2)² = (${binomAbs})² = {bHalfSq}`,
        blanks: [
          {
            id: 'bHalfSq',
            correctAnswer: bHalfSq,
            tolerance: 0.001,
            label: '(b/2)²',
          },
        ],
        hint: `Berechne ${binomAbs} · ${binomAbs}.`,
      }),
    );

    // Step 3: Add and subtract
    steps.push(
      createStep({
        id: 'module2-step3',
        instruction: 'Ergänze und subtrahiere den Term gleichzeitig.',
        explanation:
          'Füge (b/2)² hinzu und subtrahiere es wieder, um den Wert der Funktion nicht zu ändern.',
        template: `f(x) = x² ${bSign} ${bAbs}x + {add} - {sub} ${cSign} ${cAbs}`,
        blanks: [
          {
            id: 'add',
            correctAnswer: bHalfSq,
            tolerance: 0.001,
            label: 'Ergänzung',
          },
          {
            id: 'sub',
            correctAnswer: bHalfSq,
            tolerance: 0.001,
            label: 'Subtraktion',
          },
        ],
        hint: `Setze ${bHalfSq} sowohl für die Addition als auch die Subtraktion ein.`,
      }),
    );

    // Step 4: Form binomial
    steps.push(
      createStep({
        id: 'module2-step4',
        instruction: 'Erkenne die binomische Formel und forme das Binom.',
        explanation: 'Die ersten drei Terme bilden ein vollständiges Quadrat.',
        template: `f(x) = (x ${binomSign} {binomValue})² - {subValue} ${cSign} ${cAbs}`,
        blanks: [
          {
            id: 'binomValue',
            correctAnswer: binomAbs,
            tolerance: 0.001,
            label: 'Binom-Wert',
          },
          {
            id: 'subValue',
            correctAnswer: bHalfSq,
            tolerance: 0.001,
            label: 'subtrahierter Wert',
          },
        ],
        hint: `x² ${bSign} ${bAbs}x + ${bHalfSq} = (x ${binomSign} ${binomAbs})²`,
      }),
    );

    // Step 5: Combine constants
    steps.push(
      createStep({
        id: 'module2-step5',
        instruction: 'Fasse die konstanten Terme zusammen.',
        explanation: `Berechne -${bHalfSq} ${cSign} ${cAbs} = ${e}.`,
        template: `f(x) = (x ${binomSign} ${binomAbs})² ${eSign} {eValue}`,
        blanks: [
          {
            id: 'eValue',
            correctAnswer: eAbs,
            tolerance: 0.001,
            label: 'e',
          },
        ],
        hint: `Berechne ${-bHalfSq} ${cSign} ${cAbs}.`,
      }),
    );

    // Step 6: Read vertex
    steps.push(
      createStep({
        id: 'module2-step6',
        instruction: 'Lies den Scheitelpunkt S(d|e) ab.',
        explanation: `Aus f(x) = (x - d)² + e folgt: d = ${d}, e = ${e}.`,
        template: `Scheitelpunkt: S({d} | {e})`,
        blanks: [
          {
            id: 'd',
            correctAnswer: d,
            tolerance: 0.001,
            label: 'd',
          },
          {
            id: 'e',
            correctAnswer: e,
            tolerance: 0.001,
            label: 'e',
          },
        ],
        hint: `Achte auf das Vorzeichen: (x ${binomSign} ${binomAbs}) bedeutet d = ${d}.`,
      }),
    );
  } else {
    // 7-step full path for a ≠ 1
    const bOverA = b / a;
    const bOverASign = getSignChar(bOverA);
    const bOverAAbs = Math.abs(bOverA);
    const cSign = getSignChar(c);
    const cAbs = Math.abs(c);

    // Step 0: Factor out a
    steps.push(
      createStep({
        id: 'module2-step0',
        instruction: 'Klammere den Faktor a aus den ersten beiden Termen aus.',
        explanation:
          'Um die quadratische Ergänzung durchzuführen, muss der Koeffizient vor x² gleich 1 sein.',
        template: `f(x) = {aFactor}(x² ${bOverASign} {bOverA}x) ${cSign} ${cAbs}`,
        blanks: [
          {
            id: 'aFactor',
            correctAnswer: a,
            label: 'a',
          },
          {
            id: 'bOverA',
            correctAnswer: bOverAAbs,
            tolerance: 0.001,
            label: 'b/a',
          },
        ],
        hint: `Klammere ${a} aus ${a}x² ${getSignChar(b)} ${Math.abs(b)}x aus.`,
      }),
    );

    // Step 1: Calculate (b/(2a))
    const bOver2a = b / (2 * a);
    const bOver2aSq = bOver2a * bOver2a;

    steps.push(
      createStep({
        id: 'module2-step1',
        instruction: 'Berechne den Ergänzungsterm (b/(2a)).',
        explanation:
          'Dies ist der Term, den wir innerhalb der Klammer hinzufügen und subtrahieren.',
        template: `b/(2a) = ${b}/(2·${a}) = {bOver2a}, (b/(2a))² = {bOver2aSq}`,
        blanks: [
          {
            id: 'bOver2a',
            correctAnswer: bOver2a,
            tolerance: 0.001,
            label: 'b/(2a)',
          },
          {
            id: 'bOver2aSq',
            correctAnswer: bOver2aSq,
            tolerance: 0.001,
            label: '(b/(2a))²',
          },
        ],
        hint: `Berechne ${b}/(2·${a}) = ${bOver2a} und quadriere das Ergebnis.`,
      }),
    );

    // Step 2: Add and subtract inside parentheses
    steps.push(
      createStep({
        id: 'module2-step2',
        instruction:
          'Ergänze und subtrahiere den Term innerhalb der Klammer.',
        explanation: `Füge ${bOver2aSq} hinzu und subtrahiere es wieder.`,
        template: `f(x) = {aFactor}(x² ${bOverASign} {bOverA}x + {add} - {sub}) ${cSign} ${cAbs}`,
        blanks: [
          {
            id: 'aFactor',
            correctAnswer: a,
            label: 'a',
          },
          {
            id: 'bOverA',
            correctAnswer: bOverAAbs,
            tolerance: 0.001,
            label: 'b/a',
          },
          {
            id: 'add',
            correctAnswer: bOver2aSq,
            tolerance: 0.001,
            label: 'Ergänzung',
          },
          {
            id: 'sub',
            correctAnswer: bOver2aSq,
            tolerance: 0.001,
            label: 'Subtraktion',
          },
        ],
        hint: `Setze ${bOver2aSq} sowohl für die Addition als auch die Subtraktion ein.`,
      }),
    );

    // Step 3: Form the binomial
    const binomSign = getSignChar(bOver2a);
    const binomAbs = Math.abs(bOver2a);

    steps.push(
      createStep({
        id: 'module2-step3',
        instruction: 'Forme die binomische Formel.',
        explanation: `Die ersten drei Terme bilden (x ${binomSign} ${binomAbs})².`,
        template: `f(x) = {aFactor}((x ${binomSign} {binomTerm})² - {bOver2aSq}) ${cSign} ${cAbs}`,
        blanks: [
          {
            id: 'aFactor',
            correctAnswer: a,
            label: 'a',
          },
          {
            id: 'binomTerm',
            correctAnswer: binomAbs,
            tolerance: 0.001,
            label: 'Binom-Term',
          },
          {
            id: 'bOver2aSq',
            correctAnswer: bOver2aSq,
            tolerance: 0.001,
            label: '(b/(2a))²',
          },
        ],
        hint: `x² ${bOverASign} ${bOverAAbs}x + ${bOver2aSq} = (x ${binomSign} ${binomAbs})²`,
      }),
    );

    // Step 4: Distribute a to subtracted term
    const aTimesBOver2aSq = a * bOver2aSq;
    const aTimesBOver2aSqAbs = Math.abs(aTimesBOver2aSq);
    const aTimesBOver2aSqSign = getSignChar(-aTimesBOver2aSq);

    steps.push(
      createStep({
        id: 'module2-step4',
        instruction: 'Multipliziere a mit dem subtrahierten Term aus.',
        explanation: `Verteile ${a} auf den Term -${bOver2aSq}.`,
        template: `f(x) = {aFactor}(x ${binomSign} {binomTerm})² ${aTimesBOver2aSqSign} {aTimes} ${cSign} ${cAbs}`,
        blanks: [
          {
            id: 'aFactor',
            correctAnswer: a,
            label: 'a',
          },
          {
            id: 'binomTerm',
            correctAnswer: binomAbs,
            tolerance: 0.001,
            label: 'Binom-Term',
          },
          {
            id: 'aTimes',
            correctAnswer: aTimesBOver2aSqAbs,
            tolerance: 0.001,
            label: 'a·(b/(2a))²',
          },
        ],
        hint: `Berechne ${a} · ${bOver2aSq}.`,
      }),
    );

    // Step 5: Combine constants
    const eSign = getSignChar(e);
    const eAbs = Math.abs(e);

    steps.push(
      createStep({
        id: 'module2-step5',
        instruction: 'Fasse die konstanten Terme zusammen.',
        explanation: `Berechne ${-aTimesBOver2aSq} ${cSign} ${cAbs} = ${e}.`,
        template: `f(x) = {aFactor}(x ${binomSign} {binomTerm})² ${eSign} {eValue}`,
        blanks: [
          {
            id: 'aFactor',
            correctAnswer: a,
            label: 'a',
          },
          {
            id: 'binomTerm',
            correctAnswer: binomAbs,
            tolerance: 0.001,
            label: 'Binom-Term',
          },
          {
            id: 'eValue',
            correctAnswer: eAbs,
            tolerance: 0.001,
            label: 'e',
          },
        ],
        hint: `Berechne ${-aTimesBOver2aSq} ${cSign} ${cAbs}.`,
      }),
    );

    // Step 6: Read vertex
    steps.push(
      createStep({
        id: 'module2-step6',
        instruction: 'Lies den Scheitelpunkt ab.',
        explanation: `Aus f(x) = a(x - d)² + e folgt: d = ${d}, e = ${e}.`,
        template: `Scheitelpunkt: S({d} | {e})`,
        blanks: [
          {
            id: 'd',
            correctAnswer: d,
            tolerance: 0.001,
            label: 'd',
          },
          {
            id: 'e',
            correctAnswer: e,
            tolerance: 0.001,
            label: 'e',
          },
        ],
        hint: `Aus f(x) = ${a}(x ${binomSign} ${binomAbs})² ${eSign} ${eAbs} folgt d = ${d}, e = ${e}.`,
      }),
    );
  }

  return {
    id: `module2-normal-to-vertex-${difficulty}-${seed}`,
    title: 'Normalform in Scheitelpunktform umwandeln',
    description: `Wandle ${formatNormalForm({ a, b, c })} in die Scheitelpunktform um.`,
    steps,
    parabolaParams: vertexParams,
  };
};


export const generateTermTransformationExercise = (
  type: TransformationType,
  seed: number = DEFAULT_SEED,
): Exercise => {
  const random = createSeededRandom(seed + 19);
  let vertexParams: VertexFormParams;
  let description = '';
  let instruction = '';
  let template = '';
  let blanks: ExerciseBlank[] = [];

  if (type === 'shift') {
    vertexParams = {
      a: 1,
      d: randomInt(random, -4, 4),
      e: randomInt(random, -4, 4),
    };
    description = 'Bestimme die Verschiebung der Parabel f(x) = x².';
    instruction = 'Gib die Werte d und e fuer die Verschiebung an.';
    template = 'g(x) = (x - {d})² + {e}';
    blanks = [
      {
        id: 'd',
        correctAnswer: vertexParams.d,
        label: 'd',
      },
      {
        id: 'e',
        correctAnswer: vertexParams.e,
        label: 'e',
      },
    ];
  } else if (type === 'stretch') {
    vertexParams = {
      a: pickFromArray(random, [2, 3, -2] as const),
      d: 0,
      e: 0,
    };
    description = 'Bestimme den Streckfaktor der Parabel f(x) = x².';
    instruction = 'Gib den Wert a fuer die Streckung an.';
    template = 'g(x) = {a}x²';
    blanks = [
      {
        id: 'a',
        correctAnswer: vertexParams.a,
        label: 'a',
      },
    ];
  } else {
    vertexParams = {
      a: pickFromArray(random, [-1, -2] as const),
      d: randomInt(random, -3, 3),
      e: 0,
    };
    description = 'Bestimme die Spiegelung an der x-Achse.';
    instruction = 'Gib den Wert a fuer die Spiegelung an.';
    template = 'g(x) = {a}(x - {d})²';
    blanks = [
      {
        id: 'a',
        correctAnswer: vertexParams.a,
        label: 'a',
      },
      {
        id: 'd',
        correctAnswer: vertexParams.d,
        label: 'd',
      },
    ];
  }

  const steps: ExerciseStep[] = [
    createStep({
      id: `term-transformation-${type}`,
      instruction,
      explanation: 'Lies die Parameter direkt aus der Funktion ab.',
      template,
      blanks,
      hint: 'Achte auf Vorzeichen und Verschiebungen.',
    }),
  ];

  return {
    id: `term-transformation-${type}`,
    title: 'Termtransformation',
    description,
    steps,
    parabolaParams: vertexParams,
  };
};
