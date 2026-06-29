import { createRoot } from 'react-dom/client'
import React, { Suspense, useState } from 'react'
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
        <a href="https://www.youtube.com/@andieundroy" target="_blank" rel="noopener noreferrer">
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
  return (
    <div className="view-switch" role="group" aria-label="Ansicht wechseln">
      <div className={`view-switch-thumb ${view === '2d' ? 'thumb-2d' : 'thumb-3d'}`} />
      <button
        className={`view-switch-btn ${view === '3d' ? 'active' : ''}`}
        onClick={() => setView('3d')}>
        3D
      </button>
      <button
        className={`view-switch-btn ${view === '2d' ? 'active' : ''}`}
        onClick={() => setView('2d')}>
        2D
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
  return (
    <div className="tag-filter" role="group" aria-label="Projekte filtern">
      {FILTER_TAGS.map((t) => (
        <button
          key={t.id}
          className={`tag-filter-btn ${active === t.id ? 'active' : ''}`}
          // erneuter Klick auf den aktiven Tag hebt die Filterung auf
          onClick={() => setActive(active === t.id ? null : t.id)}>
          {t.label}
        </button>
      ))}
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

  return (
    <>
      {/* Hintergrund-Overlay für Detail/About */}
      <div className={`bg-overlay ${page === 'detail' || page === 'about' || detailExiting ? 'bg-overlay-active' : ''}`} />

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
