# Deployment-Anleitung

Diese Anleitung beschreibt, wie Parabola als standalone Desktop-Anwendung oder Webanwendung deployed werden kann.

## Standalone Desktop-Anwendung

### Voraussetzungen

- Node.js (Version 18 oder höher)
- npm
- Entwicklungsumgebung für die Zielplattform

### Build-Prozess

Parabola verwendet Electron und electron-builder, um plattformspezifische Installatoren zu erstellen.

#### Alle Plattformen (aktuelles System)

```bash
npm run build:electron
```

Dieser Befehl erstellt Installatoren für das System, auf dem er ausgeführt wird. Die fertigen Pakete befinden sich im `release/` Verzeichnis.

#### Linux

```bash
npm run build:linux
```

Erstellt folgende Distributionen:
- **AppImage**: Portable Anwendung, die auf allen Linux-Distributionen läuft
- **.deb**: Debian/Ubuntu Paket

Die Pakete befinden sich in `release/`:
- `Parabola-{version}.AppImage`
- `parabola_{version}_amd64.deb`

**Installation:**
- AppImage: Datei ausführbar machen und direkt starten
  ```bash
  chmod +x Parabola-*.AppImage
  ./Parabola-*.AppImage
  ```
- DEB: Mit Package Manager installieren
  ```bash
  sudo dpkg -i parabola_*.deb
  # Falls Abhängigkeiten fehlen:
  sudo apt-get install -f
  ```

#### Windows

```bash
npm run build:win
```

Erstellt folgende Distributionen:
- **NSIS Installer**: Klassischer Windows-Installer mit Deinstallationsprogramm
- **Portable**: Standalone-EXE ohne Installation

Die Pakete befinden sich in `release/`:
- `Parabola Setup {version}.exe` (Installer)
- `Parabola {version}.exe` (Portable)

**Hinweis**: Für das Signieren der Windows-Binaries wird ein Code-Signing-Zertifikat benötigt. Ohne Signierung zeigt Windows SmartScreen eine Warnung an.

#### macOS

```bash
npm run build:mac
```

Erstellt folgende Distributionen:
- **.dmg**: Standard-macOS-Disk-Image mit Drag-and-Drop-Installation
- **.zip**: Komprimierte App für direkten Download

Die Pakete befinden sich in `release/`:
- `Parabola-{version}.dmg`
- `Parabola-{version}-mac.zip`

**Hinweis**: Für die Distribution im App Store oder das Signieren der App ist ein Apple Developer Account erforderlich.

### Cross-Plattform-Builds

electron-builder unterstützt grundsätzlich Cross-Plattform-Builds, aber:

- **macOS-Builds** können nur auf macOS erstellt werden (wegen Apple-Limitierungen)
- **Windows-Builds** können theoretisch auf Linux erstellt werden, aber dies erfordert zusätzliche Tools (wine)
- **Linux-Builds** können auf allen Plattformen erstellt werden

**Empfehlung**: Nutzen Sie CI/CD (z.B. GitHub Actions) für Multi-Plattform-Builds, um Builds auf den nativen Plattformen zu erstellen.

### GitHub Actions Beispiel

Erstellen Sie `.github/workflows/build.yml`:

```yaml
name: Build Desktop App

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]

    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build desktop app
        run: npm run build:electron

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-release
          path: release/
```

### Konfiguration anpassen

Die electron-builder Konfiguration befindet sich in `package.json` unter dem `build`-Schlüssel:

```json
{
  "build": {
    "appId": "com.parabellab.parabola",
    "productName": "Parabola",
    "directories": {
      "output": "release"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "category": "Education",
      "icon": "assets/icon.png"
    },
    "win": {
      "target": ["nsis", "portable"],
      "icon": "assets/icon.png"
    },
    "mac": {
      "target": ["dmg", "zip"],
      "icon": "assets/icon.png",
      "category": "public.app-category.education"
    }
  }
}
```

Weitere Konfigurationsoptionen: [electron-builder Dokumentation](https://www.electron.build/)

## Web-Deployment

### Statischer Webserver

```bash
npm run build
```

Der optimierte Build befindet sich in `dist/`. Diese Dateien können auf einem beliebigen statischen Webserver gehostet werden (z.B. nginx, Apache, AWS S3 + CloudFront).

**Wichtig**: Konfigurieren Sie den Webserver für Single-Page-Application-Routing:
- Alle Anfragen sollten `index.html` ausliefern (außer statische Assets)
- Beispiel nginx-Konfiguration:
  ```nginx
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```

### GitHub Pages

```bash
# gh-pages installieren
npm install -D gh-pages

# Deployen
npm run build
npx gh-pages -d dist
```

**Hinweis**: Bei GitHub Pages muss ggf. die `base` in `vite.config.ts` angepasst werden:

```typescript
export default defineConfig({
  base: '/ParabelLab/', // Repository-Name
  // ...
});
```

### Netlify / Vercel

Beide Plattformen unterstützen Vite-Projekte out-of-the-box:

1. Repository mit GitHub/GitLab verbinden
2. Build-Command: `npm run build`
3. Publish-Directory: `dist`
4. Deploy!

### Docker

Beispiel `Dockerfile` für Produktion:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Versionierung

Verwenden Sie semantische Versionierung:
- **MAJOR**: Breaking Changes
- **MINOR**: Neue Features (abwärtskompatibel)
- **PATCH**: Bug-Fixes

Version in `package.json` anpassen:

```json
{
  "version": "1.2.3"
}
```

Diese Version wird automatisch in den Electron-Builds verwendet.

## Changelog

Pflegen Sie ein CHANGELOG.md für Release-Notes:

```markdown
# Changelog

## [1.0.0] - 2024-02-14
### Added
- Standalone Desktop-Anwendung für Linux und Windows
- Electron-basiertes Packaging mit electron-builder

### Changed
- ...

### Fixed
- ...
```

## Troubleshooting

### Electron-Build schlägt fehl

**Problem**: `electron-builder` kann Abhängigkeiten nicht installieren
**Lösung**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Windows SmartScreen-Warnung

**Problem**: Windows zeigt Warnung "Unbekannter Herausgeber"
**Lösung**:
- Für Entwicklung: Benutzer können "Weitere Informationen" → "Trotzdem ausführen" wählen
- Für Produktion: App mit Code-Signing-Zertifikat signieren

### macOS "App kann nicht geöffnet werden"

**Problem**: macOS blockiert unsignierte Apps
**Lösung**:
- Rechtsklick auf App → "Öffnen" (statt Doppelklick)
- Oder: Systemeinstellungen → Sicherheit → App erlauben
- Für Produktion: App mit Apple Developer Zertifikat signieren

### Linux AppImage startet nicht

**Problem**: FUSE fehlt (auf manchen Systemen)
**Lösung**:
```bash
sudo apt install fuse libfuse2
```

Alternativ: AppImage entpacken und direkt ausführen:
```bash
./Parabola-*.AppImage --appimage-extract
./squashfs-root/parabola
```
