import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, CameraControls, Environment, Float, MeshTransmissionMaterial, useGLTF } from '@react-three/drei'
import { easing } from 'maath'
import projectData from './projectData'

export { projectData }

export default function App({ page, onObjectHover, onReadMore, onBack, galleryActive, activeTag, onAnnotationSelect }) {
  const controlsRef = useRef()
  const [isZoomedIn, setIsZoomedIn] = useState(false)
  const [activeAnnotation, setActiveAnnotation] = useState(null)
  const [infoOverlay, setInfoOverlay] = useState(null)
  const [exitingOverlayData, setExitingOverlayData] = useState(null)
  const [overlayExiting, setOverlayExiting] = useState(false)
  const hasRendered = useRef(false)

  const handleZoomTo = useCallback(
    (ref) => {
      if (!controlsRef.current) return
      setIsZoomedIn(true)
      controlsRef.current.fitToBox(ref.current, true, {
        paddingTop: 3,
        paddingLeft: 3,
        paddingBottom: 3,
        paddingRight: 3,
      })
    },
    []
  )

  const handleReset = useCallback(
    (animate) => {
      if (!controlsRef.current) return
      setIsZoomedIn(false)
      setActiveAnnotation(null)
      setInfoOverlay(null)
      controlsRef.current.setLookAt(0, 2, 14, 0, 0.5, 0, animate)
    },
    []
  )

  useEffect(() => {
    if (!hasRendered.current) {
      hasRendered.current = true
    } else if (page === 'home') {
      handleReset(true)
    } else if (page === 'detail') {
      setIsZoomedIn(false)
      setActiveAnnotation(null)
    }
  }, [page, handleReset])

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault()
      if (page === 'home') {
        handleReset(true)
      } else if (page === 'detail' && onBack) {
        onBack()
      }
    }
    window.addEventListener('contextmenu', handleContextMenu)
    return () => window.removeEventListener('contextmenu', handleContextMenu)
  }, [page, handleReset, onBack])

  // aktiven Annotation-Index nach oben melden (für das Hintergrund-Vorschaubild)
  useEffect(() => {
    if (onAnnotationSelect) onAnnotationSelect(activeAnnotation)
  }, [activeAnnotation, onAnnotationSelect])

  const handleReadMoreClick = () => {
    if (activeAnnotation !== null && onReadMore) {
      setExitingOverlayData(infoOverlay)
      setOverlayExiting(true)
      setInfoOverlay(null)
      setActiveAnnotation(null)
      onReadMore(activeAnnotation)
      setTimeout(() => {
        setOverlayExiting(false)
        setExitingOverlayData(null)
      }, 1500)
    }
  }

  return (
    <>
      <Canvas
        shadows="basic"
        eventSource={document.getElementById('root')}
        eventPrefix="client"
        camera={{ position: [0, 2, 14], fov: 45 }}
        onPointerMissed={() => {
          if (isZoomedIn) handleReset(true)
        }}>
        <fog attach="fog" args={['#0a0a0a', 0, 35]} />

        <CentralObject
          page={page}
          handleZoomTo={handleZoomTo}
          isZoomedIn={isZoomedIn}
          activeAnnotation={activeAnnotation}
          setActiveAnnotation={setActiveAnnotation}
          setInfoOverlay={setInfoOverlay}
          onObjectHover={onObjectHover}
          onBack={onBack}
          activeTag={activeTag}
          galleryActive={galleryActive}
          position={[0, 0, 0]}
        />

        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, -20]} intensity={3} color="#D6FB1D" />
        <pointLight position={[-10, 8, 10]} intensity={2} color="#4ecdc4" />
        <pointLight position={[0, -5, 5]} intensity={1} color="#ffe66d" />
        <Environment preset="night" />

        <CameraControls
          ref={controlsRef}
          // im 2D-Modus deaktivieren, sonst fängt camera-controls die
          // Wheel-Events ab und blockiert das Scrollen der Galerie
          enabled={page === 'home' && !galleryActive}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 2}
          maxAzimuthAngle={Math.PI / 2}
          dollySpeed={0}
          truckSpeed={0}
        />

        {/* Schwebende Partikel im Hintergrund */}
        <FloatingParticles count={80} />
      </Canvas>

      {/* Info-Overlay */}
      {infoOverlay && (
        <div className="annotation-info-overlay annotation-fadein">
          <span className="overlay-year">{infoOverlay.year}</span>
          {infoOverlay.text}
          <br />
          <span className="read-more-button" onClick={handleReadMoreClick}>
            Mehr erfahren →
          </span>
        </div>
      )}

      {overlayExiting && exitingOverlayData && (
        <div className="annotation-info-overlay overlay-exit">
          {exitingOverlayData.text}
          <br />
          <span className="read-more-button">Mehr erfahren →</span>
        </div>
      )}
    </>
  )
}

/* ========================================= */
/* Schwebende Partikel                       */
/* ========================================= */

function FloatingParticles({ count }) {
  const meshRef = useRef()

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 30,
        ],
        speed: 0.1 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
        scale: 0.02 + Math.random() * 0.04,
      })
    }
    return temp
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime
    meshRef.current.children.forEach((child, i) => {
      const p = particles[i]
      child.position.y = p.position[1] + Math.sin(time * p.speed + p.offset) * 1.5
    })
  })

  return (
    <group ref={meshRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position} scale={p.scale}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color="#4ecdc4" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  )
}

/* ========================================= */
/* Zentrales 3D-Objekt (Placeholder)         */
/* Könnt ihr durch ein eigenes .glb ersetzen */
/* ========================================= */

function CentralObject({ page, handleZoomTo, isZoomedIn, activeAnnotation, setActiveAnnotation, setInfoOverlay, onObjectHover, onBack, activeTag, galleryActive, ...props }) {
  const group = useRef()
  const light = useRef()
  const spinRef = useRef()
  const objectRef = useRef()
  const [showAnnotations, setShowAnnotations] = useState(false)
  const [annotationVisibility, setAnnotationVisibility] = useState(projectData.map(() => true))

  const markerRefs = useRef(projectData.map(() => ({ current: null })))
  const lookAtRef = useRef(new THREE.Vector3(0, 0.5, 0))
  const detailTransitionStarted = useRef(false)

  // GLB-Modell laden — wir greifen via nodes auf einzelne Meshes zu, damit
  // der Ring den drei-eigenen MeshTransmissionMaterial-Shader bekommen kann
  // (chromaticAberration / distortion / temporalDistortion sind drei-only)
  const { nodes } = useGLTF('/tremoniacs_Logo_e01.glb')

  const ringNode = nodes.Curve001_1
  const tubesNode = nodes.Curve001_2

  useEffect(() => {
    const timer = setTimeout(() => setShowAnnotations(true), 800)
    return () => clearTimeout(timer)
  }, [])

  useFrame((state, delta) => {
    if (!group.current || !spinRef.current) return

    // Maus-Reaktion auf Home
    if (page === 'home') {
      easing.dampE(group.current.rotation, [0, -state.pointer.x * (Math.PI / 10), 0], 1.5, delta)
      if (light.current) {
        easing.damp3(light.current.position, [state.pointer.x * 12, 0, 8 + state.pointer.y * 4], 0.2, delta)
      }
    } else {
      easing.dampE(group.current.rotation, [0, 0, 0], 1.5, delta)
    }

    let targetPos = [0, 0, 0]
    let targetScale = 1.0

    if (page === 'detail') {
      targetPos = [0, -8, -2]
      targetScale = 1.4

      if (!detailTransitionStarted.current) {
        const dir = new THREE.Vector3()
        state.camera.getWorldDirection(dir)
        lookAtRef.current.copy(state.camera.position).add(dir.multiplyScalar(14))
        detailTransitionStarted.current = true
      }
      easing.damp3(state.camera.position, [0, 2, 14], 0.8, delta)
      easing.damp3(lookAtRef.current, [0, 0.5, 0], 0.8, delta)
      state.camera.lookAt(lookAtRef.current)
    } else {
      detailTransitionStarted.current = false
    }

    if (objectRef.current) {
      easing.damp3(objectRef.current.scale, [targetScale, targetScale, targetScale], 0.8, delta)
    }
    easing.damp3(spinRef.current.position, targetPos, 0.8, delta)

    // Langsame Rotation
    if (spinRef.current && !isZoomedIn) {
      spinRef.current.rotation.y += delta * 0.15
      spinRef.current.rotation.x += delta * 0.05
    }

    // Annotation Sichtbarkeit
    if (spinRef.current && showAnnotations) {
      const camera = state.camera
      const newVisibility = projectData.map((proj) => {
        const worldPos = new THREE.Vector3(...proj.position)
        spinRef.current.localToWorld(worldPos)
        const modelCenter = new THREE.Vector3(0, 3, 0)
        spinRef.current.localToWorld(modelCenter)
        const annDist = camera.position.distanceTo(worldPos)
        const centerDist = camera.position.distanceTo(modelCenter)
        return annDist < centerDist + 3
      })
      setAnnotationVisibility(newVisibility)
    }
  })

  const handleAnnotationClick = (index) => {
    const proj = projectData[index]
    if (activeAnnotation === index) {
      setActiveAnnotation(null)
      setInfoOverlay(null)
    } else {
      setActiveAnnotation(index)
      setInfoOverlay({ text: proj.shortInfo, year: proj.year })
    }
    if (page === 'home') handleZoomTo(markerRefs.current[index])
  }

  return (
    <group ref={group} {...props} dispose={null}>
      <group ref={spinRef}>
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
          <group
            ref={objectRef}
            scale={3}
            onPointerEnter={() => onObjectHover && onObjectHover(true)}
            onPointerLeave={() => onObjectHover && onObjectHover(false)}
            onClick={() => {
              if (page === 'detail' && onBack) onBack()
            }}>
            {/* Ring — iridescenter Glas-Shader (vorher beim Torus Knot eingesetzt) */}
            {ringNode && (
              <mesh
                geometry={ringNode.geometry}
                position={ringNode.position}
                rotation={ringNode.rotation}
                scale={ringNode.scale}
                castShadow
                receiveShadow>
                <MeshTransmissionMaterial
                  backside
                  samples={4}
                  thickness={0.5}
                  chromaticAberration={0.3}
                  anisotropy={0.3}
                  distortion={0.5}
                  distortionScale={0.5}
                  temporalDistortion={0.2}
                  iridescence={1}
                  iridescenceIOR={1}
                  iridescenceThicknessRange={[0, 1400]}
                  color="#1a1a2e"
                  background={new THREE.Color('#0a0a0a')}
                />
              </mesh>
            )}

            {/* Zick-Zack Tubes — neon-grün mit Emission */}
            {tubesNode && (
              <mesh
                geometry={tubesNode.geometry}
                position={tubesNode.position}
                rotation={tubesNode.rotation}
                scale={tubesNode.scale}
                castShadow
                receiveShadow>
                <meshStandardMaterial
                  color="#D6FB1D"
                  emissive="#D6FB1D"
                  emissiveIntensity={0.8}
                  metalness={0.4}
                  roughness={0.3}
                />
              </mesh>
            )}
          </group>
        </Float>

        {/* Unsichtbare Marker für Kamera-Zoom */}
        {projectData.map((proj, i) => (
          <mesh
            key={proj.id + '-marker'}
            ref={(el) => {
              markerRefs.current[i].current = el
            }}
            position={proj.position}
            visible={false}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial />
          </mesh>
        ))}

        {/* Annotations — wenn eine aktiv ist, fade alle anderen aus,
            damit sie sich nicht mit der Info-Box überlappen.
            Tag-Filter blendet nicht passende Projekte aus. */}
        {showAnnotations &&
          page === 'home' &&
          !galleryActive &&
          projectData.map((proj, i) => {
            const matchesTag = !activeTag || (proj.tags && proj.tags.includes(activeTag))
            return (
              <Annotation
                key={proj.id}
                position={proj.position}
                name={proj.name}
                isActive={activeAnnotation === i}
                isVisible={
                  matchesTag &&
                  annotationVisibility[i] &&
                  (activeAnnotation === null || activeAnnotation === i)
                }
                onClick={() => handleAnnotationClick(i)}
              />
            )
          })}
      </group>

      <spotLight
        angle={0.5}
        penumbra={0.5}
        ref={light}
        castShadow
        intensity={2}
        shadow-mapSize={1024}
        shadow-bias={-0.001}>
        <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 0.1, 50]} />
      </spotLight>
    </group>
  )
}

/* ========================================= */
/* Annotation-Komponente                     */
/* ========================================= */

useGLTF.preload('/tremoniacs_Logo_e01.glb')

function Annotation({ name, isActive, isVisible, onClick, ...props }) {
  const handleClick = (e) => {
    e.stopPropagation()
    if (onClick) onClick()
  }

  return (
    <Html
      {...props}
      center
      distanceFactor={12}
      style={{
        transition: 'opacity 0.3s',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}>
      <div className="annotation-container">
        <div
          className={`annotation annotation-fadein ${isActive ? 'annotation-active' : ''}`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleClick}>
          {name}
        </div>
      </div>
    </Html>
  )
}
