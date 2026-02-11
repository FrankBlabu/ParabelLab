/**
 * Tests for exercise generators
 *
 * Validates exercise structure, difficulty rules, and answer correctness.
 */

import { describe, it, expect } from 'vitest';
import {
  generateVertexToNormalExercise,
  generateNormalToVertexExercise,
  generateModule1Exercise,
  generateModule2Exercise,
  generateExpandingExercise,
  generateFactoringExercise,
  generateRearrangingExercise,
} from '../../src/engine/exercises';
import { vertexToNormal, normalToVertex } from '../../src/engine/conversion';

const findBlankAnswer = (
  steps: { readonly blanks: readonly { id: string; correctAnswer: number }[] }[],
  id: string,
): number => {
  for (const step of steps) {
    const blank = step.blanks.find((item) => item.id === id);
    if (blank) {
      return blank.correctAnswer;
    }
  }
  throw new Error(`Blank with id ${id} not found`);
};

describe('exercise generators', () => {
  /*
   * Exercises should include steps and blanks with identifiers.
   */
  it('generates exercises with steps and blanks', () => {
    const exercise = generateVertexToNormalExercise('easy');

    expect(exercise.steps.length).toBeGreaterThan(0);
    expect(exercise.steps[0].blanks.length).toBeGreaterThan(0);
  });

  /*
   * Difficulty rules should influence parameter selection.
   */
  it('applies difficulty rules for parameter generation', () => {
    const easy = generateVertexToNormalExercise('easy');
    const medium = generateVertexToNormalExercise('medium');
    const hard = generateVertexToNormalExercise('hard');

    expect(easy.parabolaParams?.a).toBe(1);
    expect([ -2, -1, 1, 2, 3 ]).toContain(medium.parabolaParams?.a);
    expect(Number.isInteger(hard.parabolaParams?.a ?? 0)).toBe(false);
  });

  /*
   * Correct answers should match the underlying parabola math.
   */
  it('produces correct answers for vertex to normal conversion', () => {
    const exercise = generateVertexToNormalExercise('medium');
    const params = exercise.parabolaParams;

    if (!params) {
      throw new Error('Missing parabola parameters for exercise');
    }

    const expectedB = -2 * params.a * params.d;
    const expectedC = params.a * params.d * params.d + params.e;
    const blankB = findBlankAnswer(exercise.steps, 'b');
    const blankC = findBlankAnswer(exercise.steps, 'c');

    expect(blankB).toBeCloseTo(expectedB);
    expect(blankC).toBeCloseTo(expectedC);
  });

  /*
   * Correct answers should match the underlying normal to vertex conversion.
   */
  it('produces correct answers for normal to vertex conversion', () => {
    const exercise = generateNormalToVertexExercise('medium');
    const params = exercise.parabolaParams;

    if (!params) {
      throw new Error('Missing parabola parameters for exercise');
    }

    const normalParams = vertexToNormal(params);
    const expectedVertex = normalToVertex(normalParams);
    const blankD = findBlankAnswer(exercise.steps, 'd');
    const blankE = findBlankAnswer(exercise.steps, 'e');

    expect(blankD).toBeCloseTo(expectedVertex.d);
    expect(blankE).toBeCloseTo(expectedVertex.e);
  });
});

describe('generateModule1Exercise', () => {
  /*
   * Module 1 exercises should have 4 steps for the binomial expansion.
   */
  it('generates exercises with 4 steps', () => {
    const exercise = generateModule1Exercise('medium');
    expect(exercise.steps).toHaveLength(4);
  });

  /*
   * Each step should have an instruction and a template.
   */
  it('every step has instruction and template', () => {
    const exercise = generateModule1Exercise('easy');
    for (const step of exercise.steps) {
      expect(step.instruction).toBeTruthy();
      expect(step.template).toBeTruthy();
    }
  });

  /*
   * Final step answers should match the correct normal form coefficients.
   */
  it('produces correct final normal form answers', () => {
    const exercise = generateModule1Exercise('medium', 42);
    const params = exercise.parabolaParams;

    if (!params) {
      throw new Error('Missing parabola parameters for exercise');
    }

    const expected = vertexToNormal(params);
    const finalA = findBlankAnswer(exercise.steps, 'finalA');
    const finalCabs = findBlankAnswer(exercise.steps, 'finalCabs');

    expect(finalA).toBeCloseTo(expected.a);
    expect(finalCabs).toBeCloseTo(Math.abs(expected.c));

    // The |b| blank only exists when d ≠ 0; avoid assuming it is always present.
    if (params.d !== 0) {
      const finalBabs = findBlankAnswer(exercise.steps, 'finalBabs');
      expect(finalBabs).toBeCloseTo(Math.abs(expected.b));
    }
  });

  /*
   * Step 1 binomial blanks should be correct: 2|d| and d².
   * These blanks only exist when d ≠ 0.
   */
  it('produces correct binomial expansion blanks', () => {
    const exercise = generateModule1Exercise('medium', 42);
    const params = exercise.parabolaParams;

    if (!params) {
      throw new Error('Missing parabola parameters for exercise');
    }

    // Only check binomial expansion blanks when d ≠ 0
    if (params.d !== 0) {
      const twoD = findBlankAnswer(exercise.steps, 'twoD');
      const dSq = findBlankAnswer(exercise.steps, 'dSq');

      expect(twoD).toBeCloseTo(Math.abs(2 * params.d));
      expect(dSq).toBeCloseTo(params.d * params.d);
    }
  });

  /*
   * Special case d=0: step 1 should have no blanks (trivial binomial).
   */
  it('handles d=0 with no binomial blanks', () => {
    // Use a seed that produces d=0; generate multiple and find one
    let exercise = generateModule1Exercise('easy', 1);
    // Force d=0 by trying seeds until we get one, or test a known behavior
    // For d=0, step 1 should have 0 blanks
    for (let s = 1; s <= 100; s++) {
      exercise = generateModule1Exercise('easy', s);
      if (exercise.parabolaParams?.d === 0) {
        break;
      }
    }

    if (exercise.parabolaParams?.d === 0) {
      expect(exercise.steps[0].blanks).toHaveLength(0);
    }
  });

  /*
   * Difficulty rules should apply to module 1 exercises.
   */
  it('applies difficulty rules', () => {
    const easy = generateModule1Exercise('easy');
    const medium = generateModule1Exercise('medium');
    const hard = generateModule1Exercise('hard');

    expect(easy.parabolaParams?.a).toBe(1);
    expect([-2, -1, 1, 2, 3]).toContain(medium.parabolaParams?.a);
    expect(Number.isInteger(hard.parabolaParams?.a ?? 0)).toBe(false);
  });

  /*
   * Step 2 (substitution) should always have no blanks (display only).
   */
  it('step 2 is display-only with no blanks', () => {
    const exercise = generateModule1Exercise('medium', 42);
    expect(exercise.steps[1].blanks).toHaveLength(0);
  });
});

describe('generateModule2Exercise', () => {
  /*
   * Module 2 exercises for a=1 should have 6 steps.
   */
  it('generates exercises with 6 steps for a=1', () => {
    const exercise = generateModule2Exercise('easy', 42);
    expect(exercise.steps).toHaveLength(6);
  });

  /*
   * Module 2 exercises for a≠1 should have 7 steps (including factoring).
   */
  it('generates exercises with 7 steps for a≠1', () => {
    const exercise = generateModule2Exercise('hard', 42);
    expect(exercise.steps).toHaveLength(7);
  });

  /*
   * Every step should have an instruction and a template.
   */
  it('every step has instruction and template', () => {
    const exercise = generateModule2Exercise('easy', 42);
    for (const step of exercise.steps) {
      expect(step.instruction).toBeTruthy();
      expect(step.template).toBeTruthy();
    }
  });

  /*
   * Final step answers should match the correct vertex form coordinates.
   * Since parabolaParams is the result of normalToVertex(), we just verify
   * that the final d and e blanks match the parabolaParams.
   */
  it('produces correct vertex coordinates matching normalToVertex', () => {
    const exercise = generateModule2Exercise('medium', 42);
    const vertexParams = exercise.parabolaParams;

    if (!vertexParams) {
      throw new Error('Missing parabola parameters for exercise');
    }

    // The exercise.parabolaParams is already the vertex form (result of normalToVertex)
    // Verify the final step blanks match these values
    const finalStep = exercise.steps[exercise.steps.length - 1];
    const dBlank = finalStep.blanks.find((b) => b.id === 'd');
    const eBlank = finalStep.blanks.find((b) => b.id === 'e');

    expect(dBlank?.correctAnswer).toBeCloseTo(vertexParams.d, 2);
    expect(eBlank?.correctAnswer).toBeCloseTo(vertexParams.e, 2);
  });

  /*
   * Easy difficulty should only use a=1.
   */
  it('easy difficulty uses a=1', () => {
    for (let seed = 1; seed <= 10; seed++) {
      const exercise = generateModule2Exercise('easy', seed);
      expect(exercise.parabolaParams?.a).toBe(1);
    }
  });

  /*
   * Easy difficulty should only use even b values.
   */
  it('easy difficulty uses even b values', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const exercise = generateModule2Exercise('easy', seed);
      // Step 1 blank "bHalf" is b/2; for even b this must be an integer
      const step1 = exercise.steps[0];
      const bHalfBlank = step1.blanks.find((bl) => bl.id === 'bHalf');
      expect(bHalfBlank).toBeTruthy();
      expect(Number.isInteger(bHalfBlank!.correctAnswer)).toBe(true);
    }
  });

  /*
   * Medium difficulty should use a=1 but any b.
   */
  it('medium difficulty uses a=1', () => {
    for (let seed = 1; seed <= 10; seed++) {
      const exercise = generateModule2Exercise('medium', seed);
      expect(exercise.parabolaParams?.a).toBe(1);
    }
  });

  /*
   * Hard difficulty should use a≠1.
   */
  it('hard difficulty uses a≠1', () => {
    for (let seed = 1; seed <= 10; seed++) {
      const exercise = generateModule2Exercise('hard', seed);
      expect(exercise.parabolaParams?.a).not.toBe(1);
    }
  });

  /*
   * The final step blanks (d and e) should match the expected vertex form.
   */
  it('final step has correct d and e blanks', () => {
    const exercise = generateModule2Exercise('medium', 100);
    const params = exercise.parabolaParams;

    if (!params) {
      throw new Error('Missing parabola parameters for exercise');
    }

    const finalStep = exercise.steps[exercise.steps.length - 1];
    const dBlank = finalStep.blanks.find((b) => b.id === 'd');
    const eBlank = finalStep.blanks.find((b) => b.id === 'e');

    expect(dBlank).toBeTruthy();
    expect(eBlank).toBeTruthy();
    expect(dBlank?.correctAnswer).toBeCloseTo(params.d, 2);
    expect(eBlank?.correctAnswer).toBeCloseTo(params.e, 2);
  });

  /*
   * Each step should have at least an instruction and explanation.
   */
  it('each step has instruction and explanation', () => {
    const exercise = generateModule2Exercise('hard', 50);
    for (const step of exercise.steps) {
      expect(step.instruction).toBeTruthy();
      expect(step.explanation).toBeTruthy();
      expect(step.instruction.length).toBeGreaterThan(0);
      expect(step.explanation.length).toBeGreaterThan(0);
    }
  });

  /*
   * The exercise should include parabola parameters for visualization.
   */
  it('includes parabola parameters for visualization', () => {
    const exercise = generateModule2Exercise('easy', 42);
    expect(exercise.parabolaParams).toBeTruthy();
    expect(exercise.parabolaParams?.a).toBeDefined();
    expect(exercise.parabolaParams?.d).toBeDefined();
    expect(exercise.parabolaParams?.e).toBeDefined();
  });
});

describe('generateExpandingExercise', () => {
  /*
   * Easy exercises should have simple distribution with one step.
   */
  it('generates easy exercises with simple distribution', () => {
    const exercise = generateExpandingExercise('easy', 42);
    expect(exercise.steps).toHaveLength(1);
    expect(exercise.steps[0].blanks).toHaveLength(2);
  });

  /*
   * Medium exercises should use binomial formulas.
   */
  it('generates medium exercises with binomial formulas', () => {
    const exercise = generateExpandingExercise('medium', 42);
    expect(exercise.steps).toHaveLength(1);
    expect(exercise.title).toContain('Ausmultiplizieren');
    expect(exercise.steps[0].blanks).toHaveLength(2);
  });

  /*
   * Hard exercises should have nested brackets with two steps.
   */
  it('generates hard exercises with nested brackets', () => {
    const exercise = generateExpandingExercise('hard', 42);
    expect(exercise.steps).toHaveLength(2);
    expect(exercise.steps[0].blanks).toHaveLength(2); // binomial step
    expect(exercise.steps[1].blanks).toHaveLength(3); // distribution step
  });

  /*
   * Each step should have instruction and explanation.
   */
  it('every step has instruction and explanation', () => {
    const exercise = generateExpandingExercise('hard', 42);
    for (const step of exercise.steps) {
      expect(step.instruction).toBeTruthy();
      expect(step.explanation).toBeTruthy();
    }
  });

  /*
   * Module 3 exercises should not include parabola parameters.
   */
  it('does not include parabola parameters', () => {
    const exercise = generateExpandingExercise('easy', 42);
    expect(exercise.parabolaParams).toBeUndefined();
  });
});

describe('generateFactoringExercise', () => {
  /*
   * Easy exercises should factor out constants.
   */
  it('generates easy exercises with constant factoring', () => {
    const exercise = generateFactoringExercise('easy', 42);
    expect(exercise.steps).toHaveLength(1);
    expect(exercise.steps[0].blanks).toHaveLength(2);
    expect(exercise.title).toContain('Faktorisieren');
  });

  /*
   * Medium exercises should factor out x from quadratics.
   */
  it('generates medium exercises with x factoring', () => {
    const exercise = generateFactoringExercise('medium', 42);
    expect(exercise.steps).toHaveLength(1);
    expect(exercise.steps[0].blanks).toHaveLength(1);
  });

  /*
   * Hard exercises should recognize binomial formulas.
   */
  it('generates hard exercises with binomial recognition', () => {
    const exercise = generateFactoringExercise('hard', 42);
    expect(exercise.steps).toHaveLength(1);
    expect(exercise.steps[0].blanks).toHaveLength(1);
    expect(exercise.description).toBeTruthy();
  });

  /*
   * Each step should have instruction and explanation.
   */
  it('every step has instruction and explanation', () => {
    const exercise = generateFactoringExercise('medium', 42);
    for (const step of exercise.steps) {
      expect(step.instruction).toBeTruthy();
      expect(step.explanation).toBeTruthy();
    }
  });

  /*
   * Module 3 exercises should not include parabola parameters.
   */
  it('does not include parabola parameters', () => {
    const exercise = generateFactoringExercise('medium', 42);
    expect(exercise.parabolaParams).toBeUndefined();
  });
});

describe('generateRearrangingExercise', () => {
  /*
   * Easy exercises should solve linear equations.
   */
  it('generates easy exercises with linear equations', () => {
    const exercise = generateRearrangingExercise('easy', 42);
    expect(exercise.steps).toHaveLength(1);
    expect(exercise.steps[0].blanks).toHaveLength(1);
    expect(exercise.title).toContain('Gleichungen umstellen');
  });

  /*
   * Medium exercises should find zeros of quadratics.
   */
  it('generates medium exercises with quadratic zeros', () => {
    const exercise = generateRearrangingExercise('medium', 42);
    expect(exercise.steps).toHaveLength(1);
    expect(exercise.steps[0].blanks).toHaveLength(2);
  });

  /*
   * Hard exercises should simplify fractions.
   */
  it('generates hard exercises with fraction simplification', () => {
    const exercise = generateRearrangingExercise('hard', 42);
    expect(exercise.steps).toHaveLength(1);
    expect(exercise.steps[0].blanks).toHaveLength(1);
  });

  /*
   * Medium difficulty zeros should be symmetric (±√c).
   */
  it('medium exercises produce symmetric zeros', () => {
    const exercise = generateRearrangingExercise('medium', 42);
    const step = exercise.steps[0];
    const x1 = step.blanks.find((b) => b.id === 'x1')?.correctAnswer;
    const x2 = step.blanks.find((b) => b.id === 'x2')?.correctAnswer;

    expect(x1).toBeDefined();
    expect(x2).toBeDefined();
    if (x1 !== undefined && x2 !== undefined) {
      expect(x1).toBeCloseTo(-x2);
    }
  });

  /*
   * Each step should have instruction and explanation.
   */
  it('every step has instruction and explanation', () => {
    const exercise = generateRearrangingExercise('hard', 42);
    for (const step of exercise.steps) {
      expect(step.instruction).toBeTruthy();
      expect(step.explanation).toBeTruthy();
    }
  });

  /*
   * Module 3 exercises should not include parabola parameters.
   */
  it('does not include parabola parameters', () => {
    const exercise = generateRearrangingExercise('easy', 42);
    expect(exercise.parabolaParams).toBeUndefined();
  });
});
