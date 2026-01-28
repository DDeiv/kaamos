import React, { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import Overlay from './components/Overlay'
import Archive from './components/Archive'
import BookingForm from './components/BookingForm'
import LegalFooter from './components/LegalFooter'
import { client } from './sanityClient'

function App() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCanvasVisible, setIsCanvasVisible] = React.useState(false)
  const [bio, setBio] = React.useState(null)
  const [activeSection, setActiveSection] = React.useState('')
  const canvasRef = useRef(null)
  const fogRef = useRef(null)
  const textRef = useRef(null)

  const DEFAULT_BIO = [
    "Pin Ya drifts through the streets like a quiet rumor, a tattooer with ink-stained fingers and a needle that hums with intention. She pokes, pauses, smiles, and pokes again, leaving tiny constellations behind on skin that once was empty. No rush, no noise—just the soft ritual of point after point, story after story.",
    "People say you don’t find Pin Ya, she finds you. One moment you’re minding your business, the next there’s a gentle tap, a sharp little hello, and suddenly your arm remembers something it never knew. Her needle dances, curious and precise, mapping thoughts, symbols, and half-forgotten dreams.",
    "When she moves on, there’s always a trace left behind: a mark, a grin, a faint sting, and the feeling that you’ve been lightly rearranged. Pin Ya keeps walking, needle ready, already looking for the next place to poke meaning into the world."
  ]

  // Detect if device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768

  const handleLoadComplete = React.useCallback(() => {
    setIsLoading(false)
    // Faster delay for desktop (500ms), slower for mobile (500ms)
    setTimeout(() => {
      setIsCanvasVisible(true)
    }, 500)
  }, [])

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const query = '*[_type == "siteSettings"][0]{ bio }'
        const data = await client.fetch(query)
        if (data?.bio) {
          // Split by numeric or double newlines to split paragraphs
          const paragraphs = data.bio.split(/\n\s*\n/).filter(p => p.trim())
          setBio(paragraphs)
        }
      } catch (err) {
        console.error("Failed to fetch bio from Sanity:", err)
      }
    }
    fetchBio()

    const handleScroll = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1)
      if (canvasRef.current) {
        canvasRef.current.style.opacity = 1 - progress * 0.7
      }
      if (fogRef.current) {
        fogRef.current.style.opacity = progress * 0.5
      }
      if (textRef.current) {
        textRef.current.style.opacity = 1 - progress
      }

      // More precise active section detection
      const sectionIds = ['bio', 'previous-work', 'available-work', 'booking']
      const activationPoint = window.innerHeight * 0.4 // 40% from top

      let foundActive = ''
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          // If the section's top has passed the activation point
          // AND the bottom hasn't passed it yet
          if (rect.top <= activationPoint && rect.bottom >= activationPoint) {
            foundActive = id
            break
          }
        }
      }

      // Special case: if we are at the very top, clear everything
      if (window.scrollY < window.innerHeight * 0.3) {
        setActiveSection('')
      } else if (foundActive) {
        setActiveSection(foundActive)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [bio])

  return (
    <>
      <div
        ref={canvasRef}
        className="fixed-background"
        style={{
          opacity: isCanvasVisible ? 1 : 0,
          transition: `opacity ${isMobile ? '2.5s' : '0.5s'} ease-in-out`
        }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene onLoadComplete={handleLoadComplete} />
          </Suspense>
        </Canvas>
      </div>
      <div
        ref={fogRef}
        className="fixed-background"
        style={{
          backgroundColor: '#f7f7f7',
          opacity: 0,
          pointerEvents: 'none'
        }}
      />

      <Overlay activeSection={activeSection} />

      <div className="scroll-container">
        <div ref={textRef} className="scrolling-text-container">
          <div className="scrolling-text">
            KAAMOS LEMME PUT INK UNDER YOUR SKIN • KAAMOS LEMME PUT INK UNDER YOUR SKIN • KAAMOS LEMME PUT INK UNDER YOUR SKIN •
          </div>
        </div>

        <div id="bio" className="bio-section">
          {(bio || DEFAULT_BIO).map((para, i) => (
            <p key={i} className="bio-paragraph">
              {para}
            </p>
          ))}
        </div>

        <Archive />

        <BookingForm />

        <LegalFooter />
      </div>
    </>
  )
}

export default App
