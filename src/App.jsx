import React, { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import Overlay from './components/Overlay'
import Archive from './components/Archive'

function App() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCanvasVisible, setIsCanvasVisible] = React.useState(false)
  const canvasRef = useRef(null)
  const fogRef = useRef(null)
  const textRef = useRef(null)

  // Detect if device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768

  const handleLoadComplete = () => {
    setIsLoading(false)
    // Faster delay for desktop (500ms), slower for mobile (500ms)
    setTimeout(() => {
      setIsCanvasVisible(true)
    }, 500)
  }

  useEffect(() => {
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
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

      <Overlay />

      <div className="scroll-container">
        <div ref={textRef} className="scrolling-text-container">
          <div className="scrolling-text">
            KAAMOS LEMME PUT INK UNDER YOUR SKIN • KAAMOS LEMME PUT INK UNDER YOUR SKIN • KAAMOS LEMME PUT INK UNDER YOUR SKIN •
          </div>
        </div>
        <Archive />
      </div>
    </>
  )
}

export default App
