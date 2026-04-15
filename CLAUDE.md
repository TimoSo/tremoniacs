# tremoniacs — 3D Kollektiv Website

## Projektbeschreibung
Portfolio-Website für das 3D-Kollektiv tremoniacs aus Dortmund.
Zentrales Element: ein rotierendes 3D-Objekt (Torus Knot als Placeholder) mit klickbaren Annotations, die auf Projekt-Detailseiten führen.

## Tech Stack
- React 18 + React Three Fiber (@react-three/fiber)
- @react-three/drei (Html, CameraControls, Environment, Float, MeshTransmissionMaterial)
- Three.js 0.153
- maath (easing)
- Hosting: CodeSandbox / Vercel / Netlify

## Projektstruktur
- `src/index.js` — Entry point, Navigation, Seiten-Routing, DetailPage, AboutPage
- `src/App.js` — 3D Canvas mit zentralem Objekt, Kamerasteuerung, Annotations
- `src/projectData.js` — Projekt-Daten (Name, Position, Beschreibung, YouTube-ID, etc.)
- `src/styles.css` — Globale Styles, Dark Theme, Responsive
- `public/index.html` — HTML Template

## Konventionen
- Kommentare auf Deutsch
- CSS Custom Properties für Farben/Fonts
- Komponenten in PascalCase
- Projekt-IDs in kebab-case

## Anpassungen
- **3D-Modell ersetzen:** In App.js die `<torusKnotGeometry>` durch ein `useGLTF('/model.glb')` ersetzen
- **Neues Projekt hinzufügen:** In `projectData.js` ein neues Objekt ans Array anhängen
- **YouTube hinzufügen:** `youtubeId` im jeweiligen Projekt-Objekt setzen (z.B. 'dQw4w9WgXcQ')
- **Thumbnails:** Bilder in `/public/thumbnails/` ablegen und Pfad in `thumbnail` setzen

## Farben
- Accent: #ff6b35 (Orange)
- Accent 2: #4ecdc4 (Teal)
- Background: #0a0a0a
- Text: #e8e8e8

## Mitglieder
- Laurin Bürmann (@laurin_12zwo)
- Timo Sodenkamp (@timo_so)
