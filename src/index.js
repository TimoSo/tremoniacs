import { createRoot } from 'react-dom/client'
import React, { Suspense, useState, useEffect } from 'react'
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

        <p className="detail-text detail-enter-text">{proj.description}</p>
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
          Instagram
        </a>
        <a href="https://www.youtube.com/@andieundroy" target="_blank" rel="noopener noreferrer">
          YouTube
        </a>
      </nav>
      <div className={`burger ${menuOpen ? 'burger-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span /><span />
      </div>
    </header>
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
        <App
          page={page === 'about' ? 'detail' : page}
          onObjectHover={setObjectHovered}
          onReadMore={handleReadMore}
          onBack={handleBack}
        />
      </Suspense>

      {/* Hintergrund-Titel */}
      <div className={`main-background-title ${titleVisible ? 'title-visible' : 'title-hidden'} ${objectHovered && page === 'home' ? 'title-outline' : ''}`}>
        <h1>
          TREMO
          <br />
          NIACS
        </h1>
      </div>

      {/* Seiten */}
      {page === 'about' && <AboutPage onBack={handleAboutBack} />}
      {(page === 'detail' || detailExiting) && detailIndex !== null && (
        <DetailPage projectIndex={detailIndex} onBack={handleBack} leaving={detailExiting} />
      )}
    </>
  )
}

createRoot(document.getElementById('root')).render(<MainApp />)
