# Step 08 — Module 3: Basic Term Transformations

## Goal

Implement the third learning module that covers fundamental algebraic skills
needed for working with parabolas: expanding brackets, factoring terms, and
rearranging equations. This module provides the prerequisite skills for
Modules 1 and 2.

## Dependencies

- Step 05 (Learning Module Framework)

## Extended Thinking Required

No — the exercise types are simpler and more mechanical than the conversion
modules.

## Feature Description

This module covers three categories of exercises:

### Category A: Expanding Brackets (Ausmultiplizieren)

Exercises like:
- $3(x + 2) = ▢x + ▢$
- $(x + 3)(x - 2) = x^2 + ▢x + ▢$
- $(x - 4)^2 = x^2 - ▢x + ▢$ (binomial formula)
- $2(x + 1)^2 = ▢x^2 + ▢x + ▢$

### Category B: Factoring (Faktorisieren)

Exercises like:
- $6x + 12 = ▢(x + ▢)$
- $x^2 - 4x = x(x - ▢)$
- $x^2 + 6x + 9 = (x + ▢)^2$
- $2x^2 + 8x = ▢x(x + ▢)$

### Category C: Rearranging Equations (Umstellen)

Exercises like:
- Given $f(x) = 3x + 6$, solve $f(x) = 0$: $x = ▢$
- Given $f(x) = x^2 - 9$, find zeros: $x_1 = ▢, x_2 = ▢$
- Simplify: $\frac{6x^2}{3x} = ▢x$

### Progressive Difficulty

Each category has its own difficulty progression:

| Difficulty | Category A | Category B | Category C |
|-----------|-----------|-----------|-----------|
| Easy | Simple distribution | Factor out constant | Solve linear |
| Medium | Binomial formulas | Factor quadratic | Find zeros (integer) |
| Hard | Nested brackets | Complete recognition | Multi-step |

## Tasks

### 8.1 Implement Exercise Generators

Extend `src/engine/exercises.ts` with:

- `generateExpandingExercise(difficulty: Difficulty): Exercise`
- `generateFactoringExercise(difficulty: Difficulty): Exercise`
- `generateRearrangingExercise(difficulty: Difficulty): Exercise`

Each generator creates randomized exercises within the difficulty constraints.

### 8.2 Implement Exercise Category Selector

- A tab or card-based selector allowing the student to choose between the three
  categories
- Visual indication of progress per category
- German labels:
  - "Ausmultiplizieren" (Expanding)
  - "Faktorisieren" (Factoring)
  - "Gleichungen umstellen" (Rearranging)

### 8.3 Implement Module3Page (`src/pages/Module3Page.tsx`)

- Page title: "Modul 3: Grundlegende Termumformungen"
- Category selector at the top
- Difficulty selector per category
- Exercise container from the framework
- No coordinate system needed for this module (pure algebra)
- Score display per category

### 8.4 Implement Exercise Content

For each exercise type, define:
- Step templates with blanks
- Correct answer computation
- German explanation texts
- Hint texts for common mistakes (e.g., sign errors, forgotten terms)

## Tests

### `tests/pages/Module3Page.test.tsx`

- **Renders module title**: verify page title
- **Category selector**: verify all three categories are accessible
- **Exercise loads per category**: verify exercises appear for each category
- **Correct answer**: verify positive feedback on correct input

### `tests/engine/exercises.test.ts` (extend)

- **Expanding exercise**: verify generated exercise has correct structure and
  answers
- **Factoring exercise**: verify answers, especially sign handling
- **Rearranging exercise**: verify computed solutions are correct
- **Difficulty scaling**: easy exercises use smaller numbers

## Estimated Complexity

Medium — many exercise types to implement, but each is relatively simple.
