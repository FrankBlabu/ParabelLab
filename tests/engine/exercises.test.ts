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
