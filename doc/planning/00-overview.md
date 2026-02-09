# ParabelLab — Planning Overview

## Project Description

ParabelLab is an interactive web application for supporting math education. The
target audience is a 9th-grade student learning about quadratic functions
(parabolas). The application aims to promote understanding of parabolas in
different representation forms through playful and visual interaction.

## Mathematical Scope

The application covers the following mathematical concepts:

1. **Normal form**: $f(x) = ax^2 + bx + c$
2. **Vertex form**: $f(x) = a(x - d)^2 + e$, where $S(d|e)$ is the vertex
3. **Conversion between forms**:
   - From vertex form to normal form: expanding the binomial formula
   - From normal form to vertex form: completing the square

## Technology Decisions

### Frontend Framework: React + TypeScript

**Rationale:**
- Component-based architecture maps well to the modular feature set (explorer,
  learning modules, exercises)
- TypeScript provides type safety for mathematical calculations and state
  management
- Rich ecosystem for UI components and testing
- Excellent developer experience with hot-reload and tooling

### Build Tool: Vite

**Rationale:**
- Fast development server with HMR
- Built-in TypeScript support
- Optimized production builds
- Native ESM support

### Visualization: Custom SVG Rendering

**Rationale:**
- Full control over coordinate system appearance and interactivity
- SVG elements are DOM nodes — accessible and interactive by design
- React can directly manage SVG elements via JSX
- No external dependency overhead for a focused use case (parabolas only)
- Better accessibility compared to Canvas (screen readers can access SVG content)

### Styling: Tailwind CSS

**Rationale:**
- Utility-first approach enables rapid UI development
- Built-in responsive design utilities
- Consistent design system through configuration
- Small production bundle through purging unused styles

### Testing: Vitest + React Testing Library

**Rationale:**
- Vitest integrates seamlessly with Vite
- React Testing Library encourages testing user behavior over implementation
- jsdom environment for component rendering tests
- Fast test execution with watch mode

### Routing: React Router

**Rationale:**
- De facto standard for React SPAs
- Declarative routing matches the modular page structure
- Supports nested layouts for the app shell

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        App Shell                            │
│  ┌───────────┐  ┌─────────────────────────────────────────┐ │
│  │           │  │              Content Area                │ │
│  │   Side    │  │  ┌─────────────────────────────────────┐ │ │
│  │   Nav     │  │  │     Parabola Explorer               │ │ │
│  │           │  │  │  ┌────────────┐  ┌───────────────┐  │ │ │
│  │  • Home   │  │  │  │ Coordinate │  │  Parameter    │  │ │ │
│  │  • Expl.  │  │  │  │  System    │  │  Controls     │  │ │ │
│  │  • Mod 1  │  │  │  │  + Graph   │  │  (Sliders)    │  │ │ │
│  │  • Mod 2  │  │  │  └────────────┘  └───────────────┘  │ │ │
│  │  • Mod 3  │  │  │  ┌────────────────────────────────┐  │ │ │
│  │           │  │  │  │  Form Display (both forms)     │  │ │ │
│  │           │  │  │  └────────────────────────────────┘  │ │ │
│  │           │  │  └─────────────────────────────────────┘ │ │
│  │           │  │                                         │ │
│  │           │  │  ┌─────────────────────────────────────┐ │ │
│  │           │  │  │     Learning Modules                │ │ │
│  │           │  │  │  ┌──────────┐ ┌──────────────────┐  │ │ │
│  │           │  │  │  │ Step-by- │ │    Interactive   │  │ │ │
│  │           │  │  │  │ step     │ │    Exercises     │  │ │ │
│  │           │  │  │  │ Guide    │ │    (Fill-in)     │  │ │ │
│  │           │  │  │  └──────────┘ └──────────────────┘  │ │ │
│  │           │  │  └─────────────────────────────────────┘ │ │
│  └───────────┘  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── AppShell (Layout)
│   ├── Navigation (Sidebar)
│   └── ContentArea (Outlet)
│       ├── HomePage
│       ├── ExplorerPage
│       │   ├── CoordinateSystem (SVG)
│       │   │   ├── Grid
│       │   │   ├── Axes
│       │   │   ├── ParabolaCurve
│       │   │   └── VertexMarker
│       │   ├── ParameterControls
│       │   │   ├── SliderControl (a)
│       │   │   ├── SliderControl (d)
│       │   │   └── SliderControl (e)
│       │   └── FormDisplay
│       │       ├── VertexFormDisplay
│       │       └── NormalFormDisplay
│       ├── Module1Page (Vertex → Normal)
│       │   ├── StepByStepGuide
│       │   ├── ExerciseContainer
│       │   │   ├── ExercisePrompt
│       │   │   ├── FillInBlanks
│       │   │   └── FeedbackDisplay
│       │   └── CoordinateSystem (read-only)
│       ├── Module2Page (Normal → Vertex)
│       │   ├── StepByStepGuide
│       │   ├── ExerciseContainer
│       │   └── CoordinateSystem (read-only)
│       └── Module3Page (Term Transformations)
│           ├── ExerciseSelector
│           └── ExerciseContainer
├── ProgressProvider (Context)
└── ThemeProvider
```

### Data Flow

```
User Input (Sliders/Exercises)
        │
        ▼
  React State (useState/useReducer)
        │
        ├──▶ Math Engine (pure functions)
        │         │
        │         ▼
        │    Computed Values (coefficients, vertex, points)
        │         │
        ▼         ▼
  UI Components ◀─── SVG Rendering
        │
        ▼
  LocalStorage (Progress Persistence)
```

### State Management Strategy

- **Component-local state** (`useState`) for UI interactions (slider positions,
  form inputs, active step)
- **React Context** for cross-cutting concerns (progress tracking, theme)
- **Derived state** computed via the math engine (pure functions — no
  duplication of state)
- **LocalStorage** for persistence of exercise progress and scores

## Design Principles

1. **Didactically valuable**: Every feature serves a clear learning purpose
2. **Visually appealing**: Colors and animations to clarify mathematical concepts
3. **Error-tolerant**: Constructive feedback instead of punishment for wrong answers
4. **Self-directed learning**: Students can work at their own pace
5. **Progressive complexity**: From simple to complex

## UI Language & Code Language

- **UI text**: German (target audience is a German 9th-grader)
- **Code**: English (variable names, function names, comments, documentation)

## Implementation Steps

The implementation is divided into the following steps. Each step is described
in a separate markdown file in this directory.

| Step | File | Title | Dependencies | Extended Thinking |
|------|------|-------|-------------|-------------------|
| 01 | [01-project-setup.md](01-project-setup.md) | Project Setup & Infrastructure | — | No |
| 02 | [02-math-engine.md](02-math-engine.md) | Math Engine | 01 | Yes |
| 03 | [03-coordinate-system.md](03-coordinate-system.md) | Coordinate System & Parabola Rendering | 01 | Yes |
| 04 | [04-parabola-explorer.md](04-parabola-explorer.md) | Interactive Parabola Explorer | 02, 03 | No |
| 05 | [05-learning-module-framework.md](05-learning-module-framework.md) | Learning Module Framework | 01, 02 | No |
| 06 | [06-module-vertex-to-normal.md](06-module-vertex-to-normal.md) | Module 1: Vertex to Normal Form | 04, 05 | Yes |
| 07 | [07-module-normal-to-vertex.md](07-module-normal-to-vertex.md) | Module 2: Normal to Vertex Form | 04, 05 | Yes |
| 08 | [08-module-term-transformations.md](08-module-term-transformations.md) | Module 3: Basic Term Transformations | 05 | No |
| 09 | [09-app-shell-navigation.md](09-app-shell-navigation.md) | App Shell & Navigation | 01 | No |
| 10 | [10-progress-persistence.md](10-progress-persistence.md) | Progress Tracking & Persistence | 05, 06, 07, 08 | No |
| 11 | [11-responsive-accessibility.md](11-responsive-accessibility.md) | Responsive Design & Accessibility | 04, 06, 07, 08, 09 | No |
| 12 | [12-polish-documentation.md](12-polish-documentation.md) | Final Polish & Documentation | All | No |

### Dependency Graph

```
01 Project Setup
├──▶ 02 Math Engine
├──▶ 03 Coordinate System
├──▶ 05 Learning Module Framework
└──▶ 09 App Shell & Navigation

02 Math Engine ──┐
03 Coord System ─┴──▶ 04 Parabola Explorer

02 Math Engine ──┐
01 Project Setup ┴──▶ 05 Learning Module Framework

04 Parabola Explorer ──┐
05 Module Framework ───┴──▶ 06 Module 1: Vertex → Normal
                       ├──▶ 07 Module 2: Normal → Vertex
                       └──▶ 08 Module 3: Term Transformations

05, 06, 07, 08 ──▶ 10 Progress Tracking
04, 06–09      ──▶ 11 Responsive & A11y
All            ──▶ 12 Final Polish
```

## Proposed File Structure

```
ParabelLab/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                    # Application entry point
│   ├── App.tsx                     # Root component with routing
│   ├── index.css                   # Global styles / Tailwind imports
│   ├── components/                 # Shared, reusable components
│   │   ├── ui/                     # Generic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Card.tsx
│   │   │   └── FeedbackMessage.tsx
│   │   ├── math/                   # Math-related display components
│   │   │   ├── FormulaDisplay.tsx
│   │   │   ├── FillInBlank.tsx
│   │   │   └── StepIndicator.tsx
│   │   └── graph/                  # Coordinate system components
│   │       ├── CoordinateSystem.tsx
│   │       ├── Grid.tsx
│   │       ├── Axes.tsx
│   │       ├── ParabolaCurve.tsx
│   │       └── VertexMarker.tsx
│   ├── pages/                      # Route-level page components
│   │   ├── HomePage.tsx
│   │   ├── ExplorerPage.tsx
│   │   ├── Module1Page.tsx
│   │   ├── Module2Page.tsx
│   │   └── Module3Page.tsx
│   ├── engine/                     # Pure math functions (no React)
│   │   ├── parabola.ts             # Parabola calculations
│   │   ├── conversion.ts           # Form conversions
│   │   ├── validation.ts           # Input validation
│   │   └── exercises.ts            # Exercise generation
│   ├── hooks/                      # Custom React hooks
│   │   ├── useParabola.ts          # Parabola state management
│   │   ├── useExercise.ts          # Exercise flow management
│   │   └── useProgress.ts          # Progress tracking hook
│   ├── context/                    # React Contexts
│   │   └── ProgressContext.tsx
│   ├── types/                      # Shared TypeScript types
│   │   ├── parabola.ts             # Parabola-related types
│   │   ├── exercise.ts             # Exercise-related types
│   │   └── progress.ts             # Progress-related types
│   ├── utils/                      # Utility functions
│   │   ├── formatting.ts           # Number/equation formatting
│   │   └── storage.ts              # LocalStorage utilities
│   └── layouts/                    # Layout components
│       └── AppShell.tsx
├── tests/                          # Test files (mirrors src/ structure)
│   ├── engine/
│   │   ├── parabola.test.ts
│   │   ├── conversion.test.ts
│   │   └── exercises.test.ts
│   ├── components/
│   │   ├── graph/
│   │   │   └── CoordinateSystem.test.tsx
│   │   └── math/
│   │       └── FillInBlank.test.tsx
│   ├── pages/
│   │   ├── ExplorerPage.test.tsx
│   │   └── Module1Page.test.tsx
│   └── hooks/
│       └── useProgress.test.ts
├── doc/
│   └── planning/                   # This planning directory
├── index.html                      # Vite HTML entry
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.js
└── .prettierrc
```

## Code Style & Conventions

- **Naming**: PascalCase for components/types, camelCase for functions/variables
- **File naming**: PascalCase for React components, camelCase for utilities
- **Exports**: Named exports preferred (no default exports except pages)
- **Components**: Functional components with React hooks only
- **State**: Immutable updates, derived state via pure functions
- **Math precision**: Use `Number.EPSILON` for floating-point comparisons
- **i18n**: All user-facing text in German, hardcoded (no i18n framework needed
  for single-language app)
