# Parabola

> Interaktive Webanwendung zum Lernen und Üben von quadratischen Funktionen
(Parabeln) für Schülerinnen und Schüler der 9. Klasse.

![Parabola Logo](assets/icon.png)

## 🎯 Über das Projekt

Parabola ist eine browserbasierte, interaktive Lernplattform für quadratische Funktionen. Die Anwendung richtet sich an Schülerinnen und Schüler der 9. Klasse und hilft ihnen, das Konzept von Parabeln zu verstehen sowie die Umrechnung zwischen verschiedenen Darstellungsformen zu üben.

### Features

- ✨ **Parabel-Explorer**: Interaktive Visualisierung mit Schiebereglern für die Parameter der Scheitelpunktform `f(x) = a(x - d)² + e`
- 📝 **Modul 1**: Umrechnung von Scheitelpunktform zu Normalform (binomische Formel)
- 📝 **Modul 2**: Umrechnung von Normalform zu Scheitelpunktform (quadratische Ergänzung)
- 📝 **Modul 3**: Grundlegende Termumformungen (Ausmultiplizieren, Faktorisieren, Gleichungen umstellen)
- 💾 **Fortschritts-Tracking**: Automatisches Speichern des Lernfortschritts im Browser
- 📱 **Responsive Design**: Optimiert für Desktop, Tablet und Smartphone
- ♿ **Barrierefreiheit**: WCAG-konforme Bedienelemente und Tastaturnavigation

## 🚀 Schnellstart

### Voraussetzungen

- [Node.js](https://nodejs.org/) (Version 18 oder höher)
- npm (wird mit Node.js installiert)
- Ein moderner Webbrowser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Repository klonen
git clone https://github.com/FrankBlabu/ParabelLab.git
cd ParabelLab

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter [http://localhost:5173](http://localhost:5173) erreichbar.

### Verfügbare Skripte

```bash
# Web Development
npm run dev           # Startet den Entwicklungsserver mit Hot-Reload
npm run build         # Erstellt einen optimierten Production-Build
npm run preview       # Zeigt den Production-Build lokal an

# Desktop App Development
npm run dev:electron  # Startet die Electron-App im Development-Modus
npm run build:electron  # Erstellt Desktop-App für aktuelles System
npm run build:linux   # Erstellt Linux AppImage und .deb
npm run build:win     # Erstellt Windows Installer und Portable
npm run build:mac     # Erstellt macOS .dmg und .zip

# Quality Checks
npm run lint          # Führt ESLint-Prüfungen durch
npm run typecheck     # Führt TypeScript-Typprüfung durch
npm run test          # Führt alle Tests aus (Vitest)
npm run test:ui       # Öffnet die Vitest UI
```

### VSCode Tasks

Im Projekt sind VSCode Tasks für häufige Workflows vordefiniert:

- **Dev**: Startet den Entwicklungsserver
- **Build**: Erstellt einen Production-Build
- **Checks**: Führt Lint-Prüfungen durch
- **Test**: Führt alle Tests aus

Tasks können über die Command Palette (`Ctrl+Shift+P` → "Tasks: Run Task") gestartet werden.

## 🏗️ Architektur

### Technology Stack

- **Framework**: React 18 mit TypeScript
- **Build Tool**: Vite
- **Desktop**: Electron (für standalone Deployment)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + TypeScript

### Projektstruktur

```
Parabola/
├── src/
│   ├── components/      # React-Komponenten
│   │   ├── graph/       # Koordinatensystem und Parabel-Darstellung
│   │   ├── math/        # Mathematische UI-Komponenten
│   │   └── ui/          # Generische UI-Komponenten
│   ├── context/         # React Context (z.B. ProgressContext)
│   ├── engine/          # Mathematische Logik (pure functions)
│   ├── hooks/           # Custom React Hooks
│   ├── layouts/         # Layout-Komponenten (AppShell, Sidebar)
│   ├── pages/           # Seiten-Komponenten
│   ├── types/           # TypeScript-Typdefinitionen
│   └── utils/           # Hilfsfunktionen
├── electron/            # Electron main process für Desktop-App
├── tests/               # Tests (Mirror-Struktur zu src/)
├── doc/                 # Projektdokumentation
│   ├── planning/        # Technische Planungsdokumente
│   └── BENUTZERHANDBUCH.md  # Anleitung für Schüler und Lehrkräfte
└── assets/              # Statische Assets (Bilder, Icons)
```

### Komponenten-Hierarchie

```
App (ErrorBoundary + ProgressProvider)
└── Router
    └── AppShell (Header + Sidebar + Outlet)
        ├── HomePage
        ├── ExplorerPage
        ├── Module1Page
        ├── Module2Page
        └── Module3Page
```

### Datenfluss

1. **Math Engine** (`src/engine/`): Pure functions für mathematische Berechnungen
   - Keine React-Abhängigkeiten
   - Vollständig getestet
   - Typsicher

2. **Custom Hooks** (`src/hooks/`): State Management und Business Logic
   - `useParabola`: Verwaltet Parabel-Parameter und Konvertierung
   - `useExercise`: Steuert den Aufgaben-Workflow
   - `useProgress`: Persistiert Lernfortschritt

3. **Context** (`src/context/`): Globaler Zustand
   - `ProgressContext`: App-weites Fortschritts-Tracking

4. **Components**: Präsentationsschicht
   - Erhalten Props von Hooks
   - Rein deklarativ

## 🧪 Tests

Das Projekt hat eine umfassende Test-Suite:

```bash
# Alle Tests ausführen
npm run test

# Tests im Watch-Modus
npm run test -- --watch

# Test-Coverage anzeigen
npm run test -- --coverage

# UI-Tests mit Vitest UI
npm run test:ui
```

### Test-Struktur

- **Unit Tests**: Engine-Funktionen, Utilities, Hooks
- **Component Tests**: React-Komponenten mit React Testing Library
- **Integration Tests**: Komplette Workflows (z.B. Aufgaben lösen)

Alle Tests befinden sich in `tests/` und spiegeln die Struktur von `src/` wider.

## 🎨 Styling-Konventionen

- **Tailwind CSS**: Utility-First-Ansatz für schnelles Styling
- **Responsive Design**: Mobile-First mit Breakpoints (`sm:`, `md:`, `lg:`)
- **Barrierefreiheit**: Fokus-Indikatoren, ARIA-Labels, semantisches HTML
- **Farbpalette**: 
  - Primär: Blau (`blue-600`)
  - Erfolg: Grün (`green-600`)
  - Fehler: Rot (`red-600`)
  - Warnung: Gelb/Amber (`amber-600`)

## 🤝 Beitragen

Beiträge sind willkommen! Bitte beachte folgende Richtlinien:

### Code-Stil

- **TypeScript**: Alle neuen Dateien müssen TypeScript verwenden
- **Typsicherheit**: Keine `any`-Types, alle Funktionen vollständig typisiert
- **Readonly**: Verwende `readonly` für unveränderliche Daten
- **Kommentare**: JSDoc-Kommentare für alle exportierten Funktionen/Komponenten
- **Formatierung**: ESLint-Regeln müssen eingehalten werden (`npm run lint`)

### Testing

- **Neue Features**: Müssen Tests enthalten
- **Bug-Fixes**: Sollten Regressions-Tests enthalten
- **Test-Quality**: Tests müssen isoliert und deterministisch sein
- **Coverage**: Kritische Pfade müssen getestet sein

### Pull Request Prozess

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/neue-funktion`)
3. Implementiere die Änderung mit Tests
4. Stelle sicher, dass alle Tests und Checks durchlaufen:
   ```bash
   npm run lint    # Keine ESLint-Fehler
   npm run test    # Alle Tests grün
   npm run build   # Build erfolgreich
   ```
5. Committe die Änderungen mit aussagekräftiger Commit-Message
6. Pushe den Branch und öffne einen Pull Request

## 📚 Dokumentation

### Für Benutzer

- [Benutzerhandbuch](doc/BENUTZERHANDBUCH.md) — Anleitung für Schüler, Eltern und Lehrkräfte

### Für Administratoren

- [Deployment-Anleitung](doc/DEPLOYMENT.md) — Desktop-App und Web-Deployment

### Für Entwickler

- [00 - Überblick](doc/planning/00-overview.md) — Architektur, Technologie-Entscheidungen, Roadmap
- [01 - Project Setup](doc/planning/01-project-setup.md)
- [02 - Math Engine](doc/planning/02-math-engine.md)
- [03 - Coordinate System](doc/planning/03-coordinate-system.md)
- [04 - Parabola Explorer](doc/planning/04-parabola-explorer.md)
- [05 - Learning Module Framework](doc/planning/05-learning-module-framework.md)
- [06 - Module 1: Vertex to Normal](doc/planning/06-module-vertex-to-normal.md)
- [07 - Module 2: Normal to Vertex](doc/planning/07-module-normal-to-vertex.md)
- [08 - Module 3: Term Transformations](doc/planning/08-module-term-transformations.md)
- [09 - App Shell & Navigation](doc/planning/09-app-shell-navigation.md)
- [10 - Progress & Persistence](doc/planning/10-progress-persistence.md)
- [11 - Responsive Design & Accessibility](doc/planning/11-responsive-accessibility.md)
- [12 - Final Polish & Documentation](doc/planning/12-polish-documentation.md)
- [LEARNINGS.md](LEARNINGS.md) — Erkenntnisse aus der Entwicklung

### API-Dokumentation

Die wichtigsten Module sind inline dokumentiert. Hier ein Überblick:

#### Math Engine (`src/engine/`)

- **parabola.ts**: Kernfunktionen für Parabel-Berechnungen
  - `computeVertex(a, b, c)`: Berechnet Scheitelpunkt aus Normalform
  - `computeZeros(a, b, c)`: Berechnet Nullstellen
  - `evaluateParabola(params, x)`: Wertet Parabel an Stelle x aus

- **conversion.ts**: Konvertierung zwischen Darstellungsformen
  - `vertexToNormal(a, d, e)`: Scheitelpunktform → Normalform
  - `normalToVertex(a, b, c)`: Normalform → Scheitelpunktform

- **validation.ts**: Eingabe-Validierung
  - `validateNumber(input, tolerance)`: Validiert numerische Eingaben
  - `validateFraction(input, target)`: Validiert Bruch-Eingaben

- **exercises.ts**: Aufgaben-Generierung
  - `generateModule1Exercise(difficulty, seed)`: Modul 1 Aufgaben
  - `generateModule2Exercise(difficulty, seed)`: Modul 2 Aufgaben
  - `generateExpandingExercise(difficulty, seed)`: Ausmultiplizieren
  - `generateFactoringExercise(difficulty, seed)`: Faktorisieren
  - `generateRearrangingExercise(difficulty, seed)`: Umstellen

## 🌐 Browser-Kompatibilität

Parabola wird auf folgenden Browsern getestet und unterstützt:

- ✅ Chrome (letzte 2 Versionen)
- ✅ Firefox (letzte 2 Versionen)
- ✅ Safari (letzte 2 Versionen)
- ✅ Edge (letzte 2 Versionen)

Internet Explorer wird **nicht** unterstützt.

## 📦 Deployment

### Standalone Desktop Application

Parabola kann als eigenständige Desktop-Anwendung für Linux, Windows und macOS gebaut werden:

```bash
# Build für das aktuelle System
npm run build:electron

# Spezifische Plattformen
npm run build:linux    # Linux AppImage und .deb
npm run build:win      # Windows NSIS Installer und Portable
npm run build:mac      # macOS .dmg und .zip
```

Die Installatoren befinden sich nach dem Build im `release/` Verzeichnis.

**Hinweis**: Cross-Plattform-Builds funktionieren möglicherweise nicht ohne weiteres. Es wird empfohlen, die Builds auf der jeweiligen Zielplattform zu erstellen.

### Web Deployment

#### Production Build

```bash
# Build erstellen
npm run build

# Build lokal testen
npm run preview
```

Der optimierte Build befindet sich in `dist/`. Diese Dateien können auf einem beliebigen statischen Webserver gehostet werden.

#### GitHub Pages

Das Projekt kann einfach auf GitHub Pages deployed werden:

```bash
# gh-pages installieren
npm install -D gh-pages

# Deployen
npm run build
npx gh-pages -d dist
```

#### GitHub Codespaces

Parabola ist für die Entwicklung in GitHub Codespaces vorbereitet. Siehe [doc/codespaces-setup.md](doc/codespaces-setup.md) für Details.

## 📄 Lizenz

Siehe [LICENSE](LICENSE) für Details.

## 🙏 Danksagungen

Dieses Projekt wurde entwickelt, um Schülerinnen und Schülern das Verständnis quadratischer Funktionen zu erleichtern. Besonderer Dank gilt der Open-Source-Community für die verwendeten Bibliotheken und Tools.

## 📞 Kontakt & Support

- **Issues**: [GitHub Issues](https://github.com/FrankBlabu/ParabelLab/issues)
- **Diskussionen**: [GitHub Discussions](https://github.com/FrankBlabu/ParabelLab/discussions)
- **Repository**: [github.com/FrankBlabu/ParabelLab](https://github.com/FrankBlabu/ParabelLab)

---

**Entwickelt mit ❤️ und TypeScript**
