# Step 07 — Module 2: Normal Form to Vertex Form

## Goal

Implement the second learning module that teaches students how to convert a
parabola from normal form $f(x) = ax^2 + bx + c$ to vertex form
$f(x) = a(x - d)^2 + e$ using the method of completing the square
(quadratische Ergänzung).

## Dependencies

- Step 04 (Parabola Explorer)
- Step 05 (Learning Module Framework)

## Extended Thinking Required

**Yes** — Completing the square is a multi-step algebraic process that requires
careful decomposition into learnable steps. The pedagogical design of
intermediate representations and meaningful hints is complex.

## Mathematical Steps

Converting $f(x) = ax^2 + bx + c$ to vertex form ($a \neq 0$):

### Step 1: Factor out $a$ from the first two terms

$$f(x) = a\left(x^2 + \frac{b}{a}x\right) + c$$

### Step 2: Compute the completing term

The completing term is $\left(\frac{b}{2a}\right)^2 = \frac{b^2}{4a^2}$

### Step 3: Add and subtract the completing term inside the bracket

$$f(x) = a\left(x^2 + \frac{b}{a}x + \frac{b^2}{4a^2} - \frac{b^2}{4a^2}\right) + c$$

### Step 4: Form the perfect square

$$f(x) = a\left(\left(x + \frac{b}{2a}\right)^2 - \frac{b^2}{4a^2}\right) + c$$

### Step 5: Distribute $a$ to the subtracted term and simplify

$$f(x) = a\left(x + \frac{b}{2a}\right)^2 - \frac{b^2}{4a} + c$$

### Step 6: Identify vertex parameters

$$d = -\frac{b}{2a}, \quad e = c - \frac{b^2}{4a}$$

### Simplified Path (for $a = 1$)

When $a = 1$, the process simplifies:

1. $f(x) = x^2 + bx + c$
2. Completing term: $\left(\frac{b}{2}\right)^2$
3. $f(x) = \left(x + \frac{b}{2}\right)^2 - \left(\frac{b}{2}\right)^2 + c$
4. $f(x) = (x - d)^2 + e$

## Feature Description

### Explanation View

- Step-by-step walkthrough of completing the square
- Emphasis on the core idea: "We want to create a perfect square"
- Visual highlighting of the terms being added/subtracted
- For $a = 1$ exercises, use the simplified path
- For $a \neq 1$, show the full path with factoring

### Interactive Exercise

For an easy example ($f(x) = x^2 + 6x + 5$):

1. **Step 1**: "Bestimme die halbe Zahl vor x: $\frac{b}{2} = \frac{6}{2} = ▢$"
   → Student fills in `3`
2. **Step 2**: "Berechne das Quadrat: $\left(\frac{b}{2}\right)^2 = 3^2 = ▢$"
   → Student fills in `9`
3. **Step 3**: "Ergänze und subtrahiere: $f(x) = (x^2 + 6x + ▢) - ▢ + 5$"
   → Student fills in `9` and `9`
4. **Step 4**: "Erkenne das Binom: $f(x) = (x + ▢)^2 - ▢ + 5$"
   → Student fills in `3` and `9`
5. **Step 5**: "Fasse zusammen: $f(x) = (x + ▢)^2 + ▢$"
   → Student fills in `3` and `-4`
6. **Step 6**: "Scheitelpunkt ablesen: $S(▢|▢)$"
   → Student fills in `-3` and `-4`

### Difficulty Progression

- **Einfach (Easy)**: $a = 1$, $b$ even, small values
  - Example: $f(x) = x^2 + 4x + 1$
- **Mittel (Medium)**: $a = 1$, $b$ odd or larger values
  - Example: $f(x) = x^2 - 5x + 3$
- **Schwer (Hard)**: $a \neq 1$, requires factoring
  - Example: $f(x) = 2x^2 + 8x + 3$

## Tasks

### 7.1 Implement Step Definitions for Normal→Vertex

Create the step templates and correct answers for completing-the-square
exercises in `src/engine/exercises.ts` (extend from Step 05).

- Define separate step templates for $a = 1$ and $a \neq 1$ cases
- Implement answer computation for each step
- Handle sign variations correctly (positive/negative $b$)

### 7.2 Implement Explanation Content

- German explanation texts for each step
- Emphasize the "why" behind completing the square
- Hint texts for common mistakes:
  - Forgetting to subtract the completing term
  - Sign error when forming $(x + \frac{b}{2a})^2$
  - Forgetting to distribute $a$ in the final step

### 7.3 Implement Module2Page (`src/pages/Module2Page.tsx`)

- Page title: "Modul 2: Von der Normalform zur Scheitelpunktform"
- Similar layout to Module 1
- Difficulty selector
- "Neue Aufgabe" (New Exercise) button
- Exercise container with step-by-step guide
- Optional: visualization of the "completing the square" geometrically

### 7.4 Handle Edge Cases

- Odd $b$ with $a = 1$: results in fractions — may be confusing for easy
  difficulty; ensure easy exercises use even $b$
- $b = 0$: the completing term is 0 — simplify the exercise flow
- Negative $a$: factoring out a negative — requires extra care in step 1

## Tests

### `tests/pages/Module2Page.test.tsx`

- **Renders module title**: verify page title
- **Exercise structure**: verify the exercise has the expected number of steps
  for the selected difficulty
- **Correct answer flow**: step through the exercise with correct answers
- **Sign handling**: test with negative $b$ values

### `tests/engine/exercises.test.ts` (extend)

- **Normal→Vertex exercise generation**: structure is correct
- **Easy exercises**: $a = 1$ and $b$ is even
- **Hard exercises**: $a \neq 1$
- **Round-trip correctness**: vertex form from exercise matches direct conversion

## Estimated Complexity

High — completing the square has more steps than vertex→normal conversion, and
the pedagogical decomposition must handle the $a = 1$ vs. $a \neq 1$ cases
separately.
