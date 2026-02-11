/**
 * Module2Page component
 *
 * Learning module page: "Von der Normalform zur Scheitelpunktform"
 * (Normal Form to Vertex Form)
 *
 * Teaches students how to convert a parabola from normal form
 * f(x) = ax² + bx + c to vertex form f(x) = a(x - d)² + e
 * by completing the square (quadratische Ergänzung) step by step.
 *
 * Features:
 * - Difficulty selector (Einfach / Mittel / Schwer)
 * - "Neue Aufgabe" button to generate fresh exercises
 * - Exercise container with the step-by-step framework
 * - Parabola visualization (embedded in ExerciseContainer)
 * - Score/progress tracking
 */

import { useState, useMemo, useCallback } from 'react';
import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import type { Difficulty } from '../types/exercise';
import { generateModule2Exercise } from '../engine/exercises';
import ExerciseContainer from '../components/math/ExerciseContainer';
import { useProgress } from '../hooks/useProgress';

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Einfach',
  medium: 'Mittel',
  hard: 'Schwer',
};

const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  easy: 'a = 1, gerades b',
  medium: 'a = 1, beliebiges b',
  hard: 'a ≠ 1, vollständige Ergänzung',
};

export default function Module2Page(): JSX.Element {
  const { recordExerciseCompletion } = useProgress();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [seed, setSeed] = useState(1);
  const [solved, setSolved] = useState(0);
  const [total, setTotal] = useState(0);

  const exercise = useMemo(
    () => generateModule2Exercise(difficulty, seed),
    [difficulty, seed],
  );

  const handleExerciseComplete = useCallback((): void => {
    setSolved((prev) => prev + 1);
    // Track in persistent progress (assume first-try correct for now)
    recordExerciseCompletion('module2', difficulty, true);
  }, [difficulty, recordExerciseCompletion]);

  const handleNewExercise = useCallback((): void => {
    setSeed((prev) => prev + 1);
    setTotal((prev) => prev + 1);
  }, []);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty): void => {
    setDifficulty(newDifficulty);
    setSeed((prev) => prev + 1);
    setSolved(0);
    setTotal(0);
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8"
      data-testid="module2-page"
    >
      <article className="max-w-5xl mx-auto">
        {/* Navigation */}
        <nav className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium focus:outline-none focus:underline"
            data-testid="back-link"
          >
            ← Zurück zum Explorer
          </Link>
        </nav>

        {/* Page Title */}
        <header className="mb-6">
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 text-center"
            data-testid="module2-title"
          >
            Modul 2: Von der Normalform zur Scheitelpunktform
          </h1>

          {/* Module description */}
          <p className="text-sm md:text-base text-gray-600 text-center max-w-2xl mx-auto">
            Lerne Schritt fuer Schritt, wie du eine Parabel von der
            Normalform f(x) = ax² + bx + c in die Scheitelpunktform
            f(x) = a(x - d)² + e umwandelst, indem du die quadratische
            Ergaenzung anwendest.
          </p>
        </header>

        {/* Controls: Difficulty + New Exercise + Score */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Difficulty Selector */}
          <div
            className="flex gap-2"
            role="radiogroup"
            aria-label="Schwierigkeitsgrad"
            data-testid="difficulty-selector"
          >
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <button
                key={level}
                type="button"
                role="radio"
                aria-checked={difficulty === level}
                onClick={() => handleDifficultyChange(level)}
                title={DIFFICULTY_DESCRIPTIONS[level]}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  difficulty === level
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                data-testid={`difficulty-${level}`}
              >
                {DIFFICULTY_LABELS[level]}
              </button>
            ))}
          </div>

          {/* Score Display */}
          {total > 0 && (
            <div
              className="text-sm text-gray-600"
              data-testid="score-display"
            >
              {solved} von {total} Aufgaben geloest
            </div>
          )}

          {/* New Exercise Button */}
          <button
            type="button"
            onClick={handleNewExercise}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            data-testid="new-exercise-button"
          >
            Neue Aufgabe
          </button>
        </div>

        {/* Exercise */}
        <ExerciseContainer exercise={exercise} onComplete={handleExerciseComplete} />
      </article>
    </div>
  );
}
