import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import Overlay from './components/Overlay'

function App() {
  const [isLoading, setIsLoading] = React.useState(true)

  return (
    <>
      <div className="absolute-full" style={{ zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene onLoadComplete={() => setIsLoading(false)} />
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
