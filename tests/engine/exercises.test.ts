/**
 * Tests for exercise generators
 *
 * Validates exercise structure, difficulty rules, and answer correctness.
 */

import { describe, it, expect } from 'vitest';
import {
  generateVertexToNormalExercise,
  generateNormalToVertexExercise,
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
