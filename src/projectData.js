// Projekt-Daten für die Tremoniacs-Website
// Jedes Projekt wird als Annotation im 3D-Raum platziert

const projectData = [
  {
    id: 'umap',
    name: 'UMAP',
    position: [2.2, 2.8, 1.5],
    shortInfo: 'Interaktive Datenvisualisierung als immersive Installation.',
    description:
      'UMAP ist eine interaktive Installation, die Datenvisualisierung in einen immersiven Erfahrungsraum übersetzt. Das Projekt untersucht, wie abstrakte Datenstrukturen räumlich erlebbar gemacht werden können.',
    youtubeId: null, // YouTube Video-ID hier einfügen, z.B. 'dQw4w9WgXcQ'
    thumbnail: null, // Pfad zum Thumbnail, z.B. '/thumbnails/umap.gif'
    year: '2025',
  },
  {
    id: 'infa',
    name: 'INFA',
    position: [-2.5, 3.2, 0.8],
    shortInfo: 'Digitale Kunst trifft Messekonzept.',
    description:
      'INFA verbindet digitale Kunstproduktion mit dem Format einer Messe-Installation. Besucher:innen erleben eine Verschmelzung von physischem und digitalem Raum.',
    youtubeId: null,
    thumbnail: null,
    year: '2025',
  },
  {
    id: 'hildemaus',
    name: 'Hildemaus',
    position: [0.5, 4.5, -1.2],
    shortInfo: 'Game-Installation mit narrativer Tiefe.',
    description:
      'Hildemaus ist eine Game-Installation, die Spielmechaniken mit einer persönlichen Erzählung verknüpft. Spieler:innen navigieren durch eine Welt, die auf realen Erinnerungen basiert.',
    youtubeId: null,
    thumbnail: null,
    year: '2025',
  },
  {
    id: 'multiversurlaub',
    name: 'Multiversurlaub',
    position: [-1.8, 1.5, 2.2],
    shortInfo: 'VR-Erlebnis: Urlaub in parallelen Realitäten.',
    description:
      'Multiversurlaub lädt ein, verschiedene Versionen einer Urlaubsreise zu erleben — jede in einer leicht verschobenen Realität. Ein VR-Erlebnis über Entscheidungen und ihre Konsequenzen.',
    youtubeId: null,
    thumbnail: null,
    year: '2025',
  },
  {
    id: 'mapping-visuals',
    name: 'Mapping Visuals',
    position: [3.0, 1.2, -0.5],
    shortInfo: 'Live Visuals auf architektonische Oberflächen.',
    description:
      'Projection Mapping und Live Visuals auf architektonische Oberflächen. Echtzeit-generierte Grafiken reagieren auf Musik und verwandeln Gebäude in lebendige Leinwände.',
    youtubeId: null,
    thumbnail: null,
    year: '2024',
  },
  {
    id: 'cerm-suedsee',
    name: 'CERM – Südsee',
    position: [-0.8, 3.8, 1.8],
    shortInfo: 'Interaktive Auseinandersetzung mit kolonialer Geschichte.',
    description:
      'CERM – Südsee ist eine interaktive Arbeit, die sich mit der kolonialen Geschichte der Südsee auseinandersetzt. Digitale Medien werden genutzt, um historische Narrative kritisch zu hinterfragen.',
    youtubeId: null,
    thumbnail: null,
    year: '2024',
  },
  {
    id: 'new-now',
    name: 'New Now',
    position: [1.5, 5.0, 0.3],
    shortInfo: 'Festival-Beitrag: Kunst und Technologie.',
    description:
      'New Now ist ein Beitrag zum gleichnamigen Festival, der Kunst und Technologie in einen Dialog bringt. Die Installation erforscht, wie neue Medien unsere Wahrnehmung von Raum verändern.',
    youtubeId: null,
    thumbnail: null,
    year: '2024',
  },
  {
    id: 'der-sog',
    name: 'Der Sog',
    position: [-2.0, 4.8, -0.8],
    shortInfo: 'Immersive audiovisuelle Erfahrung.',
    description:
      'Der Sog ist eine immersive audiovisuelle Erfahrung, die Besucher:innen in einen Strudel aus Bild und Klang zieht. Die Installation untersucht das Phänomen der digitalen Absorption.',
    youtubeId: null,
    thumbnail: null,
    year: '2024',
  },
  {
    id: 'more-many',
    name: 'More Many',
    position: [2.8, 4.0, 1.0],
    shortInfo: 'Generative Kunst und Multiplizität.',
    description:
      'More Many beschäftigt sich mit generativer Kunst und dem Konzept der Multiplizität. Algorithmen erzeugen endlose Variationen eines Themas — kein Bild gleicht dem anderen.',
    youtubeId: null,
    thumbnail: null,
    year: '2023',
  },
  {
    id: 'yes-ai-can',
    name: 'Yes AI Can',
    position: [-1.2, 2.0, -1.8],
    shortInfo: 'KI als kreatives Werkzeug und Gesprächspartner.',
    description:
      'Yes AI Can hinterfragt die Rolle von Künstlicher Intelligenz in kreativen Prozessen. Die Installation lässt Besucher:innen direkt mit KI interagieren und stellt die Frage: Wer ist hier der Künstler?',
    youtubeId: null,
    thumbnail: null,
    year: '2023',
  },
  {
    id: 'dortmund-dance-division',
    name: 'Dance Division',
    position: [0.2, 1.0, 2.5],
    shortInfo: 'Tanz trifft digitale Szenografie.',
    description:
      'Dortmund Dance Division verbindet Tanz mit digitaler Szenografie. Performer:innen bewegen sich in einer reaktiven visuellen Umgebung, die ihre Bewegungen in Echtzeit transformiert.',
    youtubeId: null,
    thumbnail: null,
    year: '2023',
  },
  {
    id: 'its-not-a-game',
    name: "It's not a game",
    position: [-2.8, 3.5, -1.5],
    shortInfo: 'Game-Mechaniken in der bildenden Kunst.',
    description:
      'The "It\'s not a game" Game nutzt Game-Mechaniken als künstlerisches Medium. Die Arbeit verwischt die Grenzen zwischen Spiel und Kunstwerk, zwischen Spieler:in und Betrachter:in.',
    youtubeId: null,
    thumbnail: null,
    year: '2022',
  },
  {
    id: 'mapping-2021',
    name: 'Mapping 2021',
    position: [1.0, 2.5, -2.0],
    shortInfo: 'Projection Mapping auf urbanem Raum.',
    description:
      'Mapping 2021 ist eine Projection-Mapping-Arbeit, die urbane Räume in Dortmund bespielt. Licht und Animation transformieren vertraute Orte in temporäre Kunsträume.',
    youtubeId: null,
    thumbnail: null,
    year: '2021',
  },
  {
    id: '17-semester',
    name: '17. Semester',
    position: [2.5, 5.2, -0.3],
    shortInfo: 'Dokumentation einer langen Reise durch das Studium.',
    description:
      '17. Semester ist eine künstlerische Dokumentation, die die Erfahrung eines überlangen Studiums reflektiert — mit Humor, Ehrlichkeit und einem Blick auf das, was man unterwegs lernt.',
    youtubeId: null,
    thumbnail: null,
    year: '2021',
  },
]

export default projectData
