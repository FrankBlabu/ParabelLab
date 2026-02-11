/**
 * Module3Page component
 *
 * Learning module page: "Grundlegende Termumformungen"
 * (Basic Term Transformations)
 *
 * Teaches students three fundamental algebraic skills:
 * - Ausmultiplizieren (Expanding brackets)
 * - Faktorisieren (Factoring)
 * - Gleichungen umstellen (Rearranging equations)
 *
 * Features:
 * - Category selector for three exercise types
 * - Difficulty selector per category
 * - "Neue Aufgabe" button to generate fresh exercises
 * - Exercise container with the step-by-step framework
 * - No parabola visualization (pure algebra)
 * - Score/progress tracking per category
 */

import { useState, useMemo, useCallback } from 'react';
import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import type { Difficulty, Module3Category } from '../types/exercise';
import {
  generateExpandingExercise,
  generateFactoringExercise,
  generateRearrangingExercise,
} from '../engine/exercises';
import ExerciseContainer from '../components/math/ExerciseContainer';
import { useProgress } from '../hooks/useProgress';

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Einfach',
  medium: 'Mittel',
  hard: 'Schwer',
};

const CATEGORY_LABELS: Record<Module3Category, string> = {
  expanding: 'Ausmultiplizieren',
  factoring: 'Faktorisieren',
  rearranging: 'Gleichungen umstellen',
};

const CATEGORY_DESCRIPTIONS: Record<Module3Category, string> = {
  expanding: 'Klammern auflösen und Terme vereinfachen',
  factoring: 'Gemeinsame Faktoren ausklammern',
  rearranging: 'Gleichungen nach x auflösen',
};

interface CategoryStats {
  solved: number;
  total: number;
}

export default function Module3Page(): JSX.Element {
  const { recordExerciseCompletion } = useProgress();
  const [category, setCategory] = useState<Module3Category>('expanding');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [seed, setSeed] = useState(1);
  const [stats, setStats] = useState<Record<Module3Category, CategoryStats>>({
    expanding: { solved: 0, total: 0 },
    factoring: { solved: 0, total: 0 },
    rearranging: { solved: 0, total: 0 },
  });

  const exercise = useMemo(() => {
    if (category === 'expanding') {
      return generateExpandingExercise(difficulty, seed);
    } else if (category === 'factoring') {
      return generateFactoringExercise(difficulty, seed);
    } else {
      return generateRearrangingExercise(difficulty, seed);
    }
  }, [category, difficulty, seed]);

  const handleNewExercise = useCallback((): void => {
    setSeed((prev) => prev + 1);
    setStats((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        total: prev[category].total + 1,
      },
    }));
  }, [category]);

  const handleExerciseComplete = useCallback((): void => {
    setStats((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        solved: prev[category].solved + 1,
      },
    }));
    // Track in persistent progress (assume first-try correct for now)
    recordExerciseCompletion('module3', difficulty, true);
  }, [category, difficulty, recordExerciseCompletion]);

  const handleCategoryChange = useCallback((newCategory: Module3Category): void => {
    setCategory(newCategory);
    setSeed((prev) => prev + 1);
  }, []);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty): void => {
    setDifficulty(newDifficulty);
    setSeed((prev) => prev + 1);
  }, []);

  const currentStats = stats[category];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 page-transition"
      data-testid="module3-page"
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
            data-testid="module3-title"
          >
            Modul 3: Grundlegende Termumformungen
          </h1>

          {/* Module description */}
          <p className="text-sm md:text-base text-gray-600 text-center max-w-2xl mx-auto">
            Übe die grundlegenden algebraischen Fertigkeiten: Ausmultiplizieren,
            Faktorisieren und Gleichungen umstellen.
          </p>
        </header>

        {/* Category Selector */}
        <div
          className="flex flex-wrap justify-center gap-3 mb-6"
          role="tablist"
          aria-label="Übungskategorie"
          data-testid="category-selector"
        >
          {(['expanding', 'factoring', 'rearranging'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={category === cat}
              onClick={() => handleCategoryChange(cat)}
              title={CATEGORY_DESCRIPTIONS[cat]}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              data-testid={`category-${cat}`}
            >
              <div className="font-semibold">{CATEGORY_LABELS[cat]}</div>
              {stats[cat].total > 0 && (
                <div className="text-xs mt-1 opacity-90">
                  {stats[cat].solved} / {stats[cat].total}
                </div>
              )}
            </button>
          ))}
        </div>

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
          {currentStats.total > 0 && (
            <div
              className="text-sm text-gray-600"
              data-testid="score-display"
            >
              {currentStats.solved} von {currentStats.total} Aufgaben geloest
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
        <ExerciseContainer
          exercise={exercise}
          onComplete={handleExerciseComplete}
        />
      </article>
    </div>
  );
}
