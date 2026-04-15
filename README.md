# tremoniacs

Portfolio-Website für das 3D-Kollektiv **tremoniacs** aus Dortmund.

Built with React, React Three Fiber, and Three.js.

## Setup

```bash
npm install
npm start
```

## Projekte hinzufügen

Neue Projekte werden in `src/projectData.js` angelegt:

```js
{
  id: 'projekt-id',
  name: 'Projektname',
  position: [x, y, z],        // Position der Annotation im 3D-Raum
  shortInfo: 'Kurzbeschreibung',
  description: 'Ausführlicher Text...',
  youtubeId: 'VIDEO_ID',       // YouTube Video-ID oder null
  thumbnail: '/thumbnails/bild.jpg',  // oder null
  year: '2025',
}
```

## 3D-Objekt ersetzen

Das aktuelle Torus-Knot-Objekt ist ein Placeholder. Um es durch ein eigenes .glb-Modell zu ersetzen:

1. Lege die .glb-Datei in `/public/`
2. In `src/App.js` ersetze die `<torusKnotGeometry>` durch:
```js
const { scene } = useGLTF('/dein-modell.glb')
<primitive object={scene} />
```

## Links

- [tremoniacs.xyz](https://tremoniacs.xyz)
- [Instagram](https://www.instagram.com/tremoniacs.fbx/)
- [YouTube](https://www.youtube.com/@andieundroy)
