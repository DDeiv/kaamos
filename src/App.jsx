import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import Overlay from './components/Overlay'

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
        className="absolute-full"
        style={{
          zIndex: 0,
          opacity: isCanvasVisible ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene onLoadComplete={handleLoadComplete} />
          </Suspense>
        </Canvas>
      </div>
      <div className="absolute-full" style={{ zIndex: 1, pointerEvents: 'none' }}>
        <Overlay isLoading={isLoading} />
      </div>
    </>
  )
}

export default App
