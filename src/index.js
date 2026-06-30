import { createRoot } from 'react-dom/client'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import './styles.css'
import App from './App'
import projectData from './projectData'

/* ========================================= */
/* Projekt-Detailseite mit YouTube-Embed     */
/* ========================================= */

function DetailPage({ projectIndex, onBack, leaving }) {
  const proj = projectData[projectIndex]

  if (!proj) return null

  return (
    <div className={`detail-page ${leaving ? 'detail-page-exit' : ''}`}>
      <div className="back-button detail-enter-image" onClick={onBack}>
        ← ZURÜCK
      </div>
      <div className="detail-content">
        <h2 className="detail-title detail-enter-title">{proj.name}</h2>
        <span className="detail-year detail-enter-image">{proj.year}</span>

        {/* YouTube Embed */}
        {proj.youtubeId && (
          <div className="detail-video-wrapper detail-enter-image">
            <iframe
              src={`https://www.youtube.com/embed/${proj.youtubeId}`}
              title={proj.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Thumbnail Fallback wenn kein Video */}
        {!proj.youtubeId && proj.thumbnail && (
          <div className="detail-image-wrapper detail-enter-image">
            <img src={proj.thumbnail} alt={proj.name} className="detail-image" loading="lazy" />
          </div>
        )}

        {/* Placeholder wenn weder Video noch Thumbnail */}
        {!proj.youtubeId && !proj.thumbnail && (
          <div className="detail-placeholder detail-enter-image">
            <span>Video / Bild folgt</span>
          </div>
        )}

        {proj.description.split('\n\n').map((para, i) => (
          <p key={i} className="detail-text detail-enter-text">{para}</p>
        ))}
      </div>
    </div>
  )
}

/* ========================================= */
/* About-Seite                               */
/* ========================================= */

function AboutPage({ onBack }) {
  return (
    <div className="static-page">
      <div className="back-button" onClick={onBack}>← ZURÜCK</div>
      <div className="static-content">
        <h2 className="static-title">Über uns</h2>
        <figure className="about-image">
          <img src="/Tremoniacs_Bild_01.jpg" alt="Laurin Bürmann und Timo Sodenkamp" loading="lazy" />
        </figure>
        <div className="about-members">
          <div className="member-card">
            <h3>Laurin Bürmann</h3>
            <a href="https://www.instagram.com/laurin_12zwo" target="_blank" rel="noopener noreferrer">
              @laurin_12zwo
            </a>
          </div>
          <div className="member-card">
            <h3>Timo Sodenkamp</h3>
            <a href="https://www.instagram.com/timo_so" target="_blank" rel="noopener noreferrer">
              @timo_so
            </a>
          </div>
        </div>
        <p className="static-text">
          tremoniacs ist ein 3D-Kollektiv aus Dortmund. Wir arbeiten an der Schnittstelle von
          interaktiver Kunst, Game Design, VR/AR und digitaler Szenografie.
        </p>
        <p className="static-text">
          Unsere Projekte verbinden technische Exploration mit narrativer Tiefe —
          von Projection Mapping über Game-Installationen bis hin zu immersiven VR-Erfahrungen.
        </p>

        <h3 className="static-subtitle">Kontakt</h3>
        <p className="static-text">
          Lust auf eine Zusammenarbeit oder einfach eine Frage? Schreib uns gerne.
        </p>
        <a className="contact-button" href="mailto:team@tremoniacs.xyz">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          team@tremoniacs.xyz
        </a>

        <h3 className="static-subtitle">Impressum</h3>
        <address className="impressum">
          Timo Sodenkamp<br />
          Mallinckrodtstr. 52<br />
          DE 44145 Dortmund<br />
          <a href="mailto:team@tremoniacs.xyz">team@tremoniacs.xyz</a>
        </address>
      </div>
    </div>
  )
}

/* ========================================= */
/* Header / Navigation                       */
/* ========================================= */

function Header({ setPage, currentPage }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = (target) => {
    setPage(target)
    setMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="header-logo" onClick={() => navigate('home')}>
        tremoniacs
      </div>
      <nav className={`header-nav ${menuOpen ? 'nav-open' : ''}`}>
        <span className={currentPage === 'home' ? 'nav-active' : ''} onClick={() => navigate('home')}>
          Projekte
        </span>
        <span className={currentPage === 'about' ? 'nav-active' : ''} onClick={() => navigate('about')}>
          Über uns
        </span>
        <a href="https://www.instagram.com/tremoniacs.fbx/" target="_blank" rel="noopener noreferrer">
          Instagram <span className="nav-external-arrow">↗</span>
        </a>
        <a href="https://www.youtube.com/@tremoniacs" target="_blank" rel="noopener noreferrer">
          YouTube <span className="nav-external-arrow">↗</span>
        </a>
      </nav>
      <div className={`burger ${menuOpen ? 'burger-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span /><span />
      </div>
    </header>
  )
}

/* ========================================= */
/* 2D Projekt-Galerie                        */
/* ========================================= */

// Vorschaubild ermitteln: eigenes Thumbnail bevorzugt, sonst YouTube-Standbild
function youtubePreview(id, quality) {
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`
}

function GalleryItem({ proj, onSelect }) {
  const initial = proj.thumbnail
    ? proj.thumbnail
    : proj.youtubeId
    ? youtubePreview(proj.youtubeId, 'maxresdefault')
    : null

  const [src, setSrc] = useState(initial)
  const [failed, setFailed] = useState(initial === null)

  const handleError = () => {
    // maxresdefault existiert nicht für jedes Video → auf hqdefault zurückfallen
    if (proj.youtubeId && src && src.includes('maxresdefault')) {
      setSrc(youtubePreview(proj.youtubeId, 'hqdefault'))
    } else {
      setFailed(true)
    }
  }

  return (
    <figure className="gallery-item" onClick={onSelect}>
      <div className="gallery-frame">
        {!failed && src ? (
          <img src={src} alt={proj.name} loading="lazy" onError={handleError} />
        ) : (
          <div className="gallery-placeholder">
            <span>{proj.name}</span>
          </div>
        )}
      </div>
      <figcaption className="gallery-caption">
        <span className="gallery-name">{proj.name}</span>
        <span className="gallery-year">{proj.year}</span>
      </figcaption>
    </figure>
  )
}

function ProjectGallery({ onSelect, active, activeTag }) {
  return (
    <div className={`gallery-page ${active ? 'gallery-active' : ''}`}>
      <div className="gallery-grid">
        {projectData
          .map((proj, i) => ({ proj, i })) // Original-Index merken
          .filter(({ proj }) => !activeTag || (proj.tags && proj.tags.includes(activeTag)))
          .map(({ proj, i }) => (
            <GalleryItem key={proj.id} proj={proj} onSelect={() => onSelect(i)} />
          ))}
      </div>
    </div>
  )
}

/* ========================================= */
/* Ansicht-Switch (3D / 2D)                  */
/* ========================================= */

function ViewSwitch({ view, setView }) {
  const views = ['3d', '2d']
  const [hovered, setHovered] = useState(null)
  const activeIndex = views.indexOf(view)
  // Zielposition: beim Hovern der Maus folgen, sonst auf der aktiven Ansicht ruhen
  const target = hovered != null ? hovered : activeIndex
  // dunkle Variante nur beim Hovern der nicht-aktiven Ansicht
  const dark = hovered != null && hovered !== activeIndex

  const btnClass = (i) =>
    target === i ? (dark ? 'on-dark' : 'on-bright') : ''

  return (
    <div
      className="view-switch"
      role="group"
      aria-label="Ansicht wechseln"
      onMouseLeave={() => setHovered(null)}>
      <div
        className={`view-switch-thumb ${target === 1 ? 'thumb-2d' : 'thumb-3d'} ${dark ? 'dark' : ''}`}
      />
      <button
        className={`view-switch-btn ${btnClass(0)}`}
        onMouseEnter={() => setHovered(0)}
        onClick={() => {
          setView('3d')
          setHovered(null)
        }}
        aria-label="3D-Ansicht"
        title="3D-Ansicht">
        {/* 360-View: Objekt auf Drehteller mit Rotationspfeilen */}
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <ellipse cx="12" cy="16" rx="9.5" ry="3.6" />
          <rect x="8.5" y="7.5" width="7" height="7" rx="1" />
          <polyline points="4.8 13.9 2.5 16 4.8 18.1" />
          <polyline points="19.2 13.9 21.5 16 19.2 18.1" />
        </svg>
      </button>
      <button
        className={`view-switch-btn ${btnClass(1)}`}
        onMouseEnter={() => setHovered(1)}
        onClick={() => {
          setView('2d')
          setHovered(null)
        }}
        aria-label="2D-Galerie"
        title="2D-Galerie">
        {/* 4 Kacheln */}
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <rect x="3" y="3" width="7.5" height="7.5" rx="1.2" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.2" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.2" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.2" />
        </svg>
      </button>
    </div>
  )
}

/* ========================================= */
/* Tag-Filter (immer nur ein Tag aktiv)      */
/* ========================================= */

const FILTER_TAGS = [
  { id: 'mapping', label: 'Mapping' },
  { id: 'musikvideo', label: 'Musikvideo' },
  { id: 'game', label: 'Game' },
  { id: 'installation', label: 'Installation' },
]

function TagFilter({ active, setActive }) {
  const btnRefs = useRef([])
  const [hovered, setHovered] = useState(null)
  const [thumb, setThumb] = useState({ left: 0, width: 0, visible: false })

  const activeIndex = FILTER_TAGS.findIndex((t) => t.id === active)
  // Zielposition: beim Hovern der Maus folgen, sonst auf dem aktiven Tag ruhen
  const target = hovered != null ? hovered : activeIndex
  // dunkle Variante nur beim Hovern eines noch nicht aktiven Tags
  const dark = hovered != null && hovered !== activeIndex

  useEffect(() => {
    const update = () => {
      const el = target >= 0 ? btnRefs.current[target] : null
      if (el) {
        setThumb({ left: el.offsetLeft, width: el.offsetWidth, visible: true })
      } else {
        setThumb((t) => ({ ...t, visible: false }))
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [target])

  return (
    <div
      className="tag-filter"
      role="group"
      aria-label="Projekte filtern"
      onMouseLeave={() => setHovered(null)}>
      <div
        className={`tag-filter-thumb ${thumb.visible ? 'visible' : ''} ${dark ? 'dark' : ''}`}
        style={{ transform: `translateX(${thumb.left}px)`, width: `${thumb.width}px` }}
      />
      {FILTER_TAGS.map((t, i) => {
        const onThumb = thumb.visible && target === i
        return (
          <button
            key={t.id}
            ref={(el) => (btnRefs.current[i] = el)}
            className={`tag-filter-btn ${onThumb ? (dark ? 'on-dark' : 'on-bright') : ''}`}
            onMouseEnter={() => setHovered(i)}
            // erneuter Klick auf den aktiven Tag hebt die Filterung auf;
            // Hover zurücksetzen, damit auf Touch (kein mouseleave) der
            // dunkle Balken nach dem Abwählen verschwindet
            onClick={() => {
              setActive(active === t.id ? null : t.id)
              setHovered(null)
            }}>
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

/* ========================================= */
/* Hintergrund-Vorschaubild bei aktiver      */
/* Annotation (hinter der 3D-Szene, vor der  */
/* Background-Typo)                          */
/* ========================================= */

function AnnotationPreview({ index }) {
  const proj = index != null ? projectData[index] : null
  const src = proj
    ? proj.thumbnail
      ? proj.thumbnail
      : proj.youtubeId
      ? youtubePreview(proj.youtubeId, 'maxresdefault')
      : null
    : null

  // letztes Bild beim Ausblenden behalten, damit es sauber wegfaden kann
  const [shown, setShown] = useState(null)
  useEffect(() => {
    if (src) setShown(src)
  }, [src])

  const handleError = () => {
    if (proj && proj.youtubeId && shown && shown.includes('maxresdefault')) {
      setShown(youtubePreview(proj.youtubeId, 'hqdefault'))
    }
  }

  return (
    <div className={`annotation-preview ${src ? 'visible' : ''}`}>
      {shown && <img src={shown} alt="" onError={handleError} />}
    </div>
  )
}

/* ========================================= */
/* Main App                                  */
/* ========================================= */

function MainApp() {
  const [page, setPage] = useState('home')
  const [titleVisible, setTitleVisible] = useState(true)
  const [objectHovered, setObjectHovered] = useState(false)
  const [detailIndex, setDetailIndex] = useState(null)
  const [detailExiting, setDetailExiting] = useState(false)
  const [projectsView, setProjectsView] = useState('3d') // '3d' = Canvas, '2d' = Bildergalerie
  const [activeTag, setActiveTag] = useState(null) // null = alle Projekte
  const [previewIndex, setPreviewIndex] = useState(null) // aktive Annotation → Hintergrundbild

  const handleReadMore = (projectIndex) => {
    setTitleVisible(false)
    setDetailIndex(projectIndex)
    setPage('detail')
  }

  const handleBack = () => {
    if (detailExiting) return
    setDetailExiting(true)
    setPage('home')
    setTimeout(() => {
      setDetailExiting(false)
      setDetailIndex(null)
      setTitleVisible(true)
    }, 600)
  }

  const handleAboutBack = () => {
    setPage('home')
    setTitleVisible(true)
  }

  // 2D-Galerie aktiv: Projekte-Ansicht + 2D gewählt
  const galleryActive = page === 'home' && projectsView === '2d'

  // Scroll-gesteuerter Wechsel zwischen 3D und 2D.
  // Runterscrollen in 3D → ab Schwelle nach 2D; in 2D ganz oben weiter
  // hochscrollen → zurück nach 3D. Die Galerie liegt animationslogisch
  // "unter" der 3D-Szene, daher fühlt sich der Wechsel wie Weiterscrollen an.
  const wheelAccum = useRef(0)
  const wheelLock = useRef(false)

  useEffect(() => {
    if (page !== 'home') return

    const THRESHOLD = 700 // ~2-3 Mausrad-Umdrehungen
    const COOLDOWN = 1200 // ms Sperre nach einem Wechsel (gegen Trackpad-Schwung)

    const lockFor = (ms) => {
      wheelLock.current = true
      wheelAccum.current = 0
      setTimeout(() => {
        wheelLock.current = false
      }, ms)
    }

    const onWheel = (e) => {
      if (wheelLock.current) {
        wheelAccum.current = 0
        return
      }

      if (projectsView === '3d') {
        // nur Runterscrollen zählt
        if (e.deltaY > 0) {
          wheelAccum.current += e.deltaY
          if (wheelAccum.current > THRESHOLD) {
            setProjectsView('2d')
            lockFor(COOLDOWN)
          }
        } else {
          wheelAccum.current = 0
        }
      } else {
        // 2D: nur am oberen Ende der Galerie und beim Hochscrollen zählen
        const gallery = document.querySelector('.gallery-page')
        const atTop = !gallery || gallery.scrollTop <= 0
        if (e.deltaY < 0 && atTop) {
          wheelAccum.current += e.deltaY // negativ
          if (wheelAccum.current < -THRESHOLD) {
            setProjectsView('3d')
            lockFor(COOLDOWN)
          }
        } else {
          wheelAccum.current = 0
        }
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [page, projectsView])

  return (
    <>
      {/* Hintergrund-Overlay für Detail/About */}
      <div className={`bg-overlay ${page === 'detail' || page === 'about' || detailExiting ? 'bg-overlay-active' : ''}`} />

      {/* Vorschaubild der aktiven Annotation — hinter der 3D-Szene, vor der Typo */}
      {page === 'home' && !galleryActive && <AnnotationPreview index={previewIndex} />}

      <Header setPage={(p) => {
        if (p === 'home') {
          setPage('home')
          setTitleVisible(true)
          setDetailIndex(null)
          setDetailExiting(false)
        } else if (p === 'about') {
          setPage('about')
          setTitleVisible(false)
        }
      }} currentPage={page} />

      <Suspense fallback={
        <div className="loader-screen">
          <div className="loader">tremoniacs</div>
        </div>
      }>
        {/* 3D-Layer — wird im 2D-Modus nach oben aus dem Bild geschoben */}
        <div className={`scene-3d ${galleryActive ? 'scene-3d-hidden' : ''}`}>
          <App
            page={page === 'about' ? 'detail' : page}
            onObjectHover={setObjectHovered}
            onReadMore={handleReadMore}
            onBack={handleBack}
            galleryActive={galleryActive}
            activeTag={activeTag}
            onAnnotationSelect={setPreviewIndex}
          />
        </div>
      </Suspense>

      {/* Hintergrund-Titel */}
      <div className={`main-background-title ${titleVisible && !galleryActive ? 'title-visible' : 'title-hidden'} ${objectHovered && page === 'home' ? 'title-outline' : ''}`}>
        <h1>
          TREMO
          <br />
          NIACS
        </h1>
      </div>

      {/* 3D/2D-Switch — nur in der Projekte-Ansicht */}
      {page === 'home' && <ViewSwitch view={projectsView} setView={setProjectsView} />}

      {/* Tag-Filter — über der Szene, filtert 3D-Annotations und 2D-Galerie */}
      {page === 'home' && <TagFilter active={activeTag} setActive={setActiveTag} />}

      {/* 2D-Bildergalerie — bleibt in der Projekte-Ansicht gemountet und
          wird per Klasse von unten ein-/ausgeschoben (synchron zum 3D-Layer) */}
      {page === 'home' && (
        <ProjectGallery active={projectsView === '2d'} activeTag={activeTag} onSelect={handleReadMore} />
      )}

      {/* Seiten */}
      {page === 'about' && <AboutPage onBack={handleAboutBack} />}
      {(page === 'detail' || detailExiting) && detailIndex !== null && (
        <DetailPage projectIndex={detailIndex} onBack={handleBack} leaving={detailExiting} />
      )}
    </>
  )
}

createRoot(document.getElementById('root')).render(<MainApp />)
