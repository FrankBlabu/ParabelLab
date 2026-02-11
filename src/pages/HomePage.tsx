import { Link } from 'react-router-dom';
import type { JSX } from 'react';

/**
 * Module card configuration
 */
interface ModuleCardData {
  /** Route path */
  readonly path: string;
  /** Module title */
  readonly title: string;
  /** Short description */
  readonly description: string;
  /** Difficulty level */
  readonly difficulty: 'Einfach' | 'Mittel' | 'Schwer';
  /** Icon (emoji) */
  readonly icon: string;
}

const modules: readonly ModuleCardData[] = [
  {
    path: '/explorer',
    title: 'Parabel-Explorer',
    description:
      'Erkunde Parabeln interaktiv und experimentiere mit den Parametern a, d und e.',
    difficulty: 'Einfach',
    icon: '📈',
  },
  {
    path: '/modul/1',
    title: 'Scheitelpunkt → Normalform',
    description:
      'Lerne, wie man die Scheitelpunktform in die Normalform umwandelt.',
    difficulty: 'Einfach',
    icon: '📝',
  },
  {
    path: '/modul/2',
    title: 'Normal → Scheitelpunkt',
    description:
      'Übe die quadratische Ergänzung, um von der Normal- zur Scheitelpunktform zu gelangen.',
    difficulty: 'Mittel',
    icon: '📝',
  },
  {
    path: '/modul/3',
    title: 'Termumformungen',
    description:
      'Trainiere grundlegende algebraische Umformungen: Ausmultiplizieren, Faktorisieren und Umstellen.',
    difficulty: 'Einfach',
    icon: '📝',
  },
] as const;

/**
 * Module Card Component
 *
 * Displays a clickable card for a single module with:
 * - Icon
 * - Title
 * - Description
 * - Difficulty indicator
 */
function ModuleCard({ module }: { readonly module: ModuleCardData }): JSX.Element {
  const difficultyColors = {
    Einfach: 'bg-green-100 text-green-800',
    Mittel: 'bg-amber-100 text-amber-800',
    Schwer: 'bg-red-100 text-red-800',
  };

  return (
    <Link
      to={module.path}
      className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl" aria-hidden="true">
          {module.icon}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{module.title}</h2>
          <p className="text-gray-600 mb-3">{module.description}</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              difficultyColors[module.difficulty]
            }`}
          >
            {module.difficulty}
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * HomePage Component
 *
 * Landing page of the ParabelLab application.
 * Displays:
 * - Welcome heading
 * - Brief description
 * - Module cards linking to all available modules
 * - App icon
 */
export default function HomePage(): JSX.Element {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <img
          src="/assets/icon.png"
          alt="ParabelLab Logo"
          className="w-24 h-24 mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Willkommen bei ParabelLab!
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          ParabelLab ist deine interaktive Lernplattform für quadratische Funktionen.
          Erkunde Parabeln, übe Umformungen zwischen Scheitelpunkt- und Normalform,
          und trainiere grundlegende algebraische Rechenregeln.
        </p>
      </div>

      {/* Module Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Wähle ein Modul:
        </h2>
        {modules.map((module) => (
          <ModuleCard key={module.path} module={module} />
        ))}
      </div>
    </div>
  );
}
