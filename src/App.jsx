import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import Overlay from './components/Overlay'
import Archive from './components/Archive'

function App() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCanvasVisible, setIsCanvasVisible] = React.useState(false)

  const handleLoadComplete = () => {
    setIsLoading(false)
    // Delay showing the canvas for 500ms
    setTimeout(() => {
      setIsCanvasVisible(true)
    }, 500)
  }

  return (
    <>
      <div
        className="fixed-background"
        style={{
          opacity: isCanvasVisible ? 1 : 0,
          transition: 'opacity 2.5s ease-in-out'
        }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene onLoadComplete={handleLoadComplete} />
          </Suspense>
        </Canvas>
      </div>

      <Overlay />

      <div className="scroll-container">
        <div className="scrolling-text-container">
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
