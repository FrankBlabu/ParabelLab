# Step 09 — App Shell & Navigation

## Goal

Build the main application layout with sidebar navigation, header, and routing
to all pages. This step creates the overall structure that ties all modules
together into a cohesive application.

## Dependencies

- Step 01 (Project Setup)

## Extended Thinking Required

No.

## Design

### Layout Structure

```
┌──────────────────────────────────────────────────────┐
│  Header: "ParabelLab" Logo + Title                   │
├────────────┬─────────────────────────────────────────┤
│            │                                         │
│  Sidebar   │         Content Area                    │
│            │         (React Router Outlet)           │
│  ┌──────┐  │                                         │
│  │ Home │  │                                         │
│  ├──────┤  │                                         │
│  │ Expl.│  │                                         │
│  ├──────┤  │                                         │
│  │ Mod 1│  │                                         │
│  ├──────┤  │                                         │
│  │ Mod 2│  │                                         │
│  ├──────┤  │                                         │
│  │ Mod 3│  │                                         │
│  └──────┘  │                                         │
│            │                                         │
└────────────┴─────────────────────────────────────────┘
```

### Mobile Layout

On narrow viewports (< 768px):
- Sidebar collapses into a hamburger menu
- Full-width content area
- Bottom navigation bar as alternative (optional)

### Navigation Items (German)

| Route | Label | Icon |
|-------|-------|------|
| `/` | Startseite | 🏠 |
| `/explorer` | Parabel-Explorer | 📈 |
| `/modul/1` | Scheitelpunkt → Normal | 📝 |
| `/modul/2` | Normal → Scheitelpunkt | 📝 |
| `/modul/3` | Termumformungen | 📝 |

### Home Page

A landing page with:
- Welcome text explaining the app's purpose
- Cards linking to each module with brief description
- Visual: decorative parabola illustration or the app icon
- Quick-start suggestions based on progress (future enhancement)

## Tasks

### 9.1 Configure React Router (`src/App.tsx`)

- Set up `BrowserRouter` with routes:
  - `/` → `HomePage`
  - `/explorer` → `ExplorerPage`
  - `/modul/1` → `Module1Page`
  - `/modul/2` → `Module2Page`
  - `/modul/3` → `Module3Page`
- Use layout routes with `AppShell` as the parent layout
- 404 fallback route

### 9.2 Implement AppShell Layout (`src/layouts/AppShell.tsx`)

- Responsive sidebar + content area layout
- Header with app title and icon
- Sidebar with navigation links
- Active link highlighting
- Mobile: hamburger menu toggle

### 9.3 Implement Navigation Component

- Sidebar navigation with route links
- Active route indicator (highlight, bold, or accent color)
- Icons for each navigation item (use simple SVG icons or emoji)
- Use `NavLink` from React Router for automatic active state

### 9.4 Implement HomePage (`src/pages/HomePage.tsx`)

- Welcome heading: "Willkommen bei ParabelLab!"
- Brief description text
- Module cards with:
  - Module title
  - Short description (1-2 sentences)
  - Difficulty indicator
  - Link to the module
- App icon display

### 9.5 Styling

- Color scheme:
  - Primary: A calm blue (`#3B82F6` family) — represents math/precision
  - Accent: Warm orange (`#F59E0B` family) — highlights/CTAs
  - Success: Green (`#10B981`)
  - Error: Red (`#EF4444`)
  - Background: Light gray (`#F9FAFB`)
  - Sidebar: White with subtle border
- Typography: System font stack, clear hierarchy
- Transitions: Smooth page transitions (optional CSS transitions)

## Tests

### `tests/layouts/AppShell.test.tsx`

- **Renders navigation**: verify all navigation links are present
- **Renders outlet**: verify content area exists
- **Active link**: verify the active route is highlighted

### `tests/pages/HomePage.test.tsx`

- **Renders welcome text**: verify the heading is shown
- **Module cards**: verify all module cards are displayed
- **Navigation links**: verify cards link to correct routes

## Estimated Complexity

Low-Medium — standard SPA layout with React Router.
