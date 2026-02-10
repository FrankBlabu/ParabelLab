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
