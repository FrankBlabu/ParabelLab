# Step 05 — Learning Module Framework

## Goal

Build a reusable framework for step-by-step learning modules with interactive
exercises, feedback, and progress tracking. This framework is used by all three
learning modules (Steps 06, 07, 08).

## Dependencies

- Step 01 (Project Setup)
- Step 02 (Math Engine)

## Extended Thinking Required

No.

## Design Overview

Each learning module follows the same pattern:

```
┌──────────────────────────────────────────┐
│  Module Title & Description              │
├──────────────────────────────────────────┤
│  Step Indicator   [1] [2] [3] [4] [5]   │
├──────────────────────────────────────────┤
│  Current Step: Explanation               │
│                                          │
│  Interactive Exercise Area               │
│  ┌────────────────────────────────────┐  │
│  │  f(x) = 2(x - ▢)² + ▢            │  │
│  │          [input]     [input]       │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Feedback Message                        │
│  ┌────────────────────────────────────┐  │
│  │  ✓ Richtig! / ✗ Versuche es       │  │
│  │    nochmal.                        │  │
│  └────────────────────────────────────┘  │
│                                          │
│  [Hilfe]  [Prüfen]  [Weiter →]          │
├──────────────────────────────────────────┤
│  Optional: Mini coordinate system        │
└──────────────────────────────────────────┘
```

## Tasks

### 5.1 Define Exercise Types (`src/types/exercise.ts`)

```typescript
/** A single blank (gap) in a fill-in-the-blanks exercise */
interface ExerciseBlank {
  id: string;
  correctAnswer: number;
  tolerance?: number;        // For floating-point answers
  label?: string;            // Hint text shown in placeholder
}

/** A single exercise step */
interface ExerciseStep {
  id: string;
  instruction: string;       // German text explaining this step
  explanation: string;       // Detailed explanation (shown via help)
  template: string;          // Exercise template with {blank_id} placeholders
  blanks: ExerciseBlank[];
  hint?: string;             // Optional hint shown on request
}

/** A complete exercise consisting of multiple steps */
interface Exercise {
  id: string;
  title: string;
  description: string;
  steps: ExerciseStep[];
  parabolaParams?: VertexFormParams;  // Optional: show parabola for context
}

/** Possible states for an exercise answer */
type AnswerState = 'empty' | 'correct' | 'incorrect' | 'hint-shown';
```

### 5.2 Implement Exercise Generator (`src/engine/exercises.ts`)

- `generateVertexToNormalExercise(difficulty: Difficulty): Exercise`
- `generateNormalToVertexExercise(difficulty: Difficulty): Exercise`
- `generateTermTransformationExercise(type: TransformationType): Exercise`
- Difficulty levels: `'easy' | 'medium' | 'hard'`
  - Easy: integer params, $a = 1$
  - Medium: integer params, $a \in \{-2, -1, 1, 2, 3\}$
  - Hard: decimal params, $a \in [-5, 5] \setminus \{0\}$
- Use deterministic randomness (seeded) for reproducible exercises during
  testing

### 5.3 Implement FillInBlank Component (`src/components/math/FillInBlank.tsx`)

- A styled input field embedded inline within a formula
- Props: `blank: ExerciseBlank`, `value: string`, `state: AnswerState`,
  `onChange`, `onSubmit`
- Visual states:
  - Empty: neutral border
  - Correct: green border + check icon
  - Incorrect: red border + shake animation
  - Hint shown: yellow border
- Input type: text (to allow negative numbers and decimals)
- Validate on Enter key or on button click

### 5.4 Implement StepIndicator Component (`src/components/math/StepIndicator.tsx`)

- Shows progress through exercise steps as numbered circles
- States: completed (filled), current (highlighted), upcoming (outline)
- Clickable to navigate to completed steps (review)

### 5.5 Implement FeedbackMessage Component (`src/components/ui/FeedbackMessage.tsx`)

- Displays contextual feedback:
  - Correct: "Richtig! Gut gemacht." (green, with ✓ icon)
  - Incorrect: "Leider falsch. Versuche es nochmal." (red, with ✗ icon)
  - Hint: Shows the hint text (yellow, with 💡 icon)
- Auto-dismiss after a few seconds or manual dismiss
- Accessible: uses `role="alert"` for screen readers

### 5.6 Implement useExercise Hook (`src/hooks/useExercise.ts`)

- Manages the state of a single exercise session:
  - Current step index
  - User answers per blank
  - Answer states per blank
  - Whether hint was requested
- Provides actions:
  - `submitAnswer(blankId: string, value: string): AnswerState`
  - `requestHint(): void`
  - `nextStep(): void`
  - `resetExercise(): void`
- Validates answers against correct values with tolerance

### 5.7 Implement ExerciseContainer Component

- Composes StepIndicator, exercise template with FillInBlank components,
  FeedbackMessage, and action buttons
- Accepts an `Exercise` object and renders it generically
- Handles the exercise flow: answer → validate → feedback → next step

## Tests

### `tests/components/math/FillInBlank.test.tsx`

- **Renders input**: verify the input field appears
- **Accepts input**: simulate typing, verify onChange fires
- **Correct state styling**: verify green border when state is 'correct'
- **Incorrect state styling**: verify red border when state is 'incorrect'

### `tests/hooks/useExercise.test.ts`

- **Initial state**: first step is current, no answers
- **Submit correct answer**: state becomes 'correct'
- **Submit incorrect answer**: state becomes 'incorrect'
- **Request hint**: hint flag is set
- **Next step**: advances to the next step
- **Tolerance**: answer within tolerance is accepted

### `tests/engine/exercises.test.ts`

- **Exercise generation**: generated exercises have the expected structure
- **Difficulty levels**: easy exercises use simpler parameters
- **Correct answers**: generated correct answers actually satisfy the math

## Estimated Complexity

Medium — requires careful design of the exercise data model and the generic
rendering logic.
