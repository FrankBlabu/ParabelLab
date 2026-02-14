# Beitragen zu Parabola

Vielen Dank für dein Interesse, zu Parabola beizutragen! Diese Anleitung hilft dir, schnell loszulegen.

## 🚀 Erste Schritte

### Entwicklungsumgebung einrichten

1. **Repository forken und klonen**
   ```bash
   git clone https://github.com/<dein-username>/Parabola.git
   cd Parabola
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

4. **Tests ausführen**
   ```bash
   npm run test
   ```

### Projekt erkunden

- Lies die [Architektur-Dokumentation](doc/planning/00-overview.md)
- Schau dir die [Planungsdokumente](doc/planning/) an
- Stöbere im [Benutzerhandbuch](doc/BENUTZERHANDBUCH.md)
- Lies [LEARNINGS.md](LEARNINGS.md) für Erkenntnisse aus der Entwicklung

## 📋 Workflow

### 1. Issue auswählen oder erstellen

- Schau dir die [offenen Issues](https://github.com/FrankBlabu/Parabola/issues) an
- Kommentiere das Issue, wenn du daran arbeiten möchtest
- Erstelle ein neues Issue für neue Features oder Bugs

### 2. Feature Branch erstellen

```bash
git checkout -b feature/deine-kurze-beschreibung
# oder
git checkout -b fix/bug-beschreibung
```

Branch-Namenskonventionen:
- `feature/` - Neue Features
- `fix/` - Bug-Fixes
- `docs/` - Dokumentationsänderungen
- `refactor/` - Code-Refactoring
- `test/` - Test-Ergänzungen

### 3. Änderungen implementieren

- Schreibe sauberen, gut dokumentierten Code
- Folge den [Code-Stil-Richtlinien](#-code-stil)
- Füge Tests für neue Funktionen hinzu
- Aktualisiere die Dokumentation bei Bedarf

### 4. Tests und Checks ausführen

Bevor du committest, stelle sicher, dass alles funktioniert:

```bash
# Lint-Checks
npm run lint

# Tests
npm run test

# Build
npm run build
```

Alle drei müssen erfolgreich durchlaufen!

### 5. Committen

Schreibe aussagekräftige Commit-Messages:

```bash
git add .
git commit -m "feat: Add new exercise type for Module 3"
```

Commit-Message-Format:
- `feat:` - Neues Feature
- `fix:` - Bug-Fix
- `docs:` - Dokumentation
- `test:` - Tests
- `refactor:` - Code-Refactoring
- `style:` - Formatierung, keine Code-Änderungen
- `chore:` - Build-Prozess, Tooling

### 6. Pull Request erstellen

```bash
git push origin feature/deine-beschreibung
```

Dann auf GitHub:
1. Öffne einen Pull Request
2. Beschreibe deine Änderungen ausführlich
3. Verlinke relevante Issues
4. Warte auf Code Review

## 💻 Code-Stil

### TypeScript

- **Typsicherheit**: Keine `any`-Types, alle Funktionen vollständig typisiert
- **Readonly**: Verwende `readonly` für Immutability
- **Interface vs Type**: Bevorzuge `interface` für Objekt-Typen, `type` für Unions/Intersections

```typescript
// ✅ Gut
interface ParabolaParams {
  readonly a: number;
  readonly d: number;
  readonly e: number;
}

function convertToNormal(params: ParabolaParams): NormalForm {
  // ...
}

// ❌ Schlecht
function convertToNormal(params: any) {
  // ...
}
```

### React-Komponenten

- **Funktionale Komponenten**: Nur Function Components, keine Class Components
- **JSX.Element**: Expliziter Rückgabetyp für alle Komponenten
- **Props**: Immer als readonly interface definieren

```typescript
// ✅ Gut
interface ButtonProps {
  readonly label: string;
  readonly onClick: () => void;
  readonly disabled?: boolean;
}

export default function Button({ label, onClick, disabled = false }: ButtonProps): JSX.Element {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

// ❌ Schlecht
export default function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Hooks

- **Custom Hooks**: Prefix mit `use`
- **Dependencies**: Vollständige Abhängigkeits-Arrays in `useEffect`, `useMemo`, `useCallback`

```typescript
// ✅ Gut
export function useParabola(initialA = 1, initialD = 0, initialE = 0) {
  const [a, setA] = useState(initialA);
  
  const normalForm = useMemo(
    () => vertexToNormal(a, d, e),
    [a, d, e] // Alle verwendeten Variablen
  );
  
  return { a, setA, normalForm };
}
```

### Kommentare

- **JSDoc**: Für alle exportierten Funktionen, Komponenten, Typen
- **Inline-Kommentare**: Nur für komplexe Logik, nicht das "Was" sondern das "Warum"

```typescript
/**
 * Converts a parabola from vertex form to normal form.
 *
 * Uses the binomial formula: a(x-d)² + e = a(x² - 2dx + d²) + e
 *
 * @param a - Leading coefficient (must not be 0)
 * @param d - Horizontal shift (vertex x-coordinate)
 * @param e - Vertical shift (vertex y-coordinate)
 * @returns The normal form parameters {a, b, c}
 */
export function vertexToNormal(a: number, d: number, e: number): NormalForm {
  // Handle -0 to normalize to +0
  const b = -2 * a * d === 0 ? 0 : -2 * a * d;
  const c = a * d * d + e === 0 ? 0 : a * d * d + e;
  
  return { a, b, c };
}
```

### Tailwind CSS

- **Utility-First**: Bevorzuge Utility-Klassen über Custom CSS
- **Responsive**: Mobile-First (`sm:`, `md:`, `lg:`)
- **Accessibility**: Immer Fokus-Indikatoren einbauen

```tsx
// ✅ Gut
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
  Klicken
</button>

// ❌ Schlecht
<button style={{backgroundColor: 'blue', padding: '8px 16px'}}>
  Klicken
</button>
```

## 🧪 Testing

### Test-Philosophie

- **Unit Tests**: Für Pure Functions (Engine, Utils)
- **Component Tests**: Für React-Komponenten
- **Integration Tests**: Für komplette User-Flows

### Test-Struktur

```typescript
import { describe, it, expect } from 'vitest';

describe('vertexToNormal', () => {
  it('converts simple vertex form with a=1, d=0, e=0', () => {
    const result = vertexToNormal(1, 0, 0);
    expect(result).toEqual({ a: 1, b: 0, c: 0 });
  });

  it('handles negative values correctly', () => {
    const result = vertexToNormal(-2, 3, -5);
    expect(result).toEqual({ a: -2, b: 12, c: -23 });
  });
  
  it('normalizes negative zero to positive zero', () => {
    const result = vertexToNormal(-2, 0, 0);
    expect(result.b).toBe(0); // Not -0
  });
});
```

### React Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click Me" onClick={() => {}} />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<Button label="Click" onClick={handleClick} />);
    await user.click(screen.getByText('Click'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test-Abdeckung

- **Engine & Utils**: 100% Coverage anstreben
- **Components**: Kritische Pfade testen
- **UI**: Benutzer-Interaktionen testen

```bash
# Coverage-Report anzeigen
npm run test -- --coverage
```

## 📝 Dokumentation

### Wann aktualisieren?

- **Neue Features**: Planning-Dokumente und README aktualisieren
- **API-Änderungen**: JSDoc-Kommentare anpassen
- **Bug-Fixes**: LEARNINGS.md ergänzen, wenn relevant
- **Breaking Changes**: Migrations-Guide bereitstellen

### Dokumentations-Typen

1. **Code-Kommentare**: JSDoc für alle öffentlichen APIs
2. **README.md**: Überblick, Setup, Architektur
3. **Planning Docs**: Detaillierte technische Planung
4. **BENUTZERHANDBUCH.md**: Anleitung für End-User
5. **LEARNINGS.md**: Erkenntnisse aus der Entwicklung

## 🔍 Code Review

### Was wird überprüft?

- ✅ Code-Stil und Konventionen eingehalten
- ✅ Tests vorhanden und alle grün
- ✅ Keine TypeScript-Fehler
- ✅ Keine ESLint-Warnings
- ✅ Dokumentation aktualisiert
- ✅ Performance-Impact berücksichtigt
- ✅ Accessibility nicht beeinträchtigt
- ✅ Responsive Design funktioniert

### Review-Prozess

1. GitHub prüft automatisch:
   - Build erfolgreich
   - Tests erfolgreich
   - Keine Linter-Fehler

2. Maintainer prüfen:
   - Code-Qualität
   - Architektur-Konformität
   - Test-Coverage
   - Dokumentation

3. Feedback einarbeiten
4. Erneutes Review wenn nötig
5. Merge durch Maintainer

## 🐛 Bug Reports

Gute Bug-Reports enthalten:

- **Beschreibung**: Was ist das Problem?
- **Schritte zur Reproduktion**: Wie tritt der Bug auf?
- **Erwartetes Verhalten**: Was sollte passieren?
- **Tatsächliches Verhalten**: Was passiert stattdessen?
- **System-Info**: Browser, OS, Version
- **Screenshots**: Falls hilfreich

Template:

```markdown
### Beschreibung
Der Parameter-Slider für 'a' springt zurück auf 0, wenn ich versuche, negative Werte einzustellen.

### Schritte zur Reproduktion
1. Öffne den Parabel-Explorer
2. Ziehe den 'a'-Slider nach links (negativ)
3. Beobachte das Verhalten

### Erwartetes Verhalten
Der Slider sollte negative Werte zulassen und beibehalten.

### Tatsächliches Verhalten
Der Slider springt sofort zurück auf 0.

### System
- Browser: Firefox 120
- OS: Windows 11
- Parabola Version: main branch (commit abc123)

### Screenshots
[Screenshot hier einfügen]
```

## 💡 Feature Requests

Gute Feature-Requests enthalten:

- **Problem**: Welches Problem löst das Feature?
- **Vorschlag**: Wie könnte die Lösung aussehen?
- **Use Case**: Wer profitiert davon?
- **Alternativen**: Andere Lösungsansätze?

## 📊 Performance

- **Bundle Size**: Halte den Build klein (lazy loading!)
- **Runtime**: SVG-Rendering muss flüssig sein (60fps)
- **Memory**: Keine Memory Leaks
- **Lighthouse Score**: Mindestens 90 in allen Kategorien

Tools zum Überprüfen:

```bash
# Bundle-Analyse
npm run build
npx vite-bundle-visualizer
```

## ♿ Accessibility

- **Keyboard Navigation**: Alle Funktionen mit Tastatur erreichbar
- **Screen Reader**: ARIA-Labels wo nötig
- **Focus-Indikatoren**: Immer sichtbar
- **Farbkontrast**: WCAG AA Standard
- **Touch Targets**: Mindestens 44x44px auf Mobile

## 🎯 Best Practices

### DRY (Don't Repeat Yourself)

```typescript
// ✅ Gut: Wiederverwendbare Funktion
function formatParameter(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

// ❌ Schlecht: Duplizierter Code
<div>{a.toFixed(2)}</div>
<div>{d.toFixed(2)}</div>
<div>{e.toFixed(2)}</div>
```

### Separation of Concerns

- **Engine**: Reine Mathematik, keine UI-Logik
- **Hooks**: Business Logic, State Management
- **Components**: Präsentation, keine Berechnungen

### Immutability

```typescript
// ✅ Gut
const newParams = { ...params, a: newA };

// ❌ Schlecht
params.a = newA;
```

## 🙋 Fragen?

- **Diskussionen**: [GitHub Discussions](https://github.com/FrankBlabu/Parabola/discussions)
- **Issues**: [GitHub Issues](https://github.com/FrankBlabu/Parabola/issues)

## 📜 Lizenz

Durch das Beitragen stimmst du zu, dass deine Beiträge unter derselben Lizenz wie das Projekt stehen.

---

**Vielen Dank für deinen Beitrag! 🎉**
