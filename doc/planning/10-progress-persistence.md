# Step 10 — Progress Tracking & Persistence

## Goal

Implement a progress tracking system that saves the student's exercise results
in LocalStorage and displays progress across modules. This enables the student
to see how many exercises they have completed and resume where they left off.

## Dependencies

- Step 05 (Learning Module Framework)
- Step 06 (Module 1)
- Step 07 (Module 2)
- Step 08 (Module 3)

## Extended Thinking Required

No.

## Design

### Progress Data Model

```typescript
interface ModuleProgress {
  moduleId: string;
  exercisesCompleted: number;
  exercisesCorrectFirstTry: number;
  lastDifficulty: Difficulty;
  lastAttemptDate: string;  // ISO date string
}

interface AppProgress {
  modules: Record<string, ModuleProgress>;
  totalExercisesCompleted: number;
  firstVisitDate: string;
  lastVisitDate: string;
}
```

### Storage Strategy

- Use `localStorage` with key `parabola-progress`
- JSON serialization/deserialization
- Graceful handling of:
  - Missing or corrupted data → reset to defaults
  - Storage quota exceeded → warn the user, continue without persistence
  - Private browsing mode → works (localStorage available but may be cleared)

### Progress Display

- On the home page: overall progress summary
- In the sidebar: completion indicators per module (e.g., progress bar or
  fractional count)
- On module pages: per-module statistics

## Tasks

### 10.1 Implement Storage Utilities (`src/utils/storage.ts`)

- `loadProgress(): AppProgress`
- `saveProgress(progress: AppProgress): void`
- `resetProgress(): void`
- Type-safe serialization with runtime validation
- Error handling for corrupted data

### 10.2 Implement ProgressContext (`src/context/ProgressContext.tsx`)

- React Context providing `AppProgress` and update functions
- Provider wraps the entire app
- Auto-saves to localStorage on every update
- Provides:
  - `progress: AppProgress`
  - `recordExerciseCompletion(moduleId: string, correctFirstTry: boolean): void`
  - `resetProgress(): void`

### 10.3 Implement useProgress Hook (`src/hooks/useProgress.ts`)

- Convenience hook that consumes ProgressContext
- Provides module-specific progress: `getModuleProgress(moduleId: string)`
- Computed values: completion percentage, streak info

### 10.4 Integrate Progress into Module Pages

- After completing an exercise, call `recordExerciseCompletion`
- Display per-module stats on the module page

### 10.5 Implement Progress Summary on Home Page

- Show overall stats:
  - "Du hast bisher X Aufgaben gelöst!" (You have solved X exercises so far!)
  - Per-module completion bars
  - Last visit date
- Optional: simple achievement badges (e.g., "Erste Aufgabe gelöst!")

### 10.6 Implement Reset Functionality

- "Fortschritt zurücksetzen" (Reset Progress) button in settings/home
- Confirmation dialog before reset
- Clear localStorage and reset state

## Tests

### `tests/utils/storage.test.ts`

- **Save and load**: round-trip preserves data
- **Missing data**: returns default progress
- **Corrupted data**: returns default progress without throwing
- **Reset**: clears data

### `tests/hooks/useProgress.test.ts`

- **Initial state**: no progress recorded
- **Record completion**: updates exercise count
- **Module progress**: correct per-module tracking
- **Persistence**: survives component remount (via mocked localStorage)

## Estimated Complexity

Low-Medium — straightforward CRUD with localStorage wrapped in React Context.
