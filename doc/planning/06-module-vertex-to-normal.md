# Step 06 — Module 1: Vertex Form to Normal Form

## Goal

Implement the first learning module that teaches students how to convert a
parabola from vertex form $f(x) = a(x - d)^2 + e$ to normal form
$f(x) = ax^2 + bx + c$ by expanding the binomial formula step by step.

## Dependencies

- Step 04 (Parabola Explorer — for the embedded coordinate system)
- Step 05 (Learning Module Framework)

## Extended Thinking Required

**Yes** — Designing a pedagogically sound step-by-step decomposition of the
binomial expansion with meaningful intermediate steps, exercise templates, and
hint texts requires careful didactic reasoning.

## Mathematical Steps

Converting $f(x) = a(x - d)^2 + e$ to normal form involves these steps:

### Step 1: Recognize the binomial formula

$$f(x) = a(x - d)^2 + e$$

The student identifies that $(x - d)^2$ is a binomial square.

### Step 2: Apply the binomial formula

$$(x - d)^2 = x^2 - 2dx + d^2$$

### Step 3: Substitute back

$$f(x) = a(x^2 - 2dx + d^2) + e$$

### Step 4: Distribute the factor $a$

$$f(x) = ax^2 - 2adx + ad^2 + e$$

### Step 5: Identify coefficients

$$a = a, \quad b = -2ad, \quad c = ad^2 + e$$

## Feature Description

### Explanation View

- Each step is shown with a clear explanation in German
- The current mathematical transformation is highlighted
- Visual arrow or animation showing the expansion
- Toggle between "mit Erklärung" (with explanation) and "ohne Erklärung"
  (without explanation) for more advanced students

### Interactive Exercise

For each generated exercise (e.g., $f(x) = 2(x - 3)^2 + 1$):

1. **Step 1**: "Wende die binomische Formel an: $(x - 3)^2 = x^2 - ▢x + ▢$"
   → Student fills in `6` and `9`
2. **Step 2**: "Setze ein: $f(x) = 2(x^2 - 6x + 9) + 1$" (shown, no input)
3. **Step 3**: "Multipliziere aus: $f(x) = ▢x^2 - ▢x + ▢ + 1$"
   → Student fills in `2`, `12`, `18`
4. **Step 4**: "Fasse zusammen: $f(x) = ▢x^2 - ▢x + ▢$"
   → Student fills in `2`, `12`, `19`

### Visualization

- A small coordinate system on the right side (or below on mobile) showing the
  parabola for context
- After completion, both forms shown side-by-side with the graph

### Difficulty Progression

- **Einfach (Easy)**: $a = 1$, small integer $d$ and $e$
  - Example: $f(x) = (x - 2)^2 + 1$
- **Mittel (Medium)**: $a \in \{-2, -1, 2, 3\}$, integer $d$ and $e$
  - Example: $f(x) = 2(x - 3)^2 - 4$
- **Schwer (Hard)**: $a$ decimal, larger $d$ and $e$
  - Example: $f(x) = 0.5(x + 4)^2 - 3$

## Tasks

### 6.1 Implement Step Definitions for Vertex→Normal

Create the step templates and correct answers for conversion exercises in
`src/engine/exercises.ts` (extend from Step 05).

- Define the step templates with placeholder positions
- Implement the answer computation for each step based on the given parameters
- Handle special cases: negative $d$ (sign flip in binomial), $a = 1$ (no
  visible coefficient)

### 6.2 Implement Explanation Content

Create German explanation texts for each step in a content file or directly in
the exercise generator:

- Step-by-step explanations with mathematical reasoning
- Hint texts for each step in case the student is stuck
- Success messages after completion

### 6.3 Implement Module1Page (`src/pages/Module1Page.tsx`)

- Page title: "Modul 1: Von der Scheitelpunktform zur Normalform"
- Brief module description explaining the goal
- Difficulty selector (Easy / Medium / Hard)
- "Neue Aufgabe" (New Exercise) button
- Exercise container from the framework
- Small coordinate system showing the current exercise's parabola
- Score/progress display (e.g., "3 von 5 Aufgaben gelöst")

### 6.4 Handle Edge Cases

- Student enters a decimal when integer is expected → accept if mathematically
  correct
- Negative answers: student must include the minus sign
- Large numbers: ensure input field width accommodates up to 4 digits

## Tests

### `tests/pages/Module1Page.test.tsx`

- **Renders module title**: verify page title is displayed
- **Difficulty selector**: verify all three difficulty levels are available
- **Exercise loads**: verify that an exercise is shown with blanks
- **Correct answer flow**: fill in correct answers, verify positive feedback
- **Incorrect answer flow**: fill in wrong answer, verify error feedback

### `tests/engine/exercises.test.ts` (extend)

- **Vertex→Normal exercise generation**: generated exercises have 4 steps
- **Answer correctness**: computed correct answers match manual calculation
- **Special case d=0**: exercise template adapts (no shift term)
- **Special case a=1**: exercise template omits coefficient

## Estimated Complexity

Medium-High — the pedagogical step decomposition and template rendering with
dynamic blanks is the most intricate part.
