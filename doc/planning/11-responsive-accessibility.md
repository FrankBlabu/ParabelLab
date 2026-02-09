# Step 11 — Responsive Design & Accessibility

## Goal

Ensure the application works well on desktop, tablet, and mobile devices, and
is accessible to all users including those using keyboard navigation or
assistive technologies.

## Dependencies

- Step 04 (Parabola Explorer)
- Step 06 (Module 1)
- Step 07 (Module 2)
- Step 08 (Module 3)
- Step 09 (App Shell & Navigation)

## Extended Thinking Required

No.

## Responsive Design

### Breakpoints

| Breakpoint | Device | Layout Changes |
|-----------|--------|---------------|
| < 640px | Mobile phone | Single column, hamburger nav, stacked controls |
| 640–1024px | Tablet | Collapsible sidebar, 2-column explorer |
| > 1024px | Desktop | Full sidebar, side-by-side explorer layout |

### Component-Specific Adaptations

#### Explorer Page
- **Desktop**: Graph (60%) + Controls (40%) side-by-side, forms below
- **Tablet**: Graph (full width), controls below graph, forms at bottom
- **Mobile**: Everything stacked vertically

#### Module Pages
- **Desktop**: Exercise + graph side-by-side
- **Tablet/Mobile**: Exercise full width, graph below (or hidden with toggle)

#### Coordinate System
- Minimum width: 300px
- On mobile: simplified grid (fewer labels) to reduce clutter
- Touch-friendly: larger tap targets for any interactive elements

#### Navigation
- **Desktop**: Persistent sidebar
- **Tablet**: Collapsible sidebar with toggle button
- **Mobile**: Hamburger menu + optional bottom tab bar

### Touch Support

- Sliders should work with touch events (native HTML range inputs do)
- Sufficient tap target sizes (minimum 44×44px per WCAG 2.1)
- No hover-dependent interactions (use focus or click instead)

## Accessibility (A11y)

### WCAG 2.1 AA Compliance Targets

#### Perceivable

- **Color contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Color not sole indicator**: Don't rely only on color for correct/incorrect
  — use icons (✓/✗) and text as well
- **Text alternatives**: SVG graph elements should have `aria-label` or
  `<title>` elements
- **Resizable text**: Layout should not break at 200% zoom

#### Operable

- **Keyboard navigation**: All interactive elements reachable via Tab/Shift+Tab
- **Focus indicators**: Visible focus rings on all interactive elements
- **Slider keyboard support**: Arrow keys change values (native `<input
  type="range">` supports this)
- **Skip to main content**: Skip link at the top of the page
- **No time limits**: No timed exercises

#### Understandable

- **Labels**: All form controls have associated `<label>` elements
- **Error identification**: Errors identified in text, not just color
- **Consistent navigation**: Same navigation structure on every page
- **Language**: `<html lang="de">` attribute set

#### Robust

- **Valid HTML**: Proper semantic structure
- **ARIA**: Use ARIA attributes where native semantics are insufficient
- **Live regions**: `aria-live="polite"` for feedback messages

### Specific ARIA Requirements

- **Sliders**: `role="slider"`, `aria-valuemin`, `aria-valuemax`,
  `aria-valuenow`, `aria-label`
- **Step indicator**: `role="progressbar"` or ordered list
- **Feedback messages**: `role="alert"` for immediate announcements
- **Graph**: `role="img"` with `aria-label` describing the parabola
  (e.g., "Parabel mit Scheitelpunkt bei S(2|3)")

## Tasks

### 11.1 Implement Responsive Layouts

- Add Tailwind responsive classes to all page layouts
- Test at all breakpoints
- Implement hamburger menu for mobile navigation

### 11.2 Implement Keyboard Navigation

- Verify Tab order throughout the application
- Add skip-to-content link
- Test all interactive elements (sliders, buttons, inputs) with keyboard

### 11.3 Add ARIA Attributes

- Add aria-labels to SVG elements
- Add role="alert" to feedback components
- Add aria-live regions for dynamic content
- Add aria-describedby for exercise instructions

### 11.4 Verify Color Contrast

- Audit all color combinations with a contrast checker
- Adjust colors if needed to meet 4.5:1 ratio
- Ensure focus indicators are visible

### 11.5 Test with Screen Reader

- Manual testing with a screen reader (e.g., NVDA, VoiceOver)
- Verify exercise flow is comprehensible without visual output
- Verify graph description is announced

### 11.6 Add `lang="de"` and Semantic HTML

- Set `<html lang="de">` in `index.html`
- Use semantic HTML: `<main>`, `<nav>`, `<aside>`, `<section>`, `<h1>`–`<h3>`
- Ensure heading hierarchy is correct

## Tests

### Automated Tests

- **Keyboard navigation test**: verify Tab moves through all interactive
  elements on the Explorer page
- **ARIA attributes**: verify critical ARIA attributes are present
  (render component, query for aria-label, role, etc.)
- **Focus management**: verify focus moves correctly after exercise interactions

### Manual Testing Checklist

- [ ] Responsive layout at 320px, 768px, 1024px, 1440px
- [ ] Touch interactions on a tablet
- [ ] Keyboard-only navigation through the entire app
- [ ] Screen reader test of key flows
- [ ] 200% browser zoom does not break layout
- [ ] Color contrast of all text elements

## Estimated Complexity

Medium — responsive design is mostly CSS, but accessibility auditing and ARIA
implementation require careful attention.
