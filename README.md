# ParabelLab

> Interaktive Webanwendung zum Lernen und Üben von quadratischen Funktionen
(Parabeln) für Schülerinnen und Schüler der 9. Klasse.

![](assets/icon.png)

## Features (geplant)

- **Parabel-Explorer**: Interaktive Visualisierung mit Schiebereglern für die
  Parameter der Scheitelpunktform f(x) = a(x - d)² + e
- **Modul 1**: Umrechnung von Scheitelpunktform zu Normalform (binomische Formel)
- **Modul 2**: Umrechnung von Normalform zu Scheitelpunktform (quadratische
  Ergänzung)
- **Modul 3**: Grundlegende Termumformungen (Ausmultiplizieren, Faktorisieren,
  Gleichungen umstellen)

## Technology Stack

- React + TypeScript
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Custom SVG rendering (Coordinate system / graph)
- Vitest + React Testing Library (Testing)

## Project Status

The project is currently in **active development**. The infrastructure (Step 01),
the pure-function math engine (Step 02), the SVG-based coordinate system with
parabola rendering (Step 03), and the interactive Parabola Explorer (Step 04)
are implemented. See [doc/planning/00-overview.md](doc/planning/00-overview.md)
for the detailed technical plan and implementation roadmap.

## Documentation

- [Planning Overview](doc/planning/00-overview.md) — Architecture, technology
  choices, file structure, and implementation steps
- [Step 01: Project Setup](doc/planning/01-project-setup.md)
- [Step 02: Math Engine](doc/planning/02-math-engine.md)
- [Step 03: Coordinate System](doc/planning/03-coordinate-system.md)
- [Step 04: Parabola Explorer](doc/planning/04-parabola-explorer.md)
- [Step 05: Learning Module Framework](doc/planning/05-learning-module-framework.md)
- [Step 06: Module 1 — Vertex to Normal](doc/planning/06-module-vertex-to-normal.md)
- [Step 07: Module 2 — Normal to Vertex](doc/planning/07-module-normal-to-vertex.md)
- [Step 08: Module 3 — Term Transformations](doc/planning/08-module-term-transformations.md)
- [Step 09: App Shell & Navigation](doc/planning/09-app-shell-navigation.md)
- [Step 10: Progress & Persistence](doc/planning/10-progress-persistence.md)
- [Step 11: Responsive Design & Accessibility](doc/planning/11-responsive-accessibility.md)
- [Step 12: Final Polish & Documentation](doc/planning/12-polish-documentation.md)

## License

See [LICENSE](LICENSE) for details.
